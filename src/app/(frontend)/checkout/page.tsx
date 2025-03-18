'use client'
import React, { useState } from 'react'
import { useCart } from '@/providers/Cart'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { CheckCircle, CreditCard, ShoppingBag, Truck } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)

export default function Checkout() {
  const { cart, total, promoCode, discount, subtotal } = useCart()
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
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
          customerDetails,
          total: total.toFixed(2),
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
        }),
      })
      const data = await response.json()

      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId: data.id })

      if (error) {
        alert('Error redirecting to Stripe Checkout: ' + error.message)
      }
    } catch (err) {
      alert('Failed to initiate checkout: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Checkout Steps */}
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-2">
                <ShoppingBag size={20} />
              </div>
              <span className="text-sm font-medium">Cart</span>
            </div>
            <div className="flex-1 h-1 bg-indigo-600 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-2">
                <Truck size={20} />
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className="flex-1 h-1 bg-indigo-600 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white mb-2">
                <CreditCard size={20} />
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 sm:text-4xl">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Customer Details Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Truck size={20} className="mr-2 text-indigo-600" />
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={customerDetails.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={customerDetails.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                    value={customerDetails.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="San Francisco"
                    value={customerDetails.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State / Province
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="California"
                    value={customerDetails.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    placeholder="94103"
                    value={customerDetails.zip}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="United States"
                    value={customerDetails.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <ShoppingBag size={20} className="mr-2 text-indigo-600" />
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></div>
                      <span className="text-sm font-medium">
                        {item.title} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-t border-b border-gray-200">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium">${subtotal.toFixed(2)}</p>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p className="text-sm">Discount</p>
                    <p className="text-sm font-medium">- ${discount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium">Free</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 mb-6">
                <p className="text-base font-bold">Total</p>
                <p className="text-xl font-bold text-indigo-700">${total.toFixed(2)}</p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    Pay with Stripe
                  </span>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure payment processing
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
