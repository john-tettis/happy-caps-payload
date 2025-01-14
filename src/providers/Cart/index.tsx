'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '@/payload-types'

interface CartContextType {
  cart: Product[]
  addToCart: (item: Omit<Product, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  promoCode: string
  setPromoCode: (code: string) => void
  discount: number
  promoError: string
  setPromoError: (message: string) => void
  setDiscount: (amount: number) => void
  validatePromoCode: () => Promise<void>
  subtotal: number
  total: number
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

  const addToCart = (item: Omit<Product, 'quantity'>) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id)
      if (existingItem) {
        return prevCart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
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
        promoCode,
        setPromoCode,
        discount,
        setDiscount,
        promoError,
        setPromoError,
        validatePromoCode,
        subtotal,
        total,
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
