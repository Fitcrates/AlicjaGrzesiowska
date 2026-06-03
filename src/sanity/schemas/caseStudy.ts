import { defineType, defineField } from 'sanity'
import { languageGroups, localizedObject } from './localizedFields'

const localizedCaseStudyFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'industry',
    title: 'Industry',
    type: 'string',
  }),
  defineField({
    name: 'focus',
    title: 'Focus',
    type: 'string',
  }),
  defineField({
    name: 'heroQuote',
    title: 'Hero Quote',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'challenge',
    title: 'Challenge',
    type: 'text',
    rows: 5,
  }),
  defineField({
    name: 'approach',
    title: 'Approach',
    type: 'text',
    rows: 5,
  }),
  defineField({
    name: 'process',
    title: 'Process Steps',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'step',
        fields: [
          { name: 'number', title: 'Step Number', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text', rows: 4 },
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'number',
          },
        },
      },
    ],
  }),
  defineField({
    name: 'deliverables',
    title: 'Deliverables',
    type: 'array',
    of: [{ type: 'string' }],
  }),
  defineField({
    name: 'results',
    title: 'Results',
    type: 'text',
    rows: 5,
  }),
]

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    localizedObject('pl', 'Polski', localizedCaseStudyFields),
    localizedObject('en', 'English', localizedCaseStudyFields),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'en.title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: 'galleryUrls',
      title: 'Gallery URLs',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'External image URLs (e.g., Unsplash) used as fallback when no Sanity assets are uploaded',
    }),
    defineField({
      name: 'nextCase',
      title: 'Next Case',
      type: 'reference',
      to: [{ type: 'caseStudy' }],
    }),
  ],
  groups: languageGroups,
  preview: {
    select: {
      title: 'en.title',
      subtitle: 'year',
    },
  },
})
