'use client'
import React, { useState } from 'react'
import { useCart } from '@/providers/Cart'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function Checkout() {
  const { cart, total, promoCode, discount } = useCart()
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart,
          total: total.toFixed(2),
        }),
      })
      const data = await response.json()

      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId: data.id })

      if (error) {
        alert('Error redirecting to Stripe Checkout: ' + error.message)
      }
    } catch (err) {
      alert('Failed to initiate checkout')
    }
    setLoading(false)
  }

  return (
    <main className="container max-w-lg mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6">Checkout</h1>
      <div className="flex flex-col gap-8">
        {/* Customer Details Form */}
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={customerDetails.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={customerDetails.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Shipping Address"
            value={customerDetails.address}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
        </div>

        {/* Order Summary */}
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-4">
            <p className="text-lg">Subtotal:</p>
            <p className="text-lg font-semibold">${total.toFixed(2)}</p>
          </div>
          {discount > 0 && (
            <div className="flex justify-between mb-4 text-green-600">
              <p className="text-lg">Discount:</p>
              <p className="text-lg font-semibold">- ${discount.toFixed(2)}</p>
            </div>
          )}
          <div className="flex justify-between mb-6">
            <p className="text-lg font-bold">Total:</p>
            <p className="text-lg font-bold">${total.toFixed(2)}</p>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="bg-indigo-700 text-white py-3 rounded-lg w-full hover:bg-indigo-800 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </div>
    </main>
  )
}
