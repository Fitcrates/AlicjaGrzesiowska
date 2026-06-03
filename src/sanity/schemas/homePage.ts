import { defineType, defineField } from 'sanity'
import { languageGroups, localizedObject } from './localizedFields'

const localizedHomePageFields = [
  defineField({
    name: 'heroTopText',
    title: 'Hero Top Text',
    type: 'text',
    rows: 2,
  }),
  defineField({
    name: 'heroWords',
    title: 'Hero Typewriter Words',
    type: 'array',
    of: [{ type: 'string' }],
    description: 'The words that get typed out in the hero section',
  }),
  defineField({
    name: 'heroPrefix',
    title: 'Hero Prefix',
    type: 'string',
  }),
  defineField({
    name: 'heroScrollLabel',
    title: 'Hero Scroll Label',
    type: 'string',
  }),

  // Challenge Selection Section
  defineField({
    name: 'challengeIntroText',
    title: 'Challenge Intro Text',
    type: 'string',
  }),
  defineField({
    name: 'challengeIntroHeading',
    title: 'Challenge Intro Heading',
    type: 'string',
  }),
  defineField({
    name: 'challengesSectionLabel',
    title: 'Challenges Section Label',
    type: 'string',
  }),
  defineField({
    name: 'challengeLabel',
    title: 'Single Challenge Label',
    type: 'string',
  }),
  defineField({
    name: 'relatedWorkLabel',
    title: 'Related Work Label',
    type: 'string',
  }),
  defineField({
    name: 'nextChallengeLabel',
    title: 'Next Challenge Label',
    type: 'string',
  }),

  // Scattered Knowledge Section
  defineField({
    name: 'knowledgeUnfixedTitle',
    title: 'Knowledge Unfixed Title',
    type: 'string',
  }),
  defineField({
    name: 'knowledgeUnfixedDesc',
    title: 'Knowledge Unfixed Description',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'knowledgeFixedTitle',
    title: 'Knowledge Fixed Title',
    type: 'string',
  }),
  defineField({
    name: 'knowledgeFixedDesc',
    title: 'Knowledge Fixed Description',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'knowledgeSectionLabel',
    title: 'Knowledge Section Label',
    type: 'string',
  }),
  defineField({
    name: 'healthyEcosystemLabel',
    title: 'Healthy Ecosystem Label',
    type: 'string',
  }),
  defineField({
    name: 'brokenConnectionLabel',
    title: 'Broken Connection Label',
    type: 'string',
  }),
  defineField({
    name: 'duplicateSignalLabel',
    title: 'Duplicate Signal Label',
    type: 'string',
  }),
  defineField({
    name: 'modalTitle',
    title: 'Modal Title',
    type: 'string',
  }),
  defineField({
    name: 'modalDescriptionPrefix',
    title: 'Modal Description Prefix',
    type: 'text',
    rows: 2,
  }),
  defineField({
    name: 'modalDescriptionSuffix',
    title: 'Modal Description Suffix',
    type: 'text',
    rows: 2,
  }),
  defineField({
    name: 'currentStateTitle',
    title: 'Current State Title',
    type: 'string',
  }),
  defineField({
    name: 'currentStateDesc',
    title: 'Current State Description',
    type: 'text',
    rows: 2,
  }),
  defineField({
    name: 'targetStateTitle',
    title: 'Target State Title',
    type: 'string',
  }),
  defineField({
    name: 'targetStateDesc',
    title: 'Target State Description',
    type: 'text',
    rows: 2,
  }),
  defineField({
    name: 'applyFixLabel',
    title: 'Apply Fix Label',
    type: 'string',
  }),
  defineField({
    name: 'resetLabel',
    title: 'Reset Label',
    type: 'string',
  }),
  defineField({
    name: 'dataLabel',
    title: 'Node: Data Label',
    type: 'string',
  }),
  defineField({
    name: 'storyLabel',
    title: 'Node: Story Label',
    type: 'string',
  }),
  defineField({
    name: 'audienceLabel',
    title: 'Node: Audience Label',
    type: 'string',
  }),
  defineField({
    name: 'contextLabel',
    title: 'Node: Context Label',
    type: 'string',
  }),
  defineField({
    name: 'designLabel',
    title: 'Node: Design Label',
    type: 'string',
  }),
  defineField({
    name: 'hubUnfixedLine1',
    title: 'Hub Unfixed Line 1',
    type: 'string',
  }),
  defineField({
    name: 'hubUnfixedLine2',
    title: 'Hub Unfixed Line 2',
    type: 'string',
  }),
  defineField({
    name: 'hubFixedLine1',
    title: 'Hub Fixed Line 1',
    type: 'string',
  }),
  defineField({
    name: 'hubFixedLine2',
    title: 'Hub Fixed Line 2',
    type: 'string',
  }),
  defineField({
    name: 'modalQuote',
    title: 'Modal Quote',
    type: 'text',
    rows: 3,
  }),
  defineField({
    name: 'perspectivesSectionLabel',
    title: 'Perspectives Section Label',
    type: 'string',
  }),
  defineField({
    name: 'exploreHowLabel',
    title: 'Explore How Label',
    type: 'string',
  }),
  defineField({
    name: 'closeLabel',
    title: 'Close Label',
    type: 'string',
  }),
  defineField({
    name: 'portfolioSectionLabel',
    title: 'Portfolio Section Label',
    type: 'string',
  }),
  defineField({
    name: 'backToIndexLabel',
    title: 'Back to Index Label',
    type: 'string',
  }),
  defineField({
    name: 'challengeSectionTitle',
    title: 'Challenge Section Title',
    type: 'string',
  }),
  defineField({
    name: 'approachSectionTitle',
    title: 'Approach Section Title',
    type: 'string',
  }),
  defineField({
    name: 'processSectionTitle',
    title: 'Process Section Title',
    type: 'string',
  }),
  defineField({
    name: 'gallerySectionTitle',
    title: 'Gallery Section Title',
    type: 'string',
  }),
  defineField({
    name: 'deliverablesSectionTitle',
    title: 'Deliverables Section Title',
    type: 'string',
  }),
  defineField({
    name: 'impactSectionTitle',
    title: 'Impact Section Title',
    type: 'string',
  }),
  defineField({
    name: 'nextProjectLabel',
    title: 'Next Project Label',
    type: 'string',
  }),
  defineField({
    name: 'continueReadingLabel',
    title: 'Continue Reading Label',
    type: 'string',
  }),
  defineField({
    name: 'industryLabel',
    title: 'Industry Label',
    type: 'string',
  }),
  defineField({
    name: 'yearLabel',
    title: 'Year Label',
    type: 'string',
  }),
  defineField({
    name: 'focusLabel',
    title: 'Focus Label',
    type: 'string',
  }),
  defineField({
    name: 'viewCaseLabel',
    title: 'View Case Label',
    type: 'string',
  }),
  defineField({
    name: 'contactSectionLabel',
    title: 'Contact Section Label',
    type: 'string',
  }),

  // Footer Section
  defineField({
    name: 'footerTitle',
    title: 'Footer Title',
    type: 'string',
  }),
  defineField({
    name: 'footerLocation',
    title: 'Footer Location',
    type: 'string',
  }),
  defineField({
    name: 'footerTagline',
    title: 'Footer Tagline',
    type: 'string',
  }),
  defineField({
    name: 'nameLabel',
    title: 'Name Label',
    type: 'string',
  }),
  defineField({
    name: 'emailLabel',
    title: 'Email Label',
    type: 'string',
  }),
  defineField({
    name: 'messageLabel',
    title: 'Message Label',
    type: 'string',
  }),
  defineField({
    name: 'sendingLabel',
    title: 'Sending Label',
    type: 'string',
  }),
  defineField({
    name: 'sendMessageLabel',
    title: 'Send Message Label',
    type: 'string',
  }),
  defineField({
    name: 'formSuccessMessage',
    title: 'Form Success Message',
    type: 'string',
  }),
  defineField({
    name: 'formErrorMessage',
    title: 'Form Error Message',
    type: 'string',
  }),
  defineField({
    name: 'footerLinks',
    title: 'Footer Links',
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          { name: 'label', title: 'Label', type: 'string' },
          { name: 'url', title: 'URL', type: 'url' },
        ],
      },
    ],
  }),
]

export default defineType({
  name: 'homePage',
  title: 'Home Page Content',
  type: 'document',
  fields: [
    localizedObject('pl', 'Polski', localizedHomePageFields),
    localizedObject('en', 'English', localizedHomePageFields),
    defineField({
      name: 'footerEmail',
      title: 'Footer Email',
      type: 'string',
    }),
  ],
  groups: languageGroups,
  preview: {
    prepare() {
      return {
        title: 'Home Page Settings',
      }
    },
  },
})
