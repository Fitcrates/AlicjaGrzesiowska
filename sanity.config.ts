import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { presentationTool } from 'sanity/presentation'

// Schemas
import { resolve } from './src/sanity/presentation/resolve'
import { schemaTypes } from './src/sanity/schemas'

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'acuukn8a'
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  'production'
const siteUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.SANITY_STUDIO_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000'
const previewOrigin = siteUrl.replace(/\/$/, '')

export default defineConfig({
  name: 'default',
  title: 'Alicja Portfolio',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
              ),
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !['homePage', 'aboutPage'].includes(listItem.getId() as string)
            ),
          ]),
    }),
    presentationTool({
      resolve,
      previewUrl: {
        initial: `${previewOrigin}/en`,
        previewMode: {
          enable: `${previewOrigin}/api/draft-mode/enable`,
          disable: `${previewOrigin}/api/draft-mode/disable`,
        },
      },
      allowOrigins: ['http://localhost:*', 'https://localhost:*', previewOrigin],
    }),
    visionTool(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
})
