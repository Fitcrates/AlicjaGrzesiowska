import { getLocale } from '@/lib/i18n'
import { enableDraftMode } from '@/sanity/draft-mode'

export async function GET(request: Request) {
  const lang = getLocale(new URL(request.url).pathname.split('/')[1])

  return enableDraftMode(request, `/${lang}`)
}
