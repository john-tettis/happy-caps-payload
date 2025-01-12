'use client'
import React from 'react'
import Link from 'next/link'
import { useCart } from '@/providers/Cart'
import CartItem from '@/components/CartItem'

export default function Cart() {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart()
  if (cart.length === 0) {
    return (
      <main className="">
        <div className=" flex flex-row gap-4 container m-4 m-auto text-center text-2xl">
          <p>No items in cart! </p>
          <Link className="underline  text-indigo-700" href="/shop">
            Shop Hats
          </Link>
        </div>
      </main>
    )
  }
  return (
    <main className="container flex flex-col">
      <div className="container flex flex-row">
        <div className="flex flex column">
          {cart.map((product, index) => (
            <CartItem key={index} product={product} />
          ))}
        </div>
      </div>
    </main>
  )
}
