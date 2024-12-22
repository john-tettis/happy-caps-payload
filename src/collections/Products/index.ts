import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    {
      name: 'Product Name',
      type: 'text',
    },
    {
      name: 'Product Type',
      type: 'radio',
      options: ['Bucket Hat', 'Beanie', 'Ski Mask', 'Other'],
    },
    {
      name: 'Price',
      type: 'number',
    },
    {
      name: 'Pictures',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'Description',
      type: 'richText',
    },
    {
      name: 'Quantity',
      type: 'richText',
    },
  ],
}
