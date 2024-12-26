import React, { useState, useEffect, useCallback } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ImageMedia } from '@/components/Media/ImageMedia'
import { Thumb } from './CarouselThumbButton'
import {Media} from '@/payload-types'

type PropType = {
  slides: (Media | string)[] // Array of images
  options?: EmblaOptionsType
}

const Carousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })
  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()

    emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <div className="embla w-full ">
      <div className="embla__viewport w-full" ref={emblaMainRef}>
        <div className="embla__container w-full">
          {slides.map((url, index) => (
            <div className="embla__slide w-full" key={index}>
              <ImageMedia resource={url} alt={`Slide ${index + 1}`} imgClassName="h-96 w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((url, index) => (
              <Thumb
                key={index}
                onClick={() => onThumbClick(index)}
                selected={index === selectedIndex}
                index={index}
                media={slides[index]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Carousel
