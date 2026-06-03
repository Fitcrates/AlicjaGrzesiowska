import { defineField } from 'sanity'

export const languageGroups = [
  { name: 'pl', title: 'Polski' },
  { name: 'en', title: 'English' },
]

export function localizedObject(name: 'pl' | 'en', title: string, fields: ReturnType<typeof defineField>[]) {
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
