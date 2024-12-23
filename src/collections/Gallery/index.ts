import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'Title',
  },
  access: {
    read: anyone,
    create: anyone,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'Title',
      type: 'text',
    },
    {
      name: 'Image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'Quote',
      type: 'text',
    },
    {
      name: 'Order',
      type: 'relationship',
      relationTo: 'orders',
    },
    {
      name: 'status',
      type: 'select',
      options: ['Pending', 'approved', 'Rejected', 'Archived'],
      defaultValue: 'Pending',
      access: {
        create: authenticated,
        read: authenticated,
        update: authenticated,
      },
    },
  ],
}
