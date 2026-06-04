import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { presentationTool } from 'sanity/presentation'

// Schemas
import { resolve } from './src/sanity/presentation/resolve'
import { schemaTypes } from './src/sanity/schemas'

function normalizeOrigin(value: string | undefined) {
  if (!value) return undefined

  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`)
    return url.origin
  } catch {
    return undefined
  }
}

function splitOrigins(value: string | undefined) {
  return value
    ?.split(',')
    .map((origin) => {
      const trimmed = origin.trim()
      return trimmed.includes('*') ? trimmed : normalizeOrigin(trimmed)
    })
    .filter((origin): origin is string => Boolean(origin)) ?? []
}

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
const previewOrigin = normalizeOrigin(siteUrl) || 'http://localhost:3000'
const vercelOrigin = normalizeOrigin(
  process.env.SANITY_STUDIO_VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    process.env.VERCEL_URL
)
const allowedPreviewOrigins = Array.from(
  new Set([
    'http://localhost:*',
    'https://localhost:*',
    previewOrigin,
    normalizeOrigin(process.env.SANITY_STUDIO_SITE_URL),
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL),
    vercelOrigin,
    ...splitOrigins(process.env.SANITY_STUDIO_ALLOWED_ORIGINS),
  ].filter((origin): origin is string => Boolean(origin)))
)

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
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: allowedPreviewOrigins,
    }),
    visionTool(),
    media(),
  ],

  schema: {
    types: schemaTypes,
  },
})
