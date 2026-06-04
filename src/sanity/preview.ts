import { draftMode } from 'next/headers'

export async function isSanityPreviewRequest() {
  const { isEnabled } = await draftMode()
  return isEnabled
}
