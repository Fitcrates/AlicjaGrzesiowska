# Redesign Implementation Plan

Based on the provided mockups, the previous design was too generic. We need to implement a highly premium, editorial, and brutalist-inspired aesthetic. This involves huge typography, thin borders for structure (wireframe-like layouts), distinct uppercase meta-text, and sophisticated interactions.

## User Review Required

> [!IMPORTANT]
> The mockups show two different hero styles. Mockup 1 has ultra-condensed uppercase serif ("WE DESIGN CLARITY..."), while Mockup 2 has a mix of normal and italic serif ("We make information work harder."). I plan to use the style from **Mockup 2** as it better fits your text ("No organization has a solely content problem. *It has an information problem.*"). Please let me know if you prefer the ultra-condensed uppercase style from Mockup 1.

> [!IMPORTANT]
> To achieve this look, typography is critical. I propose changing the font stack:
> - **Main Serif**: `Cormorant Garamond` or `Playfair Display` (for the huge, elegant text and italics).
> - **Meta/Small text**: `Space Mono` or `Inter` (uppercase, wide letter-spacing for the top nav and small labels).

## Proposed Changes

### Global Styling (`app/globals.css` & `app/layout.tsx`)
- Update font variables to include the new serif and monospace/sans-serif combination.
- Introduce new colors from the mockups: Terracotta/Rust (`#c25934`) for accents, and Olive Green (`#8f9779`) for buttons.
- Add global utility classes for the thin 1px borders (`border-black/10`) used extensively in the mockups to separate sections and columns.

### Components Overhaul

#### 1. [MODIFY] `components/sections/Hero.tsx`
- Implement the top minimal navigation (Studio Almost style).
- Replace the current hero with massive typography.
- Layout: Top nav, huge central text, and a bottom border separating the small description ("I help organizations remember...") and a "SCROLL TO EXPLORE ↓" indicator.

#### 2. [MODIFY] `components/sections/ChallengeSelection.tsx` (Section 01)
- Recreate the vertical 4-column layout from **Mockup 4**.
- Features: Rotated `01`, `02`, `03`, `04` numerals.
- Thin borders separating each column.
- Interaction: Clicking a column still triggers the full-screen expansion, but the base layout will be strictly structural.

#### 3. [MODIFY] `components/sections/ScatteredKnowledge.tsx` (Section 02)
- Recreate the "Knowledge Graph" from **Mockup 2**.
- Clean up the SVG layout to look more like the geometric pentagon/star diagram shown in the mockup.
- Update the Modal to match **Mockup 5**:
  - Terracotta italic text on the left: "Clarity is not the absence of information, but its arrangement."
  - "THE PROBLEM" and "APPLY" button in olive green.
  - Clean white background with a thin dark overlay.

#### 4. [MODIFY] `components/sections/InvestigationCards.tsx` (Section 03)
- Recreate the "Perspectives" section from **Mockup 3**.
- 4 white cards with thin borders.
- Top of each card has `01` and `TITLE` aligned left/right.
- The 3D flip animation will act like opening a book cover (as seen in Mockup 3 with the "How is everything actually connected?" card).

#### 5. [MODIFY] `components/sections/PortfolioGrid.tsx` (Section 04)
- Abandon the image grid.
- Implement the "Case Studies" list from **Mockup 2**.
- Huge serif titles ("Reframing Complexity") on the left.
- Tabular metadata (INDUSTRY, YEAR, FOCUS, VIEW CASE ->) on the right.
- Separated by thin horizontal borders.

#### 6. [MODIFY] `components/sections/ContactFooter.tsx` (Section 05)
- Simplify to match the bottom of Mockup 2: "Let's work together." in huge serif, with small contact details next to it.

## Verification Plan
- Visually compare each coded section against the 5 provided mockups to ensure the editorial wireframe aesthetic is achieved perfectly.
- Ensure all Framer Motion animations (book flipping, modal opening, graph drawing) feel sophisticated and not overly bouncy.
