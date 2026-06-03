import { defineType, defineField } from 'sanity'
import { languageGroups, localizedObject } from './localizedFields'

const localizedChallengeFields = [
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'pathHero',
    title: 'Path Hero Text',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'pathContent',
    title: 'Path Content Sections',
    type: 'array',
    of: [
      {
        type: 'object',
        name: 'section',
        fields: [
          { name: 'heading', title: 'Heading', type: 'string' },
          { name: 'body', title: 'Body', type: 'text', rows: 4 },
        ],
      },
    ],
  }),
]

export default defineType({
  name: 'challenge',
  title: 'Challenge',
  type: 'document',
  fields: [
    localizedObject('pl', 'Polski', localizedChallengeFields),
    localizedObject('en', 'English', localizedChallengeFields),
    defineField({
      name: 'number',
      title: 'Number',
      type: 'string',
      description: 'e.g. 01, 02',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedCases',
      title: 'Related Cases',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'caseStudy' }],
        },
      ],
    }),
    defineField({
      name: 'nextChallenge',
      title: 'Next Challenge',
      type: 'reference',
      to: [{ type: 'challenge' }],
    }),
  ],
  groups: languageGroups,
  preview: {
    select: {
      title: 'en.title',
      subtitle: 'number',
    },
  },
})
