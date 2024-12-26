import React from 'react'
import './index.css'
import { ImageMedia } from '@/components/Media/ImageMedia'
import {Media} from '@/payload-types'
type PropType = {
  selected: boolean
  index: number
  onClick: () => void
  media: Media| string
}

export const Thumb: React.FC<PropType> = (props) => {
  const { selected, onClick, media } = props

  return (
    <div
      className={'embla-thumbs__slide transition-transform'.concat(
        selected ? ' -translate-y-1' : ''
      )}
    >
      <button
        onClick={onClick}
        type="button"
        className="embla-thumbs__slide__number rounded-md"
      >
        <ImageMedia resource={media?.sizes?.square} imgClassName={'w-20 object-scale-down'}></ImageMedia>
      </button>
    </div>
  )
}
