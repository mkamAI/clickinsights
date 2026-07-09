/**
 * Vercel Serverless Function — POST /api/create-checkout-session
 * Creates a LemonSqueezy checkout URL for plan upgrades.
 */

const VARIANTS = {
  pro:      process.env.LEMONSQUEEZY_VARIANT_PRO,      // 1890909
  business: process.env.LEMONSQUEEZY_VARIANT_BUSINESS, // 1890911
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { plan, userId, email } = req.body

    const variantId = VARIANTS[plan]
    if (!variantId) return res.status(400).json({ error: 'Invalid plan' })

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email,
              custom: { user_id: userId },
            },
            product_options: {
              redirect_url: `${process.env.VITE_APP_URL}/app/billing?success=true`,
            },
          },
          relationships: {
            store: {
              data: { type: 'stores', id: String(process.env.LEMONSQUEEZY_STORE_ID) },
            },
            variant: {
              data: { type: 'variants', id: String(variantId) },
            },
          },
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[checkout] LemonSqueezy error:', data)
      return res.status(500).json({ error: data?.errors?.[0]?.detail || 'Checkout creation failed' })
    }

    const checkoutUrl = data?.data?.attributes?.url
    if (!checkoutUrl) return res.status(500).json({ error: 'No checkout URL returned' })

    return res.status(200).json({ url: checkoutUrl })
  } catch (err) {
    console.error('[checkout]', err)
    return res.status(500).json({ error: err.message })
  }
}
