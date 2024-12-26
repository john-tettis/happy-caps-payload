import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import RichText from '@/components/RichText'
import React, { cache } from 'react'
import PageClient from './page.client'
import PageBack from '@/components/PageBack'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    }
  })

  return products.docs.map(({ slug}) => {
    return { slug}
  })



}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function ProductPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise

  const url = '/shop/' + slug
  const product = await queryProductsBySlug({ slug })
  if (!product) return <PayloadRedirects url={url} />
  console.log(product.pictures)
  return (
    <div className="px-4 flex items-start justify-center pb-16">
      <PageBack></PageBack>
      <div className="flex sm:flex-row sm:w-min w-full flex-col gap-6  items-center sm:items-start justify-items-center pt-8">
        <div className=" w-full sm:w-64 md:w-96 ">
          <PageClient images={product.pictures} />
        </div>

        <div className={' mb-6 h-96 w-full sm:w-64 md:w-96 flex flex-col  items-start justify-between'}>
          <h1 className="text-3xl"> {product.title}</h1>
          <span>{product.product_type}</span>
          <RichText className="text-left p-0 m-0" data={product.description}></RichText>
          <div className={'w-full'}>
            <p
              className={'my-1 text-sm '.concat(
                product.quantity > 0 ? ' text-green-600' : ' text-red-600',
              )}
            >
              {product.quantity > 0 ? 'In Stock!' : 'Sold out :('}

            </p>
            <button className="relative flex h-[50px] w-full items-center justify-center overflow-hidden bg-gray-800 text-white shadow-2xl transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-orange-600 before:duration-500 before:ease-out hover:shadow-orange-600 hover:before:h-56 hover:before:w-96">
              <span className="relative z-10">{`Add to cart - $${product.price}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
const queryProductsBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    overrideAccess: draft,
  })
  return result.docs[0]
})
