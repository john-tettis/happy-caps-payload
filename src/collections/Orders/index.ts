import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Order Number',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Order Details',
          description: 'Products, discounts, etc',
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
              required: true,
            },
            {
              name: 'Total',
              type: 'number',
            },
            {
              name: 'Order Date',
              type: 'date',
            },
          ],
        },
        {
          label: 'Shipping Information',
          description: 'Address, status, etc',
          fields: [
            {
              name: 'Shipping Address',
              type: 'richText',
              required: true,
            },
            {
              name: 'Status',
              type: 'select',
              options: ['Pending', 'Shipped', 'Delivered'],
              required: true,
            },
            {
              name: 'Tracking Number',
              type: 'text',
            },
            {
              name: 'Shipping Cost',
              type: 'number',
            },
          ],
        },
        {
          label: 'Customer Information',
          description: 'Contact and Payment information',
          fields: [
            {
              name: 'Customer Name',
              type: 'text',
              required: true,
            },
            {
              name: 'Email',
              type: 'text',
              required: true,
            },
            {
              name: 'Phone Number',
              type: 'text',
              required: true,
            },
            {
              name: 'Payment Method',
              type: 'select',
              options: ['Credit Card', 'Debit Card', 'Paypal', 'Cash'],
              required: true,
            },
            {
              name: 'Payment Status',
              type: 'select',
              options: ['Paid', 'Pending', 'Failed'],
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
