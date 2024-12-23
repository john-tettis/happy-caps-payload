import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
export const DiscountCodes: CollectionConfig = {
  slug: 'discounts',
  admin: {
    useAsTitle: 'Discount Code',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'Discount Code',
      type: 'text',
      required: true,
    },
    {
      name: 'Discount Type',
      type: 'radio',
      options: ['Percentage', 'Dollar Amount'],
      required: true,
    },
    {
      name: 'Discount Amount',
      type: 'number',
      required: true,
    },
    {
      name: 'Valid From',
      type: 'date',
      required: true,
      defaultValue: new Date(),
    },
    {
      name: 'Valid To',
      type: 'date',
      required: true,
      defaultValue: new Date(),
    },
    {
      name: 'Minimum Purchase Amount',
      type: 'number',
    },
  ],
}
