import { loadEnvConfig } from '@next/env'
import { defineCliConfig } from 'sanity/cli'

loadEnvConfig(process.cwd())

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const studioHost = process.env.SANITY_STUDIO_HOST || 'alicja-portfolio'

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable')
}

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: 'uebo7z7zer6kbyh5f4weyku8',
  },
  studioHost,
})
