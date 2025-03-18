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

export const CustomizationOptions: CollectionConfig = {
  slug: 'customization-options',
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
      admin: {
        description:
          'Category name for this customization type (e.g., "Pendants", "Patches", etc.)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Describe this customization category',
      },
    },
    {
      name: 'customization_mode',
      type: 'select',
      options: [
        { label: 'Predefined Only', value: 'predefined' },
        { label: 'Freeform Only', value: 'freeform' },
        { label: 'Both Predefined & Freeform', value: 'both' },
      ],
      defaultValue: 'both',
      required: true,
      admin: {
        description: 'Choose how users can customize with this option',
      },
    },
    {
      name: 'base_price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Starting price for this customization type',
      },
    },
    {
      name: 'category_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Representative image for this customization category',
      },
    },
    {
      name: 'placement_options',
      type: 'select',
      hasMany: true,
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
      name: 'compatible_hat_types',
      type: 'select',
      hasMany: true,
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
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allows_multiple',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Can multiple of this customization be added to a single hat?',
      },
    },
    {
      name: 'max_quantity_per_hat',
      type: 'number',
      min: 1,
      defaultValue: 5,
      admin: {
        description:
          'Maximum number of this customization allowed per hat (if allows_multiple is checked)',
      },
    },
    {
      name: 'predefined_options',
      type: 'array',
      admin: {
        description: 'Define specific options users can choose from',
        condition: (data) => data.customization_mode !== 'freeform',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
        },
        {
          name: 'images',
          type: 'upload',
          hasMany: true,
          relationTo: 'media',
          required: true,
        },
        {
          name: 'additional_cost',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Extra cost for this specific option (added to base price)',
          },
        },
        {
          name: 'color_options',
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
              name: 'additional_cost',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Extra cost for this color option',
              },
            },
          ],
        },
        {
          name: 'size_options',
          type: 'array',
          fields: [
            {
              name: 'size',
              type: 'text',
              required: true,
            },
            {
              name: 'additional_cost',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Extra cost for this size option',
              },
            },
          ],
        },
        {
          name: 'is_active',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'freeform_settings',
      type: 'group',
      admin: {
        description: 'Settings for custom user uploads and requests',
        condition: (data) => data.customization_mode !== 'predefined',
      },
      fields: [
        {
          name: 'allow_text',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow users to add custom text',
          },
        },
        {
          name: 'allow_image_upload',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow users to upload custom images',
          },
        },
        {
          name: 'additional_cost',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Extra cost for freeform customization (added to base price)',
          },
        },
        {
          name: 'image_upload_instructions',
          type: 'richText',
          required: false,
          admin: {
            condition: (data, siblingData) => siblingData.allow_image_upload,
            description: 'Instructions for custom image uploads',
          },
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
        },
        {
          name: 'text_customization_instructions',
          type: 'richText',
          required: false,
          admin: {
            condition: (data, siblingData) => siblingData.allow_text,
            description: 'Instructions for custom text',
          },
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
        },
        {
          name: 'max_text_length',
          type: 'number',
          defaultValue: 100,
          admin: {
            condition: (data, siblingData) => siblingData.allow_text,
            description: 'Maximum number of characters allowed for custom text',
          },
        },
      ],
    },
    {
      name: 'admin_notes',
      type: 'richText',
      required: false,
      admin: {
        description: 'Private notes for administrators about this customization type',
      },
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
    },
    ...slugField(),
  ],
}
