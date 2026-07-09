/**
 * Vercel Serverless Function — POST /api/webhook
 * Handles LemonSqueezy webhook events to keep subscription state in Supabase.
 * Add this URL in LemonSqueezy → Settings → Webhooks.
 */
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function verifySignature(rawBody, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const digest = hmac.digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const signature = req.headers['x-signature']
  const rawBody = await getRawBody(req)

  try {
    const valid = verifySignature(rawBody, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET)
    if (!valid) {
      console.error('[webhook] Invalid signature')
      return res.status(400).json({ error: 'Invalid signature' })
    }
  } catch (err) {
    console.error('[webhook] Signature check failed:', err.message)
    return res.status(400).json({ error: 'Signature verification failed' })
  }

  const event = JSON.parse(rawBody.toString())
  const eventName = event.meta?.event_name
  const data = event.data?.attributes
  const userId = event.meta?.custom_data?.user_id

  switch (eventName) {
    case 'order_created':
    case 'subscription_created': {
      if (!userId) break
      const variantId = String(data?.variant_id || data?.first_subscription_item?.variant_id || '')
      const plan = variantId === String(process.env.LEMONSQUEEZY_VARIANT_BUSINESS) ? 'business' : 'pro'

      await supabase.from('subscriptions').upsert({
        user_id: userId,
        lemonsqueezy_customer_id: String(data?.customer_id || ''),
        lemonsqueezy_subscription_id: String(event.data?.id || ''),
        plan,
        status: 'active',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      break
    }

    case 'subscription_updated': {
      const isActive = data?.status === 'active'
      await supabase.from('subscriptions')
        .update({
          status: data?.status,
          plan: isActive ? 'pro' : 'free',
          current_period_end: data?.renews_at || null,
          updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', String(event.data?.id || ''))
      break
    }

    case 'subscription_cancelled':
    case 'subscription_expired': {
      await supabase.from('subscriptions')
        .update({
          status: 'cancelled',
          plan: 'free',
          updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', String(event.data?.id || ''))
      break
    }

    default:
      break
  }

  return res.status(200).json({ received: true })
}
