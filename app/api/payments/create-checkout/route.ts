import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { createCheckout } from "@/lib/payments/payment-provider";
import { clientIdentifier, rateLimit } from "@/lib/security/rate-limit";

const checkoutSchema = z.object({
  plan: z.enum(["starter", "pro", "agency", "credits_100", "credits_250"]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`checkout:${clientIdentifier(request.headers)}`, {
      limit: 15,
      windowMs: 60_000
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again shortly." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const businessUser = await requireCurrentBusinessUser();
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
    }

    const checkout = await createCheckout({
      businessId: businessUser.business_id,
      ...parsed.data
    });

    return NextResponse.json(checkout);
  } catch (error) {
    console.error("create-checkout failed", error);
    return NextResponse.json({ error: "Unable to create checkout." }, { status: 500 });
  }
}
