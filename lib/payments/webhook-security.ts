import "server-only";
import crypto from "crypto";

type VerifyInput = {
  provider: string;
  rawBody: string;
  payload: unknown;
  headers: Headers;
  url?: string;
};

export function verifyPaymentWebhook(input: VerifyInput) {
  if (input.provider === "wompi") {
    return verifyWompiWebhook(input.payload, input.headers);
  }

  if (input.provider === "stripe") {
    return verifyStripeWebhook(input.rawBody, input.headers);
  }

  if (input.provider === "mercadopago") {
    return verifyMercadoPagoWebhook(input.payload, input.headers, input.url);
  }

  if (input.provider === "payu") {
    return verifyPayUWebhook(input.payload);
  }

  // demo and any unknown provider: only allowed outside production.
  return process.env.NODE_ENV !== "production";
}

function verifyWompiWebhook(payload: unknown, headers: Headers) {
  const secret = process.env.WOMPI_EVENTS_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const event = payload as {
    data?: Record<string, unknown>;
    timestamp?: number | string;
    signature?: {
      properties?: string[];
      checksum?: string;
    };
  };
  const checksum = headers.get("x-event-checksum") || event.signature?.checksum || "";
  const properties = event.signature?.properties || [];

  if (!event.data || !event.timestamp || !checksum || !properties.length) {
    return false;
  }

  const data = event.data;
  const values = properties.map((property) => String(readNested(data, property) ?? "")).join("");
  const expected = sha256(`${values}${event.timestamp}${secret}`);
  return safeEqual(checksum, expected);
}

function verifyStripeWebhook(rawBody: string, headers: Headers) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const signatureHeader = headers.get("stripe-signature") || "";
  const timestamp = signatureHeader
    .split(",")
    .map((item) => item.split("="))
    .find(([key]) => key === "t")?.[1];
  const signatures = signatureHeader
    .split(",")
    .map((item) => item.split("="))
    .filter(([key]) => key === "v1")
    .map(([, value]) => value);

  if (!timestamp || !signatures.length) {
    return false;
  }

  const timestampSeconds = Number(timestamp);
  const nowSeconds = Math.floor(Date.now() / 1000);

  if (!Number.isFinite(timestampSeconds) || Math.abs(nowSeconds - timestampSeconds) > 300) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  return signatures.some((signature) => safeEqual(signature, expected));
}

// Mercado Pago signs notifications with an HMAC over a manifest built from the
// resource id (query param `data.id`), the `x-request-id` header and the `ts`
// from the `x-signature` header: `id:<id>;request-id:<rid>;ts:<ts>;`.
function verifyMercadoPagoWebhook(payload: unknown, headers: Headers, url?: string) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  const signatureHeader = headers.get("x-signature") || "";
  const requestId = headers.get("x-request-id") || "";
  const parts = signatureHeader.split(",").map((item) => item.split("="));
  const ts = parts.find(([key]) => key?.trim() === "ts")?.[1]?.trim();
  const v1 = parts.find(([key]) => key?.trim() === "v1")?.[1]?.trim();

  if (!ts || !v1) {
    return false;
  }

  const dataId = resolveMercadoPagoDataId(payload, url);

  if (!dataId) {
    return false;
  }

  // Mercado Pago lowercases alphanumeric ids in the manifest.
  const normalizedId = /^[a-zA-Z0-9]+$/.test(dataId) ? dataId.toLowerCase() : dataId;
  const manifest = `id:${normalizedId};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
  return safeEqual(v1, expected);
}

function resolveMercadoPagoDataId(payload: unknown, url?: string) {
  if (url) {
    try {
      const queryId = new URL(url).searchParams.get("data.id");
      if (queryId) {
        return queryId;
      }
    } catch {
      // ignore malformed url, fall back to body
    }
  }

  const body = payload as { data?: { id?: unknown }; id?: unknown } | null;
  const fromData = body?.data?.id;
  if (fromData !== undefined && fromData !== null) {
    return String(fromData);
  }

  if (body?.id !== undefined && body?.id !== null) {
    return String(body.id);
  }

  return "";
}

// PayU confirmation pages include a `sign` field that is the MD5 of
// `ApiKey~merchantId~referenceCode~value~currency~statePol`. The value uses a
// specific decimal normalization (a trailing ".x0" is truncated to ".x").
function verifyPayUWebhook(payload: unknown) {
  const apiKey = process.env.PAYU_API_KEY;
  const merchantId = process.env.PAYU_MERCHANT_ID;

  if (!apiKey || !merchantId) {
    return process.env.NODE_ENV !== "production";
  }

  const body = payload as {
    sign?: string;
    reference_sale?: string;
    value?: string | number;
    currency?: string;
    state_pol?: string | number;
    merchant_id?: string | number;
  };

  const sign = String(body.sign ?? "");
  const reference = String(body.reference_sale ?? "");
  const currency = String(body.currency ?? "");
  const statePol = String(body.state_pol ?? "");

  if (!sign || !reference || !currency || !statePol) {
    return false;
  }

  if (body.merchant_id !== undefined && String(body.merchant_id) !== merchantId) {
    return false;
  }

  const normalizedValue = normalizePayUValue(body.value);
  const manifest = `${apiKey}~${merchantId}~${reference}~${normalizedValue}~${currency}~${statePol}`;
  const expected = crypto.createHash("md5").update(manifest).digest("hex");
  return safeEqual(sign.toLowerCase(), expected.toLowerCase());
}

function normalizePayUValue(value: string | number | undefined) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return String(value ?? "");
  }

  const oneDecimal = numeric.toFixed(1);
  const twoDecimals = numeric.toFixed(2);

  // PayU truncates ".x0" to ".x" but keeps ".xy" when the second decimal is non-zero.
  return twoDecimals.endsWith("0") ? oneDecimal : twoDecimals;
}

function readNested(source: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, source);
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}
