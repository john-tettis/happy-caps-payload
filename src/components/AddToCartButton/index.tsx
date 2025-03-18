'use client'
import React, { useState } from 'react'

import { useCart } from '@/providers/Cart'
import { Product } from '@/payload-types'

interface propTypes {
  product: Product
}

const AddToCartButton: React.FC<propTypes> = (props) => {
  const { product } = props
  const { cart, addToCart, isInStock, canAddMoreToCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [error, setError] = useState('')

  const handleAddToCart = (product: Product) => {
    if (!isInStock(product)) {
      setError('Out of stock')
      setTimeout(() => setError(''), 2000)
      return
    }

    if (!canAddMoreToCart(product)) {
      setError('Maximum available quantity reached')
      setTimeout(() => setError(''), 2000)
      return
    }

    setIsAdded(true)
    addToCart(product)
    setTimeout(() => setIsAdded(false), 2000) // Reset after 2 seconds
  }

  if (!isInStock(product)) {
    return (
      <button
        disabled
        className="relative flex h-[50px] w-full items-center justify-center overflow-hidden bg-gray-400 text-white shadow-md"
        data-ignore-click
      >
        <span className="relative z-10">Out of Stock</span>
      </button>
    )
  }

  return (
    <button
      onClick={(e) => {
        handleAddToCart(product)
      }}
      className={`relative flex h-[50px] w-full items-center justify-center overflow-hidden ${
        canAddMoreToCart(product)
          ? 'bg-gray-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-orange-600 before:duration-500 before:ease-out hover:shadow-orange-600 hover:before:h-56 hover:before:w-96'
          : 'bg-gray-500 text-white shadow-md'
      }`}
      disabled={!canAddMoreToCart(product)}
      data-ignore-click
    >
      {error && <span className="relative z-10 text-red-200">{error}</span>}
      {!error && !isAdded && (
        <span className="relative z-10">
          {canAddMoreToCart(product)
            ? `Add to cart - $${product.price}`
            : 'Maximum quantity reached'}
        </span>
      )}
      {!error && isAdded && <span className="relative z-10">Added to Cart!</span>}
    </button>
  )
}
export default AddToCartButton
