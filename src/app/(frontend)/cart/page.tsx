'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/providers/Cart'
import CartItem from '@/components/CartItem'

export default function Cart() {
  const {
    cart,
    subtotal,
    total,
    promoCode,
    setPromoCode,
    promoError,
    setPromoError,
    discount,
    validatePromoCode,
  } = useCart()
  // const [error, setError] = useState('')

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPromoCode(e.target.value)
    setPromoError(' ')
  }

  if (cart.length === 0) {
    return (
      <main className="container mx-auto p-8 text-center">
        <p className="text-2xl mb-4">No items in cart!</p>
        <Link className="text-indigo-700 underline" href="/shop">
          Shop Hats
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 border-b-2 border-gray-400 pb-2">Cart</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full md:w-2/3 space-y-4">
          {cart.map((product, index) => (
            <CartItem key={index} product={product} />
          ))}
        </div>
        {/* Summary */}
        <div className="w-full md:w-1/3 bg-gray-100 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-4">
            <p className="text-lg">Subtotal:</p>
            <p className="text-lg font-semibold">${subtotal.toFixed(2)}</p>
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
          {/* Promo Code Section */}
          <div className="mb-6">
            <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700">
              Promo Code
            </label>
            <div className="flex mt-2">
              <input
                id="promo-code"
                type="text"
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Enter code"
                value={promoCode}
                onChange={handlePromoCodeChange}
              />
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-800 transition"
                onClick={validatePromoCode}
              >
                Apply
              </button>
            </div>
            <p className="text-red-600 text-sm mt-2"> {promoError && promoError}</p>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-indigo-700 text-white text-center py-3 rounded-lg hover:bg-indigo-800 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  )
}
