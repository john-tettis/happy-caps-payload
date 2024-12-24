'use client'
import { cn } from '@/utilities/cn'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '../RichText'

export type ProductData = Pick<
  Product,
  'title' | 'price' | 'pictures' | 'quantity' | 'description' | 'description_html' | 'id'
>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: ProductData
  relationTo?: string
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, title: titleFromProps } = props
  console.log(doc)
  const { title, id, description, price, pictures, quantity } = doc || {}
  const image = pictures ? pictures[0] : null

  // console.log(description_html)
  // const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  // const sanitizedDescription = description.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/${relationTo}/${id}`

  return (
    <article
      className={cn(
        'border border-border rounded-lg overflow-hidden bg-card hover:cursor-pointer',
        className,
      )}
      ref={card.ref}
    >
      <div className="relative w-full ">
        {!image && <div className="">No image</div>}
        {image && typeof image !== 'string' && <Media resource={image} size="33vw" />}
      </div>
      <div className="p-2">
        {titleToUse && (
          <div className="prose">
            <h3>
              <Link className="not-prose hover:underline" href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
            <div>${price}</div>
          </div>
        )}
        {/* {description && (
          <div className="mt-2">
            <RichText data={description}></RichText>
          </div>
        )} */}
      </div>
    </article>
  )
}
