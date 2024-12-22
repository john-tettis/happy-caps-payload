import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'Product Name',
  },
  fields: [
    {
      name: 'Product Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'Product Type',
      type: 'radio',
      options: ['Bucket Hat', 'Beanie', 'Ski Mask', 'Other'],
      required: true,
    },
    {
      name: 'Price',
      type: 'number',
      required: true,
    },
    {
      name: 'Pictures',
      type: 'upload',
      hasMany: true,
      relationTo: 'media',
      required: true,
    },
    {
      name: 'Description',
      type: 'richText',
      required: true,
    },

    {
      name: 'Quantity',
      type: 'number',
      defaultValue: 1,
      required: true,
    },
  ],
}
