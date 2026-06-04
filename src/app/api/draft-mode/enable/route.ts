import { enableDraftMode } from '@/sanity/draft-mode'

export async function GET(request: Request) {
  return enableDraftMode(request)
}
