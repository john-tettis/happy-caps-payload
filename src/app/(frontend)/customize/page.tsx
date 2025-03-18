import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
// @ts-ignore
import CustomizeClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function CustomizePage() {
  const payload = await getPayload({ config: configPromise })

  // Fetch base hats with all needed data
  const baseHats = await payload.find({
    collection: 'base-hats',
    depth: 2, // Ensure nested objects are loaded
    where: {
      in_stock: {
        equals: true,
      },
    },
    limit: 100,
    sort: '-createdAt',
  })

  // Fetch customization options
  const customizationOptions = await payload.find({
    collection: 'customization-options',
    depth: 2, // Ensure nested options, colors, etc. are loaded
    where: {
      is_active: {
        equals: true,
      },
    },
    limit: 100,
    sort: 'title',
  })

  return (
    <div className="pt-24 pb-24 overflow-x-hidden">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Customize Your Cap</h1>
          <p>Design your perfect cap from scratch. Select a starting point and make it your own!</p>
        </div>
      </div>

      <CustomizeClient baseHats={baseHats.docs} customizationOptions={customizationOptions.docs} />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Customize Your Cap - Happy Caps`,
  }
}
