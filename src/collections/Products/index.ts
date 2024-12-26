import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import {
  BlocksFeature, FixedToolbarFeature,
  HeadingFeature, HorizontalRuleFeature,
  HTMLConverterFeature, InlineToolbarFeature,
  lexicalEditor,
  lexicalHTML,
} from '@payloadcms/richtext-lexical'
import { slugField } from '@/fields/slug'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'product_type',
      type: 'radio',
      options: ['Bucket Hat', 'Beanie', 'Ski Mask', 'Other'],
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'pictures',
      type: 'upload',
      hasMany: true,
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            HTMLConverterFeature({}),
          ]
        },
      }),
    },
    lexicalHTML('description', { name: 'description_html' }),

    {
      name: 'quantity',
      type: 'number',
      defaultValue: 1,
      required: true,
    },
    ...slugField(),

  ],
}
