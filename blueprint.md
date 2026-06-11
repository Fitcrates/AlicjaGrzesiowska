# Sanity Visual Editing w Next.js - pelna implementacja

Ten dokument opisuje kompletna implementacje Sanity Studio z Presentation Tool, Draft Mode, Sanity Live, stega/source maps oraz recznym mapowaniem `data-sanity` dla pelnego Visual Editing. Jest napisany jako blueprint do wykorzystania przy kolejnych stronach.

Zakladamy stack:

- Next.js App Router
- Sanity Studio w tym samym repo albo jako studio deployowane z tego repo
- `sanity`
- `next-sanity`
- `@sanity/visual-editing` / eksporty przez `next-sanity/visual-editing`
- `@sanity/preview-url-secret`
- opcjonalnie i18n ze sciezkami typu `/en`, `/pl`

## Cel implementacji

Poprawnie wdrozone Visual Editing musi spelnic wszystkie warunki:

- Sanity Studio laczy sie z preview bez bledu `Unable to connect to visual editing`.
- Presentation Tool potrafi wlaczyc Draft Mode przez route API aplikacji.
- Strona w iframe Studio renderuje drafty, nie tylko opublikowane dane.
- Sanity Live odswieza preview po publish/mutation.
- Elementy DOM maja source mapy lub jawne `data-sanity`, dzieki czemu hover pokazuje overlay/border.
- Klikniecie tekstu w preview wybiera prawidlowy dokument i pole w prawym panelu Studio.
- Sciezki w Presentation pasuja do realnego routingu aplikacji.
- Dzialaja wszystkie jezyki i wszystkie typy dokumentow uzywane na stronie.

Sam fakt, ze iframe sie laduje, nie oznacza jeszcze, ze Visual Editing dziala. Jezeli nie ma ramek, hover/click nie wybiera pola, albo Studio wybiera tylko dokument bez konkretnego fielda, brakuje source map/stega albo jawnych `data-sanity`.

## Pakiety

Minimalny zestaw:

```bash
npm install sanity next-sanity @sanity/preview-url-secret
```

W praktyce projekt uzywa:

```json
{
  "dependencies": {
    "@sanity/preview-url-secret": "...",
    "next-sanity": "...",
    "sanity": "..."
  }
}
```

`next-sanity` eksportuje m.in.:

- `createClient`
- `defineLive`
- `VisualEditing`
- `createDataAttribute`
- `stegaClean`

## Zmienne srodowiskowe

W aplikacji i Studio powinny byc ustawione:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01

SANITY_API_READ_TOKEN=...
NEXT_PUBLIC_SANITY_BROWSER_READ_TOKEN=...

NEXT_PUBLIC_SITE_URL=https://example.com
SANITY_STUDIO_PREVIEW_URL=https://example.com
SANITY_STUDIO_SITE_URL=https://example.com
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-studio.sanity.studio

SANITY_STUDIO_ALLOWED_ORIGINS=https://example.com,https://*.vercel.app
```

Wazne:

- `SANITY_API_READ_TOKEN` musi miec dostep do draftow.
- `NEXT_PUBLIC_SANITY_BROWSER_READ_TOKEN` jest potrzebny dla Sanity Live po stronie browsera. Jezeli projekt nie chce publicznego browser tokena, trzeba swiadomie ograniczyc Live Editing i przetestowac konsekwencje.
- `SANITY_STUDIO_PREVIEW_URL` powinno byc bazowym originem aplikacji, np. `https://example.com`, nie `https://example.com/en/api/draft-mode/enable`.
- Route wlaczajacy draft mode powinien byc relatywny w konfiguracji Studio, np. `/api/draft-mode/enable`.

## Klient Sanity

Plik przykladowy: `src/sanity/lib/client.ts`.

```ts
import { createClient } from 'next-sanity'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-02-01'

export const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
  'https://your-studio.sanity.studio'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl,
  },
})
```

Wazne:

- `stega.studioUrl` jest wymagane, zeby Sanity moglo generowac edit intent/source map metadata.
- Domyslny klient moze byc `published`, ale preview fetch musi przelaczac sie na `drafts` i `stega: true`.

## Sanity Live

Plik: `src/sanity/lib/live.ts`.

```ts
import { defineLive } from 'next-sanity/live'
import { apiVersion, client } from './client'

const serverToken = process.env.SANITY_API_READ_TOKEN
const browserToken = process.env.NEXT_PUBLIC_SANITY_BROWSER_READ_TOKEN || false

export const { sanityFetch: sanityLiveFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion }),
  serverToken,
  browserToken,
})
```

`SanityLive` musi byc renderowane w root layout aplikacji.

## Root layout

Plik: `src/app/layout.tsx`.

```tsx
import { SanityLive } from '@/sanity/lib/live'
import { isSanityPreviewRequest } from '@/sanity/preview'
import { VisualEditing } from 'next-sanity/visual-editing'

export default async function RootLayout({ children }) {
  const isPreview = await isSanityPreviewRequest()

  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive includeDrafts={isPreview} />
        <VisualEditing />
      </body>
    </html>
  )
}
```

Ważne pułapki i najlepsze praktyki dla `<VisualEditing />`:

- **Problem z warunkowym renderowaniem (`draftMode` w iframie)**: Jeśli użyjesz `{(await draftMode()).isEnabled && <VisualEditing />}` lub `{isPreview && <VisualEditing />}`, to komponent może nie zostać wyrenderowany w zewnętrznym (produkcyjnym) Sanity Studio z powodu blokowania ciasteczek `SameSite=Lax` w cross-origin iframes (np. przez Chrome/Safari). Jeśli `<VisualEditing />` się nie zrenderuje, Studio zgłosi błąd "Unable to connect to visual editing", ponieważ nie będzie w stanie dokonać handshake'u.
- **Problem z renderowaniem bezwarunkowym**: Jeśli po prostu wstawisz `<VisualEditing />` na stałe, Sanity Studio połączy się bez problemu, ale nakładki i ikony edycji (Vercel Toolbar) zaczną się pojawiać u Ciebie również na publicznej stronie (na lokalnym serwerze lub na produkcji, gdy jesteś zalogowany).
- **Złoty środek (Wrapper)**: Aby połączyć bezbłędne łączenie ze Studio z ukryciem ramek na publicznej stronie, użyj dedykowanego komponentu klienckiego z wbudowanym hookiem `useIsPresentationTool` oraz stylami CSS:

`src/components/VisualEditingWrapper.tsx`
```tsx
'use client'

import { VisualEditing } from 'next-sanity/visual-editing'
import { useIsPresentationTool } from 'next-sanity/hooks'
import { useEffect } from 'react'

export default function VisualEditingWrapper() {
  const isPresentationTool = useIsPresentationTool()

  // Zawsze ładujemy VisualEditing, aby odpowiadał na handshake iframa (omija problem z cookie)
  // Jeśli jednak nie jesteśmy w trybie Presentation Tool, chowamy cały UI za pomocą CSS.
  useEffect(() => {
    if (!isPresentationTool) {
      const style = document.createElement('style')
      style.innerHTML = `
        sanity-visual-editing { display: none !important; }
      `
      document.head.appendChild(style)
      return () => {
        document.head.removeChild(style)
      }
    }
  }, [isPresentationTool])

  return <VisualEditing />
}
```

Dzięki temu w `layout.tsx` podpinasz po prostu bezwarunkowo `<VisualEditingWrapper />` zamiast oryginalnego `<VisualEditing />`.

## Preview headers

Plik: `src/sanity/preview.ts`.

```ts
import { draftMode, headers } from 'next/headers'

export const SANITY_PREVIEW_HEADER = 'x-sanity-presentation-preview'
export const SANITY_PREVIEW_PERSPECTIVE_HEADER = 'x-sanity-preview-perspective'

export async function isSanityPreviewRequest() {
  const [{ isEnabled }, headerStore] = await Promise.all([draftMode(), headers()])

  return isEnabled || headerStore.get(SANITY_PREVIEW_HEADER) === '1'
}
```

Dlaczego header jest potrzebny:

- Draft Mode opiera sie o cookies.
- Iframe w Sanity Studio moze miec ograniczenia dotyczace third-party cookies.
- Po pierwszym wlaczeniu preview query string moze zniknac, a route zostaje czysty, np. `/en/about`.
- Middleware/proxy powinien nadal rozpoznac request jako preview request i przekazac header do Server Components.

## Proxy / middleware

W Next 16 plik moze byc `proxy.ts`. Dostosuj do wersji Next i dokumentacji projektu.

Zadania proxy:

- ignorowac pliki publiczne, `_next`, API i Studio
- obslugiwac i18n
- rozpoznawac requesty z Sanity Presentation
- ustawic headers:
  - `x-sanity-presentation-preview: 1`
  - `x-sanity-preview-perspective: drafts`

Przykladowa logika:

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, locales } from '@/lib/i18n'

const PUBLIC_FILE = /\.(.*)$/
const SANITY_PREVIEW_HEADER = 'x-sanity-presentation-preview'
const SANITY_PREVIEW_PERSPECTIVE_HEADER = 'x-sanity-preview-perspective'
const SANITY_PREVIEW_PERSPECTIVE_PARAM = 'sanity-preview-perspective'
const SANITY_PREVIEW_SECRET_PARAM = 'sanity-preview-secret'

function getRefererUrl(request: NextRequest) {
  const referer = request.headers.get('referer')
  if (!referer) return null

  try {
    return new URL(referer)
  } catch {
    return null
  }
}

function isSanityReferer(request: NextRequest) {
  const hostname = getRefererUrl(request)?.hostname

  return (
    hostname === 'sanity.io' ||
    Boolean(hostname?.endsWith('.sanity.io')) ||
    Boolean(hostname?.endsWith('.sanity.studio'))
  )
}

function getSanityPreviewPerspective(request: NextRequest) {
  const refererUrl = getRefererUrl(request)

  return (
    request.nextUrl.searchParams.get(SANITY_PREVIEW_PERSPECTIVE_PARAM) ||
    request.cookies.get(SANITY_PREVIEW_PERSPECTIVE_PARAM)?.value ||
    refererUrl?.searchParams.get(SANITY_PREVIEW_PERSPECTIVE_PARAM) ||
    null
  )
}

function isSanityPreviewRequest(request: NextRequest) {
  return (
    Boolean(getSanityPreviewPerspective(request)) ||
    request.nextUrl.searchParams.has(SANITY_PREVIEW_SECRET_PARAM) ||
    isSanityReferer(request)
  )
}

function withSanityPreviewHeaders(request: NextRequest) {
  if (!isSanityPreviewRequest(request)) {
    return NextResponse.next()
  }

  const requestHeaders = new Headers(request.headers)
  const perspective = getSanityPreviewPerspective(request) || 'drafts'

  requestHeaders.set(SANITY_PREVIEW_HEADER, '1')
  requestHeaders.set(SANITY_PREVIEW_PERSPECTIVE_HEADER, perspective)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio')
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return withSanityPreviewHeaders(request)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!studio|api|_next|.*\\..*).*)'],
}
```

Pułapka:

- Nie pomijaj requestow z Sanity iframe tylko dlatego, ze nie maja juz query stringa.
- `referer` ze Studio jest dobrym sygnalem do utrzymania preview context.

## Fetch danych z draft/stega

Plik: `src/sanity/lib/fetch.ts`.

Zadania:

- w buildzie uzywac `published` i `stega: false`
- poza preview uzywac `published` i `stega: false`
- w preview uzywac `drafts` lub perspektywy z cookie/headera oraz `stega: true`
- korzystac z `sanityLiveFetch`

```ts
import 'server-only'

import type { QueryParams } from 'next-sanity'
import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { cookies, draftMode, headers } from 'next/headers'
import {
  resolvePerspectiveFromCookies,
  type LivePerspective,
} from 'next-sanity/live'
import { client, sanityCacheTags } from './client'
import { sanityLiveFetch } from './live'
import {
  SANITY_PREVIEW_HEADER,
  SANITY_PREVIEW_PERSPECTIVE_HEADER,
} from '../preview'

function resolveHeaderPerspective(value: string | null): LivePerspective {
  return value && value !== 'raw' ? (value as LivePerspective) : 'drafts'
}

async function resolveLiveFetchOptions() {
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return { perspective: 'published' as const, stega: false }
  }

  const [{ isEnabled }, headerStore] = await Promise.all([draftMode(), headers()])
  const headerPerspective = headerStore.get(SANITY_PREVIEW_PERSPECTIVE_HEADER)
  const hasPreviewHeader = headerStore.get(SANITY_PREVIEW_HEADER) === '1'

  if (!isEnabled && !hasPreviewHeader && !headerPerspective) {
    return { perspective: 'published' as const, stega: false }
  }

  const perspective =
    headerPerspective
      ? resolveHeaderPerspective(headerPerspective)
      : (await resolvePerspectiveFromCookies({ cookies: await cookies() })) ??
        'drafts'

  return { perspective, stega: true }
}

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = ['sanity'],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<QueryResponse> {
  const { data } = await sanityLiveFetch({
    query,
    params,
    tags,
    ...(await resolveLiveFetchOptions()),
  })

  return data as QueryResponse
}
```

Wazne:

- Jezeli `stega` jest false w preview, overlay nie bedzie mial source map.
- Jezeli `perspective` zostanie `published`, drafty nie beda widoczne.
- Jezeli `SanityLive` nie dostanie `includeDrafts`, publish/mutation moga nie odswiezac preview tak, jak oczekujemy.

## Draft Mode API

### Shared handler

Nie eksportuj dodatkowych funkcji z route files, jezeli dana wersja Next tego nie lubi. Bezpieczny wzorzec:

- logika w `src/sanity/draft-mode.ts`
- route file eksportuje tylko `GET`

Plik: `src/sanity/draft-mode.ts`.

```ts
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
```

### Root routes

`src/app/api/draft-mode/enable/route.ts`

```ts
import { enableDraftMode } from '@/sanity/draft-mode'

export async function GET(request: Request) {
  return enableDraftMode(request)
}
```

`src/app/api/draft-mode/disable/route.ts`

```ts
import { disableDraftMode } from '@/sanity/draft-mode'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return disableDraftMode(request)
}
```

### Localized fallback routes

Jezeli aplikacja ma `/en`, `/pl`, dodaj tez:

- `src/app/[lang]/api/draft-mode/enable/route.ts`
- `src/app/[lang]/api/draft-mode/disable/route.ts`

Dlaczego:

- Studio lub iframe potrafi przypadkiem trafic w `/en/api/draft-mode/enable`.
- Bez fallbacku dostaniesz 404 mimo poprawnej bazowej konfiguracji.

`src/app/[lang]/api/draft-mode/enable/route.ts`

```ts
import { getLocale } from '@/lib/i18n'
import { enableDraftMode } from '@/sanity/draft-mode'

export async function GET(request: Request) {
  const lang = getLocale(new URL(request.url).pathname.split('/')[1])

  return enableDraftMode(request, `/${lang}`)
}
```

`src/app/[lang]/api/draft-mode/disable/route.ts`

```ts
import type { NextRequest } from 'next/server'

import { getLocale } from '@/lib/i18n'
import { disableDraftMode } from '@/sanity/draft-mode'

export async function GET(request: NextRequest) {
  const lang = getLocale(new URL(request.url).pathname.split('/')[1])

  return disableDraftMode(request, `/${lang}`)
}
```

## Sanity Studio configuration

Plik: `sanity.config.ts`.

Najwazniejsze elementy:

- `presentationTool`
- `resolve`
- `previewUrl.initial`
- `previewMode.enable`
- `previewMode.disable`
- `allowOrigins`
- stabilna struktura singletonow

```ts
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
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
  return (
    value
      ?.split(',')
      .map((origin) => {
        const trimmed = origin.trim()
        return trimmed.includes('*') ? trimmed : normalizeOrigin(trimmed)
      })
      .filter((origin): origin is string => Boolean(origin)) ?? []
  )
}

const siteUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL ||
  process.env.SANITY_STUDIO_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000'

const previewOrigin = normalizeOrigin(siteUrl) || 'http://localhost:3000'

const allowedPreviewOrigins = Array.from(
  new Set([
    'http://localhost:*',
    'https://localhost:*',
    previewOrigin,
    normalizeOrigin(process.env.SANITY_STUDIO_SITE_URL),
    normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL),
    ...splitOrigins(process.env.SANITY_STUDIO_ALLOWED_ORIGINS),
  ].filter((origin): origin is string => Boolean(origin)))
)

export default defineConfig({
  name: 'default',
  title: 'Project',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [
    structureTool(),
    presentationTool({
      resolve,
      previewUrl: {
        initial: previewOrigin,
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
      allowOrigins: allowedPreviewOrigins,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
```

Pułapki:

- `initial` powinno byc originem albo realna strona preview, nie route API.
- `allowOrigins` musi zawierac produkcje, preview deploymenty i localhost.
- Nie wpisuj `/en/api/draft-mode/enable` jako bazowego preview URL.
- Dla i18n mozna startowac z originu, a resolver poda konkretne lokalizacje.

## Presentation resolver

Plik: `src/sanity/presentation/resolve.ts`.

Resolver ma dwa zadania:

1. Powiedziec Presentation Tool, jaki dokument odpowiada aktualnej stronie.
2. Pokazac w Studio, na jakich stronach dany dokument jest uzywany.

Przyklad:

```ts
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
    route: ['/en/about', '/pl/about'],
    type: 'aboutPage',
  },
  {
    route: caseRoutes,
    filter: `_type == "caseStudy" && slug.current == $slug`,
  },
])

const locations: DocumentLocationResolvers = {
  homePage: defineLocations({
    message: 'This document is used on the localized home pages.',
    resolve: () => ({
      locations: [
        { title: 'English home page', href: '/en' },
        { title: 'Polish home page', href: '/pl' },
      ],
    }),
    tone: 'positive',
  }),
  aboutPage: defineLocations({
    message: 'This document is used on the localized about pages.',
    resolve: () => ({
      locations: [
        { title: 'English about page', href: '/en/about' },
        { title: 'Polish about page', href: '/pl/about' },
      ],
    }),
    tone: 'positive',
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
```

Zasady:

- Kazdy typ dokumentu renderowany na stronie powinien miec `locations`.
- Kazda strona, ktora ma byc otwierana w Presentation, powinna miec `mainDocuments`.
- Sciezki musza dokladnie pasowac do realnego routingu Next.
- Jezeli aplikacja ma `/en/case/:slug`, resolver nie moze wskazywac `/case/:slug`.

## Routing i i18n

Przy i18n ze strukturami `/en`, `/pl`, nie mieszaj dwoch strategii.

Jezeli fizyczny routing Next to:

```txt
src/app/[lang]/page.tsx
src/app/[lang]/about/page.tsx
src/app/[lang]/case/[slug]/page.tsx
```

to linki musza generowac:

```txt
/en
/pl
/en/about
/pl/about
/en/case/my-slug
/pl/case/my-slug
```

Helper:

```ts
export const locales = ['pl', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getLocale(value?: string): Locale {
  return value && isLocale(value) ? value : defaultLocale
}

export function withLocalePath(locale: Locale, path: string) {
  return `/${locale}${path === '/' ? '' : path}`
}
```

Dodaj fallbacki dla starych lub bezjezykowych URL:

`src/app/case/[slug]/page.tsx`

```ts
import { redirect } from 'next/navigation'
import { defaultLocale } from '@/lib/i18n'

export default async function DefaultLocaleCasePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  redirect(`/${defaultLocale}/case/${slug}`)
}
```

`src/app/about/page.tsx`

```ts
import { redirect } from 'next/navigation'
import { defaultLocale } from '@/lib/i18n'

export default function DefaultLocaleAboutPage() {
  redirect(`/${defaultLocale}/about`)
}
```

## Schemas

### Singleton documents

Dla stron typu home/about warto uzywac singletonow:

- `homePage` z document id `homePage`
- `aboutPage` z document id `aboutPage`

W `structureTool` ustaw:

```ts
S.listItem()
  .title('Home Page')
  .id('homePage')
  .child(S.document().schemaType('homePage').documentId('homePage'))
```

Dlaczego:

- Presentation Tool i `data-sanity` maja stabilny document id.
- Nie powstaja duplikaty settings page.
- Fallback w komponentach moze bezpiecznie uzyc `data?._id || 'homePage'`.

### Lokalizowane pola

Przyklad:

```ts
import { defineField } from 'sanity'

export const languageGroups = [
  { name: 'pl', title: 'Polski' },
  { name: 'en', title: 'English' },
]

export function localizedObject(
  name: 'pl' | 'en',
  title: string,
  fields: ReturnType<typeof defineField>[]
) {
  return defineField({
    name,
    title,
    type: 'object',
    group: name,
    fields,
    options: {
      collapsible: false,
    },
  })
}
```

Przy takiej strukturze sciezki pol w Visual Editing wygladaja tak:

```txt
en.title
pl.title
en.story[_key == "..."].body
pl.process[_key == "..."].description
```

Dlatego helper `localizedSanityPath(locale, path)` dodaje jezyk na poczatku sciezki.

### Dokumenty kolekcji

Dla typow takich jak:

- `caseStudy`
- `challenge`
- `investigationCard`

zadbaj o:

- `_id` w query
- `_type` w query
- `slug.current` dla stron dynamicznych
- `_key` dla tablic obiektow
- stabilne `locations` w Presentation resolver

## GROQ queries

Kazde query uzywane przez komponenty Visual Editing powinno zwracac:

- `_id`
- `_type`
- `_key` dla tablic obiektow
- pola lokalizowane w sposob zgodny ze schematem

Przyklad:

```ts
export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  _id,
  _type,
  "title": coalesce(select($lang == "pl" => pl.title, en.title), title),
  "subtitle": coalesce(select($lang == "pl" => pl.subtitle, en.subtitle), subtitle),
  "story": coalesce(
    select($lang == "pl" => pl.story[] { _key, heading, body }, en.story[] { _key, heading, body }),
    story[] { _key, heading, body }
  ),
  "experienceTitle": coalesce(select($lang == "pl" => pl.experienceTitle, en.experienceTitle), experienceTitle),
  "experience": coalesce(
    select($lang == "pl" => pl.experience[] { _key, role, company, years }, en.experience[] { _key, role, company, years }),
    experience[] { _key, role, company, years }
  ),
  "profileImageUrl": profileImage.asset->url
}`
```

Przyklad case study:

```ts
export const caseStudyBySlugQuery = groq`*[_type == "caseStudy" && slug.current == $slug][0] {
  _id,
  _type,
  "slug": slug.current,
  "title": coalesce(select($lang == "pl" => pl.title, en.title), title),
  year,
  "heroQuote": coalesce(select($lang == "pl" => pl.heroQuote, en.heroQuote), heroQuote),
  "process": coalesce(
    select($lang == "pl" => pl.process[] { _key, number, title, description }, en.process[] { _key, number, title, description }),
    process[] { _key, number, title, description }
  )
}`
```

Pułapki:

- Jezeli tablica obiektow nie zwraca `_key`, klik w konkretny element moze wskazac zly element po reorderze.
- Jezeli query nie zwraca `_type`, helper `data-sanity` nie ma pelnego kontekstu.
- Jezeli query mapuje wiele pol przez `coalesce(select(...))`, automatyczne stega moze nie wystarczyc dla wszystkich elementow. Wtedy dodaj jawne `data-sanity`.

## Helper `data-sanity`

Plik: `src/sanity/visual-editing.ts`.

```ts
import { createDataAttribute, type CreateDataAttributeProps } from 'next-sanity'

import type { Locale } from '@/lib/i18n'
import { dataset, projectId, studioUrl } from '@/sanity/lib/client'

export type SanityPath = NonNullable<CreateDataAttributeProps['path']>
type PathSegment = string | number | { _key: string }

function isPathArray(path: SanityPath): path is PathSegment[] {
  return Array.isArray(path)
}

export function localizedSanityPath(locale: Locale, path: SanityPath) {
  return isPathArray(path) ? [locale, ...path] : [locale, path]
}

export function keyedPath(key: string | undefined, fallbackIndex: number) {
  return key ? [{ _key: key }] : [fallbackIndex]
}

export function sanityDataAttribute({
  id,
  path,
  type,
}: {
  id?: string
  path: SanityPath
  type?: string
}) {
  if (!id || !type) return undefined

  return createDataAttribute({
    baseUrl: studioUrl,
    dataset,
    id,
    path,
    projectId,
    type,
  }).toString()
}
```

Kiedy uzywac jawnego `data-sanity`:

- tekst jest dzielony przez `.split()`
- tekst jest animowany
- tekst jest skladany z wielu fragmentow
- pole pochodzi z `coalesce(select(...))`
- pole jest w tablicy obiektow
- element jest SVG `<text>`
- element jest w modalu/overlay
- komponent jest klientowy i manipuluje wartoscia
- chcesz miec pewnosc, ze klik wybierze konkretne pole, a nie tylko dokument

## Wzorzec komponentu

Przyklad dla lokalizowanego singletona:

```tsx
import { defaultLocale, type Locale } from '@/lib/i18n'
import type { HomePage } from '@/sanity/lib/types'
import {
  localizedSanityPath,
  sanityDataAttribute,
  type SanityPath,
} from '@/sanity/visual-editing'

export function Hero({
  data,
  locale = defaultLocale,
}: {
  data?: HomePage | null
  locale?: Locale
}) {
  const homeId = data?._id || 'homePage'
  const homeType = data?._type || 'homePage'
  const editAttr = (path: SanityPath) =>
    sanityDataAttribute({
      id: homeId,
      type: homeType,
      path: localizedSanityPath(locale, path),
    })

  return (
    <h1 data-sanity={editAttr('heroTopText')}>
      {data?.heroTopText || 'Fallback'}
    </h1>
  )
}
```

Przyklad dla kolekcji:

```tsx
const caseAttr = (item: PortfolioCase, path: SanityPath) =>
  sanityDataAttribute({
    id: item._id,
    type: item._type || 'caseStudy',
    path: localizedSanityPath(locale, path),
  })

return <h3 data-sanity={caseAttr(item, 'title')}>{item.title}</h3>
```

Przyklad dla tablicy obiektow:

```tsx
{study.process.map((step, index) => (
  <p
    key={step._key || index}
    data-sanity={caseAttr([
      'process',
      ...keyedPath(step._key, index),
      'description',
    ])}
  >
    {step.description}
  </p>
))}
```

Przyklad dla pola nielokalizowanego:

```tsx
const caseRootAttr = (path: SanityPath) =>
  sanityDataAttribute({
    id: study._id,
    type: study._type || 'caseStudy',
    path,
  })

return <span data-sanity={caseRootAttr('year')}>{study.year}</span>
```

## Strony

Kazda strona powinna:

- pobrac `locale` z params
- przekazac `locale` do komponentow
- uzywac `sanityFetch`, nie bezposrednio `client.fetch`
- tagowac fetch pod revalidation
- nie czyscic stega przez `stegaClean` na tekstach renderowanych do DOM

Przyklad:

```tsx
export default async function Home({ params }) {
  const { lang } = await params
  const locale = getLocale(lang)

  const [homePage, cases] = await Promise.all([
    sanityFetch<HomePage | null>({
      query: homePageQuery,
      params: { lang: locale },
      tags: [sanityCacheTags.homePage],
    }),
    sanityFetch<PortfolioCase[]>({
      query: caseStudiesQuery,
      params: { lang: locale },
      tags: [sanityCacheTags.caseStudy],
    }),
  ])

  return (
    <>
      <Hero data={homePage} locale={locale} />
      <PortfolioGrid cases={cases} data={homePage} locale={locale} />
    </>
  )
}
```

`stegaClean` stosuj tylko do:

- slugow w URL
- metadanych `<head>`
- wartosci przekazywanych do bibliotek, ktore nie powinny dostac ukrytych znakow stega

Nie stosuj `stegaClean` do widocznych tekstow, ktore maja byc edytowalne w preview.

## Revalidation

Route revalidation powinien:

- zweryfikowac secret lub podpis webhooka
- revalidowac tagi Sanity
- revalidowac konkretne pathy dla dynamicznych slugow
- uwzglednic wszystkie locale

Przykladowe operacje:

```ts
revalidateTag('sanity')
revalidateTag(`sanity:${type}`)
revalidateTag(`sanity:${documentId}`)

for (const locale of locales) {
  revalidatePath(`/${locale}`)
  revalidatePath(`/${locale}/about`)
  revalidatePath(`/${locale}/case/${slug}`)
}
```

Sanity Live pomaga w preview, ale webhook/revalidation nadal jest potrzebny dla produkcyjnego cache.

## Checklist wdrozenia od zera

1. Zainstaluj pakiety Sanity i next-sanity.
2. Skonfiguruj `src/sanity/lib/client.ts` z `stega.studioUrl`.
3. Skonfiguruj `src/sanity/lib/live.ts` z `defineLive`.
4. Dodaj `src/sanity/preview.ts`.
5. Dodaj `src/sanity/lib/fetch.ts`, ktory w preview ustawia `perspective: drafts` i `stega: true`.
6. Dodaj shared draft mode handler `src/sanity/draft-mode.ts`.
7. Dodaj route `/api/draft-mode/enable`.
8. Dodaj route `/api/draft-mode/disable`.
9. Przy i18n dodaj route `/:lang/api/draft-mode/enable` i `/:lang/api/draft-mode/disable`.
10. Dodaj proxy/middleware, ktory rozpoznaje Sanity iframe i przekazuje preview headers.
11. Dodaj `<SanityLive />` i `<VisualEditing />` w root layout.
12. Skonfiguruj `presentationTool` w `sanity.config.ts`.
13. Dodaj `resolve.ts` dla wszystkich stron i typow dokumentow.
14. Uporzadkuj schemy: singletony, kolekcje, lokalizowane pola.
15. W query zwracaj `_id`, `_type`, `_key`.
16. Stworz helper `src/sanity/visual-editing.ts`.
17. Dodaj `data-sanity` do wszystkich renderowanych pol Sanity.
18. Przekazuj `locale` do komponentow.
19. Upewnij sie, ze linki generuja realne sciezki aplikacji.
20. Dodaj fallback route dla starych/bezjezykowych URL.
21. Uruchom `npx tsc --noEmit`.
22. Uruchom `npm run lint`.
23. Uruchom `npm run build`.
24. Wdrozenie testuj w Sanity Presentation dla kazdego typu strony i dokumentu.

## Checklist testow w Sanity Studio

Dla kazdej strony:

- Otworz Presentation.
- Sprawdz, czy iframe laduje strone bez 404.
- Sprawdz console: brak `Unable to connect to visual editing`.
- Sprawdz console: brak 404 na `/api/draft-mode/enable` i `/:lang/api/draft-mode/enable`.
- Najedz na tekst renderowany z Sanity.
- Powinna pojawic sie ramka/overlay.
- Kliknij tekst.
- Po prawej powinien wybrac sie prawidlowy dokument.
- Po prawej powinno wybrac sie prawidlowe pole, nie tylko dokument.
- Zmien pole.
- Preview powinno pokazac zmiane.
- Kliknij Publish.
- Preview powinno nadal pokazywac aktualna tresc.
- Przejdz miedzy stronami linkami w preview.
- Po nawigacji overlay nadal powinien dzialac.

Testuj osobno:

- `/en`
- `/pl`
- `/en/about`
- `/pl/about`
- `/en/case/:slug`
- `/pl/case/:slug`
- dokumenty singleton
- dokumenty kolekcji
- pola w tablicach
- pola w modalach
- pola w SVG
- pola nielokalizowane

## Najczestsze problemy i diagnoza

### `Unable to connect to visual editing`

Najczestsze przyczyny:

- brak `<VisualEditing />`
- zly `previewUrl.initial`
- zle `allowOrigins`
- CORS/origin nie dodany w Sanity
- route draft mode zwraca blad
- iframe blokuje cookies i aplikacja nie ma fallback preview headers

Sprawdz:

- czy `/api/draft-mode/enable` dziala
- czy `validatePreviewUrl` dostaje token
- czy Studio origin jest w `allowOrigins`
- czy produkcyjny URL jest poprawny

### Iframe laczy sie, ale nie ma ramek

Najczestsze przyczyny:

- `stega: false` w preview
- `perspective: published` w preview
- tekst jest czyszczony przez `stegaClean`
- tekst jest dzielony/animowany i stega nie dochodzi do DOM
- query nie zwraca `_id` / `_type`
- komponent nie ma jawnego `data-sanity`

Rozwiazanie:

- wlacz `stega: true` w preview fetch
- dodaj `data-sanity` na renderowane elementy
- nie czysc widocznych tekstow `stegaClean`

### Klik wybiera dokument, ale nie pole

Najczestsze przyczyny:

- `data-sanity` wskazuje tylko dokument bez `path`
- sciezka nie uwzglednia locale
- tablica nie uzywa `_key`
- komponent renderuje fallback bez danych Sanity

Rozwiazanie:

- uzyj `localizedSanityPath(locale, 'field')`
- dla tablic uzyj `['items', {_key}, 'field']`
- upewnij sie, ze query zwraca `_key`

### 404 na stronach dynamicznych

Najczestsze przyczyny:

- resolver wskazuje inna sciezke niz Next routing
- link helper pomija domyslny locale, ale app ma `[lang]`
- brakuje fallback route

Przyklad bledu:

```txt
GET /case/from-insight-to-action 404
```

Jezeli realny route to `/en/case/[slug]`, link musi prowadzic do `/en/case/from-insight-to-action`.

### 404 na `/en/api/draft-mode/enable`

Najczestsze przyczyny:

- Studio lub preview sklejilo route API z aktualnym locale.
- W konfiguracji ustawiono zly preview URL.
- Brakuje lokalizowanego fallback API.

Rozwiazanie:

- `previewMode.enable` ustaw na `/api/draft-mode/enable`
- dodaj `src/app/[lang]/api/draft-mode/enable/route.ts`
- dodaj analogiczny disable route

### Drafty nie sa widoczne

Najczestsze przyczyny:

- `SANITY_API_READ_TOKEN` nie ma dostepu do draftow
- fetch nadal uzywa CDN/published
- draftMode cookie nie jest ustawione lub iframe go nie wysyla
- proxy nie przekazuje preview headerow

Rozwiazanie:

- w preview uzyj `useCdn: false` dla walidacji
- w fetch uzyj `perspective: drafts`
- dodaj header fallback z proxy

## Zasady projektowe

- Kazde widoczne pole Sanity powinno miec albo stega w DOM, albo jawne `data-sanity`.
- Przy bardziej zlozonych komponentach zakladaj, ze jawne `data-sanity` jest potrzebne.
- Kazdy typ dokumentu uzywany na stronie powinien miec `locations`.
- Kazda strona uzywana w Presentation powinna miec `mainDocuments`.
- Query dla edytowalnych komponentow musi zwracac `_id`, `_type`, `_key`.
- Nie czysc widocznych tekstow przez `stegaClean`.
- Czysc slug, metadata, URL i wartosci dla zewnetrznych bibliotek.
- Zawsze testuj wszystkie locale.
- Zawsze testuj nawigacje wewnatrz iframe po wlaczeniu preview.
- Zawsze sprawdzaj console w Studio i iframe.

## Minimalny standard dla nowych implementacji

W nowym projekcie uznaj implementacje za skonczona dopiero, gdy:

- `npm run lint` przechodzi
- `npx tsc --noEmit` przechodzi
- `npm run build` przechodzi
- Presentation laczy sie bez bledu
- draft mode wlacza sie bez 404
- overlay pokazuje ramki na tekstach
- klik w tekst wybiera konkretne pole
- publish/live update dziala
- dynamiczne route nie maja 404
- wszystkie locale dzialaja
- kazdy component renderujacy Sanity content ma sprawdzone `data-sanity`

## Szybki wzorzec review przed deployem

Przejdz po plikach:

- `sanity.config.ts`
- `src/sanity/presentation/resolve.ts`
- `src/sanity/lib/client.ts`
- `src/sanity/lib/live.ts`
- `src/sanity/lib/fetch.ts`
- `src/sanity/preview.ts`
- `src/sanity/draft-mode.ts`
- `src/sanity/visual-editing.ts`
- `proxy.ts` albo `middleware.ts`
- `src/app/layout.tsx`
- `src/app/api/draft-mode/enable/route.ts`
- `src/app/api/draft-mode/disable/route.ts`
- `src/app/[lang]/api/draft-mode/enable/route.ts`
- `src/app/[lang]/api/draft-mode/disable/route.ts`
- wszystkie query w `src/sanity/lib/queries.ts`
- wszystkie komponenty renderujace dane Sanity
- wszystkie link helpery i dynamiczne routes

Pytania review:

- Czy `previewUrl.initial` jest poprawnym originem?
- Czy `allowOrigins` zawiera produkcje i preview deployments?
- Czy route API nie ma 404?
- Czy fetch w preview ma `stega: true`?
- Czy tekst renderowany do DOM nie jest `stegaClean`?
- Czy sa `data-sanity` dla animowanych, skladanych i tablicowych tekstow?
- Czy i18n path wskazuje `en.field` / `pl.field`?
- Czy tablice ida po `_key`, a nie tylko indeksie?
- Czy Presentation resolver wskazuje realne sciezki?
- Czy linki w aplikacji generuja realne sciezki?

To jest docelowy standard implementacji Sanity Visual Editing dla kolejnych stron.