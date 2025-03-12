import React from 'react'
import Link from 'next/link'
import { Media } from './Media'

export const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="container">
        <div className="bg-gray-100 dark:bg-gray-800 p-8 text-center rounded-lg">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or browse our full collection.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden transition-all duration-200 group-hover:shadow-lg">
              {product.pictures && product.pictures[0] && (
                <div className="aspect-square overflow-hidden">
                  <Media
                    resource={product.pictures[0]}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-medium">{product.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600 dark:text-gray-400">{product.product_type}</span>
                  <span className="font-medium">${product.price}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
