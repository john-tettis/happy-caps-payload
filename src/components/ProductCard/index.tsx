'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'
import AddToCartButton from '../AddToCartButton'
import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '../RichText'

// export type ProductData = Pick<
//   Product,
//   'title' | 'price' | 'pictures' | 'quantity' | 'description' | 'description_html' | 'slug'
// >

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc: Product
  relationTo?: string
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, title: titleFromProps } = props
  const { title, slug, description, price, pictures, quantity } = doc || {}
  const image = pictures ? pictures[0] : null

  // console.log(description_html)
  // const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  // const sanitizedDescription = description.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${slug}`

  return (
    <article
      className={cn(
        ' group p-2 border-2 border-transparent box-border' +
          ' overflow-hidden hover:border-gray-600 hover:cursor-pointer' +
          'transition-all duration-300 ease-in-out',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!image && <div className=" ">No image</div>}
        {image && typeof image !== 'string' && (
          <div className="relative w-full ">
            {!image && <div className=" ">No image</div>}
            {image && typeof image !== 'string' && (
              <Media
                imgClassName={cn(
                  'object-cover h-96 w-full ' + // Changed from h-96 to h-64 w-64 for square dimensions
                    'group-hover:scale-95 group-hover:rounded-lg group-hover:drop-shadow-xl' +
                    ' transition-all duration-200 ease-in-out ',
                )}
                resource={image}
                size="square"
              />
            )}
          </div>
        )}
      </div>
      <div className="pt-2 pb-2  bg-white">
        {titleToUse && (
          <div className="">
            <Link
              className=" flex flex-row justify-between mr-2 text-base hover:cursor-pointer "
              href={href}
              ref={link.ref}
            >
              <h3 className="group-hover:underline">{titleToUse}</h3>
              <div>${price}</div>
            </Link>
          </div>
        )}

        {/* {description && (
          <div className="mt-2">
            <RichText data={description}></RichText>
          </div>
        )} */}
      </div>
      <AddToCartButton product={doc}></AddToCartButton>
    </article>
  )
}
