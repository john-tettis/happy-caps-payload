'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState } from 'react'

// Product type options from the collection schema
const PRODUCT_TYPES = ['Bucket Hat', 'Beanie', 'Ski Mask', 'Other']

interface FilterChangeProps {
  types: string[]
  priceRange: {
    min: number
    max: number
  }
}

interface PageClientProps {
  onFilterChange: (filters: FilterChangeProps | null) => void
}

const PageClient: React.FC<PageClientProps> = ({ onFilterChange }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type))
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
  }

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setPriceRange({ ...priceRange, min: value })
  }

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setPriceRange({ ...priceRange, max: value })
  }

  const applyFilters = () => {
    onFilterChange({
      types: selectedTypes,
      priceRange: priceRange,
    })
  }

  const resetFilters = () => {
    setSelectedTypes([])
    setPriceRange({ min: 0, max: 1000 })
    onFilterChange(null)
  }

  return (
    <div className="container mb-8">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Filters</h2>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Product Type</h3>
            <div className="space-y-2">
              {PRODUCT_TYPES.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    className="mr-2 h-4 w-4"
                  />
                  <label htmlFor={`type-${type}`}>{type}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="flex space-x-4">
              <div>
                <label htmlFor="min-price" className="block text-sm mb-1">
                  Min ($)
                </label>
                <input
                  type="number"
                  id="min-price"
                  value={priceRange.min}
                  onChange={handleMinPriceChange}
                  min="0"
                  className="w-24 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="max-price" className="block text-sm mb-1">
                  Max ($)
                </label>
                <input
                  type="number"
                  id="max-price"
                  value={priceRange.max}
                  onChange={handleMaxPriceChange}
                  min="0"
                  className="w-24 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PageClient
