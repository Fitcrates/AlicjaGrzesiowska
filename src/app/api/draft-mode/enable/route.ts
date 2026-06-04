import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { client } from '@/sanity/lib/client'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_READ_TOKEN || '',
    useCdn: false,
    perspective: 'previewDrafts',
  }),
  secureDevMode:
    process.env.SANITY_PREVIEW_SECURE_DEV_MODE === 'true' ||
    process.env.SANITY_STUDIO_PREVIEW_URL?.startsWith('https://') ||
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://'),
})
