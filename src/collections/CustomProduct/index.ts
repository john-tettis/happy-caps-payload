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

// Declare the collection slugs explicitly
const BASE_HATS_SLUG = 'base-hats' as const
const CUSTOMIZATION_OPTIONS_SLUG = 'customization-options' as const
const USERS_SLUG = 'users' as const
const MEDIA_SLUG = 'media' as const

export const CustomProduct: CollectionConfig = {
  slug: 'custom-products',
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
    },
    {
      name: 'base_hat',
      type: 'relationship',
      relationTo: BASE_HATS_SLUG,
      required: true,
    },
    {
      name: 'selected_color',
      type: 'text',
      required: true,
      admin: {
        description: 'The color selected from the base hat color options',
      },
    },
    {
      name: 'selected_size',
      type: 'text',
      required: false,
      admin: {
        description: 'The size selected from the base hat size options (if applicable)',
      },
    },
    {
      name: 'customizations',
      type: 'array',
      fields: [
        {
          name: 'customization_category',
          type: 'relationship',
          relationTo: CUSTOMIZATION_OPTIONS_SLUG,
          required: true,
        },
        {
          name: 'customization_type',
          type: 'select',
          options: [
            { label: 'Predefined Option', value: 'predefined' },
            { label: 'Custom/Freeform', value: 'freeform' },
          ],
          required: true,
        },
        {
          name: 'predefined_option',
          type: 'text',
          required: false,
          admin: {
            description: 'ID or name of the selected predefined option',
            condition: (data, siblingData) => siblingData.customization_type === 'predefined',
          },
        },
        {
          name: 'placement',
          type: 'select',
          options: [
            { label: 'Front', value: 'front' },
            { label: 'Back', value: 'back' },
            { label: 'Left Side', value: 'left-side' },
            { label: 'Right Side', value: 'right-side' },
            { label: 'Top', value: 'top' },
            { label: 'Brim', value: 'brim' },
          ],
          required: true,
        },
        {
          name: 'selected_color',
          type: 'text',
          required: false,
          admin: {
            description: 'Color of the customization (if applicable)',
          },
        },
        {
          name: 'selected_size',
          type: 'text',
          required: false,
          admin: {
            description: 'Size of the customization (if applicable)',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          defaultValue: 1,
          required: true,
        },
        {
          name: 'custom_text',
          type: 'richText',
          required: false,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                HorizontalRuleFeature(),
              ]
            },
          }),
          admin: {
            description: 'Custom text to be added (if applicable)',
          },
        },
        {
          name: 'custom_image',
          type: 'upload',
          relationTo: MEDIA_SLUG,
          required: false,
          admin: {
            description: 'Custom image to be added (if applicable)',
          },
        },
        {
          name: 'custom_notes',
          type: 'textarea',
          required: false,
          admin: {
            description: 'Additional instructions or notes for this customization',
          },
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Total price for this specific customization',
          },
        },
      ],
    },
    {
      name: 'total_price',
      type: 'number',
      required: true,
      admin: {
        description: 'Total price of the custom product including base hat and all customizations',
      },
    },
    {
      name: 'order_notes',
      type: 'richText',
      required: false,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      admin: {
        description: 'Overall notes for the custom order',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Ready for Review', value: 'review' },
        { label: 'Approved', value: 'approved' },
        { label: 'In Production', value: 'production' },
        { label: 'Completed', value: 'completed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'admin_notes',
      type: 'richText',
      required: false,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
          ]
        },
      }),
      admin: {
        description: 'Private notes for administrators (not visible to customers)',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: USERS_SLUG,
      required: false,
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // You can implement price calculation logic here
        // For now, we're just passing through the data
        return data
      },
    ],
  },
}
