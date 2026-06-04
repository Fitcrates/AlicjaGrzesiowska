import { disableDraftMode } from '@/sanity/draft-mode'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return disableDraftMode(request)
}
