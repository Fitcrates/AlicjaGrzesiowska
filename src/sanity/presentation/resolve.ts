import {
  defineDocuments,
  defineLocations,
  type DocumentLocationResolvers,
  type PresentationPluginOptions,
} from 'sanity/presentation'

const caseRoutes = ['/en/case/:slug', '/pl/case/:slug']

const mainDocuments = defineDocuments([
  {
    route: ['/', '/en', '/pl'],
    type: 'homePage',
  },
  {
    route: caseRoutes,
    filter: `_type == "caseStudy" && slug.current == $slug`,
  },
])

const locations: DocumentLocationResolvers = {
  homePage: defineLocations({
    message: 'This document is used on the localized home pages.',
    tone: 'positive',
  }),
  challenge: defineLocations({
    select: {
      title: 'en.title',
    },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || 'Home page challenge section', href: '/en' },
        { title: 'Polish home page challenge section', href: '/pl' },
      ],
    }),
  }),
  investigationCard: defineLocations({
    select: {
      title: 'en.title',
    },
    resolve: (doc) => ({
      locations: [
        { title: doc?.title || 'Home page perspectives section', href: '/en' },
        { title: 'Polish home page perspectives section', href: '/pl' },
      ],
    }),
  }),
  caseStudy: defineLocations({
    select: {
      title: 'en.title',
      slug: 'slug.current',
    },
    resolve: (doc) => ({
      locations: doc?.slug
        ? [
            { title: doc?.title || 'Case study', href: `/en/case/${doc.slug}` },
            { title: 'Polish case study', href: `/pl/case/${doc.slug}` },
            { title: 'Home page case study grid', href: '/en' },
            { title: 'Polish home page case study grid', href: '/pl' },
          ]
        : [
            { title: 'Home page case study grid', href: '/en' },
            { title: 'Polish home page case study grid', href: '/pl' },
          ],
    }),
  }),
}

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments,
  locations,
}
