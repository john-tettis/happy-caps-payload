import type { CollectionConfig, PayloadRequest } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
export const DiscountCodes: CollectionConfig = {
  slug: 'discounts',
  admin: {
    useAsTitle: 'Discount Code',
  },
  access: {
    read: authenticated,
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
  endpoints: [
    {
      path: '/validate',
      method: 'get',
      handler: async (req: PayloadRequest) => {
        try {
          const code: string = req.query.code as string
          const purchaseAmount: number = req.query.purchaseAmount as number
          const discount = await req.payload.find({
            collection: 'discounts',
            where: {
              'Discount Code': {
                equals: code.toUpperCase(),
              },
              'Valid From': {
                less_than: new Date().toISOString(),
              },
              'Valid To': {
                greater_than: new Date().toISOString(),
              },
            },
          })

          if (!discount.docs.length) {
            return Response.json({ valid: false }, { status: 400 })
          }

          const discountData = discount.docs[0]
          if (
            discountData['Minimum Purchase Amount'] &&
            Number(purchaseAmount) < discountData['Minimum Purchase Amount']
          ) {
            return Response.json({ valid: true, minimum: false }, { status: 400 })
          }
          return Response.json(
            {
              valid: true,
              minimum: true,
              discountType: discountData['Discount Type'],
              discountAmount: discountData['Discount Amount'],
            },
            { status: 200 },
          )
        } catch (err) {
          console.error(err)
          return Response.json({ message: 'Internal server error' }, { status: 500 })
        }
      },
    },
  ],
}
