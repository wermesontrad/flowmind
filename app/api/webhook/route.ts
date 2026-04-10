// ARQUIVO: app/api/webhook/route.ts
// Libera acesso do usuário após pagamento confirmado

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;

    if (email) {
      await supabase.from("usuarios").upsert({
        email,
        acesso_liberado: true,
        plano: "vitalicio",
        valor_pago: 3000,
        stripe_session_id: session.id,
        data_compra: new Date().toISOString(),
      }, { onConflict: "email" });
    }
  }

  return NextResponse.json({ received: true });
}
