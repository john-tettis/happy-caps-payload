import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Order Number',
  },
  fields: [
    {
      name: 'Order Number',
      type: 'text',
      required: true,
    },
    {
      name: 'DiscountCode',
      type: 'relationship',
      relationTo: 'discounts',
    },
    {
      name: 'Products',
      type: 'array',
      fields: [
        {
          name: 'Product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'Quantity',
          type: 'number',
          required: true,
        },
      ],
      //   required: true,
    },
  ],
}
