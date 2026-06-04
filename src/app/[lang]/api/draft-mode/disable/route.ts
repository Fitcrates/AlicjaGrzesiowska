import type { NextRequest } from 'next/server'

import { getLocale } from '@/lib/i18n'
import { disableDraftMode } from '@/sanity/draft-mode'

export async function GET(request: NextRequest) {
  const lang = getLocale(new URL(request.url).pathname.split('/')[1])

  return disableDraftMode(request, `/${lang}`)
}
