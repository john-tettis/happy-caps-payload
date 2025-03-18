import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { anyone } from '../../access/anyone'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  HTMLConverterFeature,
  InlineToolbarFeature,
  lexicalEditor,
  lexicalHTML,
} from '@payloadcms/richtext-lexical'
import { slugField } from '@/fields/slug'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

export const BaseHats: CollectionConfig = {
  slug: 'base-hats',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Custom Products',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'hat_type',
      type: 'select',
      options: [
        { label: 'Bucket Hat', value: 'bucket-hat' },
        { label: 'Beanie', value: 'beanie' },
        { label: 'Ski Mask', value: 'ski-mask' },
        { label: 'Baseball Cap', value: 'baseball-cap' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'base_price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'images',
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
      name: 'available_colors',
      type: 'array',
      fields: [
        {
          name: 'color_name',
          type: 'text',
          required: true,
        },
        {
          name: 'color_value',
          type: 'text',
          required: true,
          admin: {
            description: 'Hex code or color name (e.g., #FF0000 or red)',
          },
        },
        {
          name: 'color_image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'color_in_stock',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // {
    //   name: 'size_options',
    //   type: 'array',
    //   fields: [
    //     {
    //       name: 'size',
    //       type: 'text',
    //       required: true,
    //     },
    //     {
    //       name: 'additional_cost',
    //       type: 'number',
    //       defaultValue: 0,
    //     },
    //   ],
    // },
    {
      name: 'in_stock',
      type: 'checkbox',
      defaultValue: true,
    },

    ...slugField(),
  ],
}
