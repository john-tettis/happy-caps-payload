'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, ArrowLeft, Package, Truck } from 'lucide-react'
import { useCart } from '@/providers/Cart'

interface OrderDetails {
  id: string
  status: string
  amount_total: number
  customer_details?: {
    email: string
    name: string
  }
  shipping_details?: {
    address: {
      city: string
      country: string
      line1: string
      line2: string
      postal_code: string
      state: string
    }
    name: string
  }
}

export default function OrderConfirmation() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { clearCart } = useCart()

  // Store clearCart in a ref to avoid dependency issues
  const clearCartRef = React.useRef(clearCart)

  // Update ref when clearCart changes
  useEffect(() => {
    clearCartRef.current = clearCart
  }, [clearCart])

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!sessionId) {
        setError('No session ID provided')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/checkout/session?session_id=${sessionId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }

        const data = await response.json()
        setOrderDetails(data)
        // Use the ref instead of the direct function
        clearCartRef.current() // Clear the cart after successful order
      } catch (err) {
        setError('Failed to load order details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [sessionId]) // Only depend on sessionId

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-8">{error || 'Could not retrieve order details'}</p>
          <Link
            href="/shop"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={16} className="mr-2" />
            Return to shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-2">
              <CheckCircle size={40} className="text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 opacity-90">Thank you for your purchase</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-medium">{orderDetails.id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="font-medium">${(orderDetails.amount_total / 100).toFixed(2)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {orderDetails.status === 'complete' ? 'Paid' : 'Processing'}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                {orderDetails.customer_details && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer</p>
                    <p className="font-medium">{orderDetails.customer_details.name}</p>
                    <p className="text-sm text-gray-600">{orderDetails.customer_details.email}</p>
                  </div>
                )}

                {orderDetails.shipping_details && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                    <p className="font-medium">{orderDetails.shipping_details.name}</p>
                    <p className="text-sm text-gray-600">
                      {orderDetails.shipping_details.address.line1}
                    </p>
                    {orderDetails.shipping_details.address.line2 && (
                      <p className="text-sm text-gray-600">
                        {orderDetails.shipping_details.address.line2}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {orderDetails.shipping_details.address.city},{' '}
                      {orderDetails.shipping_details.address.state}{' '}
                      {orderDetails.shipping_details.address.postal_code}
                    </p>
                    <p className="text-sm text-gray-600">
                      {orderDetails.shipping_details.address.country}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">What's Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Order Processing</h3>
                  <p className="text-sm text-gray-600">
                    We're preparing your order for shipment. You'll receive an email when it's on
                    the way.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Truck size={20} className="text-indigo-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Shipping</h3>
                  <p className="text-sm text-gray-600">
                    Your order should arrive within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
