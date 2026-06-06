'use client'

import { VisualEditing } from 'next-sanity/visual-editing'
import { useIsPresentationTool } from 'next-sanity/hooks'
import { useEffect } from 'react'

export default function VisualEditingWrapper() {
  const isPresentationTool = useIsPresentationTool()

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
