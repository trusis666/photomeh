import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: NextRequest) {
  try {
    // Optionally, you can pass metadata (e.g., image info)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 200, // 2 EUR in cents
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      description: "PhotoMeh Damage Report",
    });
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
