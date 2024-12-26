'use client'

import React from 'react'
import Carousel from '@/components/Carousel' // Adjust the path as needed
import {Media} from '@/payload-types'

const options = { loop: true } // Example options for EmblaCarousel

type PageClientProps =  {
  images: (Media | string)[]
}

const PageClient: React.FC<PageClientProps> = ({ images}) => {
  return (
      <Carousel slides={images} options={options} />
  )
}

export default PageClient
