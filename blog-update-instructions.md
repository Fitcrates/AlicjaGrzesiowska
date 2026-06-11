# Instrukcje dla AI do aktualizacji posta o Sanity Visual Editing

Twoim zadaniem jest zaktualizowanie istniejącego wpisu na blogu dotyczącego wdrożenia Sanity Visual Editing w Next.js. Musisz dodać do niego nową sekcję opisującą bardzo częsty i frustrujący problem oraz autorskie rozwiązanie, które eliminuje ten błąd.

## Gdzie wstawić nową treść?
Najlepiej dodać ją jako nowe pytanie w sekcji FAQ lub jako oddzielny, wyróżniony nagłówek (np. przed podsumowaniem). Sugerowany tytuł sekcji: **"Dlaczego zewnętrzne Studio wciąż rzuca błędem 'Unable to connect to visual editing'? (Pułapka ciasteczek w Iframe)"**.

## Co dokładnie opisać?

Musisz szczegółowo omówić następujące etapy problemu i jego rozwiązanie:

### 1. Problem z ciasteczkami wewnątrz iframe
Kiedy Sanity Studio jest hostowane na innej domenie (lub subdomenie, np. `*.sanity.studio`) niż docelowa aplikacja Next.js, Presentation Tool otwiera twoją aplikację wewnątrz elementu `iframe`. Współczesne przeglądarki (szczególnie Safari z ITP, ale też coraz częściej Chrome) bezlitośnie blokują przesyłanie ciasteczek `SameSite=Lax` w takich cross-originowych ramkach. 
Oznacza to, że ciasteczko trybu `draftMode` z Next.js po prostu tam nie dociera, a funkcja `draftMode().isEnabled` po stronie serwera zwraca `false`.

### 2. Ślepa uliczka oficjalnej dokumentacji
Oficjalne poradniki Sanity zalecają warunkowe renderowanie komponentu na serwerze:
`{(await draftMode()).isEnabled && <VisualEditing />}`

Ponieważ ciasteczka są zablokowane i `isEnabled` zwraca `false`, komponent `<VisualEditing />` w ogóle nie jest renderowany w drzewie DOM wewnątrz iframe'a. Kiedy Sanity Studio próbuje nawiązać połączenie (handshake przez `postMessage`), nie ma na stronie elementu, który mógłby mu odpowiedzieć. Skutkuje to błędem: **"Unable to connect to visual editing"**.

### 3. Skutki uboczne bezwarunkowego renderowania
Prymitywnym obejściem jest usunięcie warunku i wpisanie na sztywno `<VisualEditing />` w layoucie. Rozwiązuje to problem komunikacji w Studio (handshake działa poprawnie), ale rodzi ogromny problem UX: pływający pasek narzędzi (ikony Vercel Toolbar / edycji) zaczyna pojawiać się na Twojej publicznej stronie (na localhost lub w produkcji, gdy użytkownik jest zalogowany/ma starą sesję), co jest absolutnie niepożądane.

### 4. Złoty środek – zastosowanie VisualEditingWrapper (Rozwiązanie)
Przedstaw czytelnikowi poniższy kod jako ostateczne rozwiązanie tego problemu. Dedykowany komponent kliencki **bezwarunkowo** renderuje element (zapewniając poprawne działanie handshake'u), ale korzysta z oficjalnego hooka `useIsPresentationTool()`, aby za pomocą ukrytego globalnego stylu CSS ukryć UI dla osób wizytujących stronę poza Presentation Tool.

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

Następnie wystarczy poinstruować czytelnika, że w swoim `layout.tsx` ma po prostu podpiąć `<VisualEditingWrapper />` bez żadnych warunków `draftMode`.

## Ton wypowiedzi
Zachowaj ten sam techniczny, profesjonalny i nieco "insajderski" ton, co w reszcie postu. Zwróć uwagę na to, że jest to wiedza wykraczająca poza oficjalną dokumentację, wynikająca z praktycznej walki z ograniczeniami dzisiejszych przeglądarek.
