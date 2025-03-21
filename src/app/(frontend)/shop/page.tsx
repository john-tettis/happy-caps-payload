import type { Metadata } from 'next/types'

import { ProductList } from '@/components/ProductList'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import ClientFilterableProductList from './product-filter.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      product_type: true,
      price: true,
      pictures: true,
      description: true,
      quantity: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Happy Little Storefront</h1>
        </div>
      </div>

      <ClientFilterableProductList initialProducts={products.docs} />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Happy Little Storefront`,
  }
}
