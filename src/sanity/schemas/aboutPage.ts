import { defineType, defineField } from 'sanity'
import { languageGroups, localizedObject } from './localizedFields'

const localizedAboutFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
  }),
  defineField({
    name: 'subtitle',
    title: 'Subtitle',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'story',
    title: 'Story Sections',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'section',
        fields: [
          { name: 'heading', title: 'Heading (optional)', type: 'string' },
          { name: 'body', title: 'Body', type: 'text', rows: 6 },
        ],
      },
    ],
  }),
  defineField({
    name: 'experienceTitle',
    title: 'Experience Section Title',
    type: 'string',
  }),
  defineField({
    name: 'experience',
    title: 'Experience List',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'job',
        fields: [
          { name: 'role', title: 'Role', type: 'string' },
          { name: 'company', title: 'Company', type: 'string' },
          { name: 'years', title: 'Years', type: 'string' },
        ],
      },
    ],
  }),
  defineField({
    name: 'projectsCtaTitle',
    title: 'Projects CTA Title',
    type: 'string',
  }),
]

export default defineType({
  name: 'aboutPage',
  title: 'About Page Content',
  type: 'document',
  fields: [
    localizedObject('pl', 'Polski', localizedAboutFields),
    localizedObject('en', 'English', localizedAboutFields),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  groups: languageGroups,
  preview: {
    prepare() {
      return {
        title: 'About Page Settings',
      }
    },
  },
})
