import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia', // Updated to a compatible API version
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { cart, customerDetails, total, subtotal, discount } = body

    // Validate the request
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: Cart is empty or invalid' },
        { status: 400 },
      )
    }
    console.log(
      'ITEM DESCRIPTION ****************************: ' + JSON.stringify(cart[0].description),
    )
    // Create line items for Stripe
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description:
            typeof item.description === 'string'
              ? item.description
              : item.description_html
                ? item.description_html.replace(/<[^>]*>/g, '') // Strip HTML tags if description_html exists
                : typeof item.description === 'object'
                  ? JSON.stringify(item.description).substring(0, 500) // Fallback with length limit
                  : 'Product description',
          images: item.images ? [item.images[0]?.url].filter(Boolean) : [],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe requires amounts in cents
      },
      quantity: item.quantity,
    }))

    // Add metadata for the order
    const metadata = {
      customerId: customerDetails?.email || 'guest',
      subtotal: subtotal || total,
      discount: discount || '0.00',
    }

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
      metadata,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'], // Add countries you want to support
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0, // Free shipping (in cents)
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
      customer_email: customerDetails?.email,
    })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the checkout session' },
      { status: 500 },
    )
  }
}
