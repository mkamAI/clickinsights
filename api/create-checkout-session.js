/**
 * Vercel Serverless Function — POST /api/create-checkout-session
 * Creates a Stripe Checkout session for plan upgrades.
 */
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLANS = {
  pro: process.env.STRIPE_PRICE_PRO,         // $59/mo
  business: process.env.STRIPE_PRICE_BUSINESS, // $149/mo
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { plan, userId, email } = req.body;

    if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price: PLANS[plan], quantity: 1 }],
      metadata: { userId },
      success_url: `${process.env.VITE_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.VITE_APP_URL}/billing?cancelled=true`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[checkout]', err);
    return res.status(500).json({ error: err.message });
  }
}
