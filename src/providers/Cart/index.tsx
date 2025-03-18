'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/payload-types'

interface CartContextType {
  cart: Product[]
  addToCart: (item: Product) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  promoCode: string
  setPromoCode: (code: string) => void
  discount: number
  promoError: string
  setPromoError: (message: string) => void
  setDiscount: (amount: number) => void
  validatePromoCode: () => Promise<void>
  subtotal: number
  total: number
  isInStock: (product: Product) => boolean
  canAddMoreToCart: (product: Product) => boolean
  getAvailableQuantity: (product: Product) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([])
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState(' ')

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const total = subtotal - discount

  // Check if a product is in stock
  const isInStock = (product: Product): boolean => {
    return product.quantity > 0
  }

  // Get the quantity of a product currently in the cart
  const getCartQuantity = (productId: string): number => {
    const cartItem = cart.find((item) => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  // Check if more of a product can be added to the cart
  const canAddMoreToCart = (product: Product): boolean => {
    const currentQuantityInCart = getCartQuantity(product.id)
    return currentQuantityInCart < product.quantity
  }

  // Get the available quantity that can still be added to cart
  const getAvailableQuantity = (product: Product): number => {
    const currentQuantityInCart = getCartQuantity(product.id)
    return Math.max(0, product.quantity - currentQuantityInCart)
  }

  const addToCart = (item: Product) => {
    if (!isInStock(item)) return

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id)

      if (existingItem) {
        // Check if adding one more would exceed available stock
        if (existingItem.quantity >= item.quantity) {
          return prevCart // Cannot add more than available stock
        }

        return prevCart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }

      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          // Ensure the new quantity doesn't exceed available stock
          const maxAllowed = item.quantity
          const newQuantity = Math.min(quantity, maxAllowed)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    })
  }

  const clearCart = () => {
    setCart([])
    setPromoCode('')
    setDiscount(0)
    setPromoError(' ')
  }

  const validatePromoCode = async () => {
    try {
      const response = await fetch(
        `/api/discounts/validate?code=${promoCode}&purchaseAmount=${subtotal}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = await response.json()
      if (response.ok && data.valid) {
        setDiscount(data.discountAmount)
        setPromoError(' ')
      } else {
        setDiscount(0)
        setPromoError(data.message)
      }
    } catch (err) {
      alert('Failed to validate promo code. Please try again.')
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        setPromoCode,
        discount,
        setDiscount,
        promoError,
        setPromoError,
        validatePromoCode,
        subtotal,
        total,
        isInStock,
        canAddMoreToCart,
        getAvailableQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = (): CartContextType => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
