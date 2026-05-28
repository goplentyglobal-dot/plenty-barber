import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCurrentBusinessUser } from "@/lib/auth/current-user";
import { createCheckout } from "@/lib/payments/payment-provider";

const checkoutSchema = z.object({
  plan: z.enum(["starter", "pro", "agency", "credits_100", "credits_250"]),
  successUrl: z.string().url(),
  cancelUrl: z.string().url()
});

export async function POST(request: Request) {
  try {
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
    const message = error instanceof Error ? error.message : "Unable to create checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
