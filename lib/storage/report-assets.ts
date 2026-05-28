import "server-only";
import crypto from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ReportListItem } from "@/lib/database/types";

const STORAGE_PREFIX = "storage://";
const CLIENT_PHOTOS_BUCKET = "client-photos";
const REPORT_ILLUSTRATIONS_BUCKET = "report-illustrations";

export async function uploadClientPhoto(input: {
  businessId: string;
  file: File;
  index: number;
}) {
  await ensurePrivateBucket(CLIENT_PHOTOS_BUCKET);
  const extension = extensionFromContentType(input.file.type);
  const path = `${input.businessId}/${Date.now()}-${input.index}-${crypto.randomUUID()}.${extension}`;
  const bytes = Buffer.from(await input.file.arrayBuffer());
  await uploadBytes({
    bucket: CLIENT_PHOTOS_BUCKET,
    path,
    bytes,
    contentType: input.file.type
  });
  return toStorageRef(CLIENT_PHOTOS_BUCKET, path);
}

export async function uploadReportIllustration(input: {
  businessId: string;
  dataUrl: string;
  index: number;
}) {
  const parsed = parseDataUrl(input.dataUrl);

  if (!parsed) {
    return input.dataUrl;
  }

  await ensurePrivateBucket(REPORT_ILLUSTRATIONS_BUCKET);
  const extension = extensionFromContentType(parsed.contentType);
  const path = `${input.businessId}/${Date.now()}-${input.index}-${crypto.randomUUID()}.${extension}`;
  await uploadBytes({
    bucket: REPORT_ILLUSTRATIONS_BUCKET,
    path,
    bytes: parsed.bytes,
    contentType: parsed.contentType
  });
  return toStorageRef(REPORT_ILLUSTRATIONS_BUCKET, path);
}

export async function uploadReportIllustrations(input: {
  businessId: string;
  urls: string[];
}) {
  return Promise.all(
    input.urls.map((url, index) =>
      url.startsWith("data:") ? uploadReportIllustration({ businessId: input.businessId, dataUrl: url, index }) : url
    )
  );
}

export async function resolveReportAssetUrls(report: ReportListItem) {
  return {
    ...report,
    photo_urls: await resolveStorageRefs(report.photo_urls),
    illustration_urls: await resolveStorageRefs(report.illustration_urls)
  };
}

async function ensurePrivateBucket(bucket: string) {
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.storage.getBucket(bucket);

  if (data) {
    return;
  }

  const { error } = await supabase.storage.createBucket(bucket, {
    public: false,
    fileSizeLimit: 15 * 1024 * 1024
  });

  if (error && !String(error.message).toLowerCase().includes("already exists")) {
    throw new Error(`Unable to create storage bucket: ${bucket}`);
  }
}

async function uploadBytes(input: {
  bucket: string;
  path: string;
  bytes: Buffer;
  contentType: string;
}) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(input.bucket).upload(input.path, input.bytes, {
    contentType: input.contentType,
    upsert: false
  });

  if (error) {
    throw new Error(`Unable to upload report asset: ${error.message}`);
  }
}

async function resolveStorageRefs(urls: string[] | null) {
  if (!urls?.length) {
    return urls;
  }

  return Promise.all(urls.map((url) => (isStorageRef(url) ? createSignedUrl(url) : url)));
}

async function createSignedUrl(ref: string) {
  const parsed = parseStorageRef(ref);

  if (!parsed) {
    return ref;
  }

  const supabase = createSupabaseAdminClient();
  const expiresIn = Number(process.env.SIGNED_URL_EXPIRATION_DAYS || 30) * 24 * 60 * 60;
  const { data, error } = await supabase.storage.from(parsed.bucket).createSignedUrl(parsed.path, expiresIn);

  if (error || !data?.signedUrl) {
    return ref;
  }

  return data.signedUrl;
}

function toStorageRef(bucket: string, path: string) {
  return `${STORAGE_PREFIX}${bucket}/${path}`;
}

function isStorageRef(value: string) {
  return value.startsWith(STORAGE_PREFIX);
}

function parseStorageRef(ref: string) {
  if (!isStorageRef(ref)) {
    return null;
  }

  const withoutPrefix = ref.slice(STORAGE_PREFIX.length);
  const slashIndex = withoutPrefix.indexOf("/");

  if (slashIndex <= 0) {
    return null;
  }

  return {
    bucket: withoutPrefix.slice(0, slashIndex),
    path: withoutPrefix.slice(slashIndex + 1)
  };
}

function parseDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    contentType: match[1],
    bytes: Buffer.from(match[2], "base64")
  };
}

function extensionFromContentType(contentType: string) {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  if (contentType === "image/svg+xml") return "svg";
  return "jpg";
}
