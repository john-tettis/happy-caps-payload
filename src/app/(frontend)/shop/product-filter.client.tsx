'use client'

import React, { useState } from 'react'
import { ProductList } from '@/components/ProductList'
import PageClient from './page.client'

const ClientFilterableProductList = ({ initialProducts }) => {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [activeFilters, setActiveFilters] = useState(null)

  const handleFilterChange = (filters) => {
    if (!filters) {
      setFilteredProducts(initialProducts)
      setActiveFilters(null)
      return
    }

    const { types, priceRange } = filters

    const filtered = initialProducts.filter((product) => {
      // Filter by product type if any types are selected
      const typeMatch = types.length === 0 || types.includes(product.product_type)

      // Filter by price range
      const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max

      return typeMatch && priceMatch
    })

    setFilteredProducts(filtered)
    setActiveFilters(filters)
  }

  return (
    <>
      <PageClient onFilterChange={handleFilterChange} />

      {activeFilters && (
        <div className="container mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
            <h3 className="font-medium">Active Filters:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.types.length > 0 && (
                <div className="text-sm bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">
                  Types: {activeFilters.types.join(', ')}
                </div>
              )}
              <div className="text-sm bg-blue-100 dark:bg-blue-800/30 px-2 py-1 rounded">
                Price: ${activeFilters.priceRange.min} - ${activeFilters.priceRange.max}
              </div>
            </div>
          </div>
        </div>
      )}

      <ProductList products={filteredProducts} />
    </>
  )
}

export default ClientFilterableProductList
