'use client'
import React from 'react'
import Link from 'next/link'
import {useCart} from '@/providers/Cart'
import {Card} from '@/components/ProductCard'


export default function Cart(){
  const {cart, addToCart, removeFromCart, updateQuantity} = useCart()
  if(cart.length === 0){
    return (
      <main>
        <div>
          No items in cart! <Link href="/shop">Shop Hats</Link>
        </div>
      </main>
    )
  }
  return(
    <main className="flex flex-col">
      {cart.map((product, index) => (
        <Card
          key={index}
          doc={product}/>
      ))}

    </main>
  )
}
