'use client'

import React, { useState } from 'react'
import { ImageMedia } from '../Media/ImageMedia'
import { useCart } from '@/providers/Cart'
import type { Product } from '@/payload-types'

interface CartItemProps {
  product: Product
}

const CartItem: React.FC<CartItemProps> = ({ product }) => {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const [quantity, setQuantity] = useState(product.quantity || 1)

  const handleIncrement = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    updateQuantity(product.id, newQuantity)
  }

  const handleDecrement = () => {
    const newQuantity = quantity - 1
    if (newQuantity > 0) {
      setQuantity(newQuantity)
      updateQuantity(product.id, newQuantity)
    } else {
      removeFromCart(product.id)
    }
  }

  const totalPrice = (product.price * quantity).toFixed(2)

  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      {/* Thumbnail */}
      <div className="flex items-center gap-4">
        {product.pictures?.[0] ? (
          <ImageMedia
            resource={product.pictures[0]}
            alt={product.title}
            className="rounded-md w-16 h-16"
          />
        ) : (
          <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-md">
            No Image
          </div>
        )}
        <div>
          <h4 className="font-semibold">{product.title}</h4>
          <p className="text-sm text-gray-500">${product.price.toFixed(2)} each</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleDecrement}
          className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="px-3 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Total Price */}
      <div className="text-lg font-semibold">${totalPrice}</div>
    </div>
  )
}

export default CartItem
