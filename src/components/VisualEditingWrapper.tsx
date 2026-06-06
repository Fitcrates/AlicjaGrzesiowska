'use client'

import { VisualEditing } from 'next-sanity/visual-editing'
import { useIsPresentationTool } from 'next-sanity/hooks'

export default function VisualEditingWrapper() {
  const isPresentationTool = useIsPresentationTool()

  if (!isPresentationTool) {
    return null
  }

  return <VisualEditing />
}
