import 'server-only'

import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { perspectiveCookieName } from '@sanity/preview-url-secret/constants'
import { cookies, draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { defaultLocale } from '@/lib/i18n'
import { client } from '@/sanity/lib/client'

const PREVIEW_PERSPECTIVE_PARAM = 'sanity-preview-perspective'
const DEFAULT_PREVIEW_PATH = `/${defaultLocale}`

function resolveRedirectUrl({
  fallbackPath = DEFAULT_PREVIEW_PATH,
  redirectTo,
  requestUrl,
  studioPreviewPerspective,
}: {
  fallbackPath?: string
  redirectTo?: string
  requestUrl: string
  studioPreviewPerspective?: string | null
}) {
  const fallbackUrl = `${fallbackPath}?${PREVIEW_PERSPECTIVE_PARAM}=${
    studioPreviewPerspective || 'drafts'
  }`
  const redirectUrl = new URL(redirectTo || fallbackUrl, requestUrl)

  if (redirectUrl.pathname.startsWith('/api/draft-mode')) {
    redirectUrl.pathname = fallbackPath
  }

  if (/^\/[a-z]{2}\/api\/draft-mode/.test(redirectUrl.pathname)) {
    redirectUrl.pathname = fallbackPath
  }

  if (
    studioPreviewPerspective &&
    !redirectUrl.searchParams.has(PREVIEW_PERSPECTIVE_PARAM)
  ) {
    redirectUrl.searchParams.set(
      PREVIEW_PERSPECTIVE_PARAM,
      studioPreviewPerspective
    )
  }

  return redirectUrl
}

export async function enableDraftMode(
  request: Request,
  fallbackPath = DEFAULT_PREVIEW_PATH
) {
  const { isValid, redirectTo, studioPreviewPerspective } =
    await validatePreviewUrl(
      client.withConfig({
        token: process.env.SANITY_API_READ_TOKEN || '',
        useCdn: false,
        perspective: 'previewDrafts',
      }),
      request.url
    )

  if (!isValid) {
    return new Response('Invalid secret', { status: 401 })
  }

  const draftModeStore = await draftMode()

  if (!draftModeStore.isEnabled) {
    draftModeStore.enable()
  }

  const isSecure =
    process.env.NODE_ENV === 'production' ||
    process.env.SANITY_PREVIEW_SECURE_DEV_MODE === 'true' ||
    process.env.SANITY_STUDIO_PREVIEW_URL?.startsWith('https://') ||
    process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://')

  const cookieStore = await cookies()
  const draftCookie = cookieStore.get('__prerender_bypass')

  if (draftCookie?.value) {
    cookieStore.set({
      name: '__prerender_bypass',
      value: draftCookie.value,
      httpOnly: true,
      path: '/',
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
    })
  }

  if (studioPreviewPerspective) {
    cookieStore.set({
      name: perspectiveCookieName,
      value: studioPreviewPerspective,
      httpOnly: true,
      path: '/',
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
    })
  }

  return NextResponse.redirect(
    resolveRedirectUrl({
      fallbackPath,
      redirectTo,
      requestUrl: request.url,
      studioPreviewPerspective,
    })
  )
}

export async function disableDraftMode(request: NextRequest, redirectPath = '/') {
  const draftModeStore = await draftMode()

  draftModeStore.disable()

  return NextResponse.redirect(new URL(redirectPath, request.url))
}
