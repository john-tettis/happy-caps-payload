'use client'
import React, { useState } from 'react'

import { useCart } from '@/providers/Cart'
import { Product } from '@/payload-types'

interface propTypes {
  product: Product
}

const AddToCartButton: React.FC<propTypes> = (props) => {
  const { product } = props
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (product: Product) => {
    setIsAdded(true)
    addToCart(product)

    setTimeout(() => setIsAdded(false), 2000) // Reset after 2 seconds
  }

  return (
    <button
      onClick={(e) => {
        handleAddToCart(product)
      }}
      className="relative flex h-[50px] w-full items-center justify-center overflow-hidden bg-gray-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-orange-600 before:duration-500 before:ease-out hover:shadow-orange-600 hover:before:h-56 hover:before:w-96"
      data-ignore-click
    >
      {!isAdded && <span className="relative z-10">{`Add to cart - $${product.price}`}</span>}
      {isAdded && <span className="relative z-10">Added to Cart!</span>}
    </button>
  )
}
export default AddToCartButton
