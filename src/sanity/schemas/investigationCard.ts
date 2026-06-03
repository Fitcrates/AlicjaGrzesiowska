import { defineType, defineField } from 'sanity'
import { languageGroups, localizedObject } from './localizedFields'

const localizedInvestigationCardFields = [
  defineField({
    name: 'category',
    title: 'Category',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'title',
    title: 'Front Title',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'backTitle',
    title: 'Back Title',
    type: 'string',
  }),
  defineField({
    name: 'backContent',
    title: 'Back Content',
    type: 'text',
    rows: 4,
  }),
]

export default defineType({
  name: 'investigationCard',
  title: 'Investigation Card',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'e.g. 01, 02',
      validation: (Rule) => Rule.required(),
    }),
    localizedObject('pl', 'Polski', localizedInvestigationCardFields),
    localizedObject('en', 'English', localizedInvestigationCardFields),
  ],
  groups: languageGroups,
  preview: {
    select: {
      title: 'en.title',
      subtitle: 'en.category',
    },
  },
})
