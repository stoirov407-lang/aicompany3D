export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { plan } = req.body || {}
    const prices = {
      GO: process.env.STRIPE_PRICE_GO,
      PLUS: process.env.STRIPE_PRICE_PLUS,
      PRO: process.env.STRIPE_PRICE_PRO,
      LUXURY: process.env.STRIPE_PRICE_LUXURY,
    }
    const price = prices[plan]
    if (!price) return res.status(400).json({ error: `Stripe Price ID for ${plan} is not configured.` })
    const origin = req.headers.origin || `https://${req.headers.host}`
    const params = new URLSearchParams()
    params.set('mode', plan === 'LUXURY' ? 'payment' : 'subscription')
    params.set('line_items[0][price]', price)
    params.set('line_items[0][quantity]', '1')
    params.set('success_url', `${origin}/?checkout=success&plan=${plan}`)
    params.set('cancel_url', `${origin}/?checkout=cancelled`)
    params.set('allow_promotion_codes', 'true')
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    })
    const data = await stripeResponse.json()
    if (!stripeResponse.ok) return res.status(stripeResponse.status).json({ error: data.error?.message || 'Stripe error' })
    return res.status(200).json({ url: data.url })
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Checkout failed' })
  }
}
