'use client'

import React, { useState, useEffect } from 'react'
import { ImageMedia } from '../Media/ImageMedia'
import { useCart } from '@/providers/Cart'
import type { Product } from '@/payload-types'

interface CartItemProps {
  product: Product
}

const CartItem: React.FC<CartItemProps> = ({ product }) => {
  const { cart, updateQuantity, removeFromCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [maxQuantity, setMaxQuantity] = useState(product.quantity || 0)
  const [error, setError] = useState('')

  // Initialize quantity from cart
  useEffect(() => {
    const cartItem = cart.find((item) => item.id === product.id)
    if (cartItem) {
      setQuantity(cartItem.quantity)
    }
  }, [cart, product.id])

  const handleIncrement = () => {
    if (quantity >= maxQuantity) {
      setError('Maximum available quantity reached')
      setTimeout(() => setError(''), 2000)
      return
    }

    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    updateQuantity(product.id, newQuantity)
  }

  const handleDecrement = () => {
    const newQuantity = quantity - 1
    if (newQuantity > 0) {
      setQuantity(newQuantity)
      updateQuantity(product.id, newQuantity)
      setError('')
    } else {
      removeFromCart(product.id)
    }
  }

  const totalPrice = (product.price * quantity).toFixed(2)

  return (
    <div className="flex flex-col border-b pb-4 mb-4">
      <div className="flex items-center justify-between">
        {/* Thumbnail */}
        <div className="flex items-center gap-4">
          {product.pictures?.[0] ? (
            <ImageMedia
              resource={product.pictures[0]}
              alt={product.title}
              imgClassName=" object-cover rounded-md w-10 h-10"
              size="thumbnail"
            />
          ) : (
            <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-md">
              No Image
            </div>
          )}
          <div>
            <h4 className="font-semibold">{product.title}</h4>
            <p className="text-sm text-gray-500">${product.price.toFixed(2)} each</p>
            {maxQuantity > 0 && (
              <p className="text-xs text-gray-500">{maxQuantity} available in stock</p>
            )}
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
            className={`px-3 py-1 rounded-md ${
              quantity >= maxQuantity
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={quantity >= maxQuantity}
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <div className="text-lg font-semibold">${totalPrice}</div>
      </div>

      {error && <div className="mt-2 text-sm text-red-500 text-right">{error}</div>}
    </div>
  )
}

export default CartItem
