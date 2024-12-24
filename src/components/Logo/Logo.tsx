'use client'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { loading: loadingFromProps, priority: priorityFromProps, className } = props

  const loading = loadingFromProps || 'lazy'
  const priority = priorityFromProps || 'low'
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/media/6769d77bf5e991d5a7678a22')
        const data = await res.json()
        const imageUrl = data.url // Assuming the image field is named `image`
        setImageUrl(imageUrl)
      } catch (error) {
        console.error('Error fetching media:', error)
      }
    }

    fetchImage()
  })
  return (
    /* eslint-disable @next/next/no-img-element */
    <img
      alt="Payload Logo"
      width={193}
      height={34}
      loading={loading}
      fetchPriority={priority}
      decoding="async"
      className={clsx('max-w-[9.375rem] w-full h-[40px]', className)}
      src={imageUrl || undefined}
    />
  )
}
