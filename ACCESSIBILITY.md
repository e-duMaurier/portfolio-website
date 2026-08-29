# Accessibility in duma-theme

This document describes the accessibility aims of the **duma-theme** Hugo theme
and the principles behind them. It is a statement of intent, not a manual for
tooling: the checks described here are enforced by the theme's own styles and
markup.

## Aim

Our target is **WCAG 2.2 Level AA** conformance across the site, in both the
light and dark themes. Any user-facing copy follows British English
conventions (locale `en-GB`).

## Principles

### 1. Colour and contrast

- Text and syntax-highlighted code must meet a contrast ratio of **at least
  4.5:1** against their background.
- Syntax token colours are derived from the site's own palette. Any token that
  would fall below the AA threshold is adjusted **in lightness only** (hue and
  saturation preserved), so colours stay recognisably part of the theme while
  remaining legible.
- Colour alone is never the only signal for meaning (e.g. diff additions and
  deletions combine colour with weight).
- Both light and dark themes are checked to the same standard.

### 2. Keyboard operability

- Every interactive element — navigation, dropdowns, theme toggle, post tags,
  code "copy" buttons — is reachable and operable from the keyboard.
- Visible focus indicators are applied consistently, so the current focus
  position is always clear.

### 3. Semantics and assistive technology

- The page structure uses semantic HTML: landmarks (`header`, `main`, `footer`,
  `nav`) and a single `h1` per page, with headings ordered logically.
- A visible "Skip to main content" link is provided at the top of every page so
  keyboard users can bypass navigation.
- Icon-only controls carry accessible names and states: `aria-label` for buttons
  without visible text, and `aria-pressed`/`aria-expanded` where a state is
  shown visually.
- Decorative icons are hidden from assistive technology with `aria-hidden`.
- The `lang` attribute is set from the configured site locale so screen readers
  announce content with the correct language and pronunciation.

### 4. Dark and light mode parity

- The theme respects the operating system preference (`prefers-color-scheme`)
  and offers a manual toggle, remembered without cookies.
- Both modes meet the same contrast and keyboard requirements — the dark theme
  is not a stripped-back version.

### 5. Progressive enhancement

- Content is fully readable and navigable without JavaScript; scripts enhance
  behaviour (theme switching, copy buttons) rather than gate access to it.
- Interactive features degrade gracefully — e.g. the code copy button falls back
  to a plain copy when Clipboard API access is unavailable.

## What we check

- **Text contrast** — all normal text at or above 4.5:1 (WCAG 2.2 SC 1.4.3).
- **Keyboard access** — all features operable via keyboard, no keyboard traps,
  visible focus (WCAG 2.2 SC 2.1.1, 2.1.2).
- **Focus visibility** — clear focus indicators (WCAG 2.2 SC 2.4.11).
- **Page and heading structure** — one `h1`, logical heading order, landmark
  regions (WCAG 2.2 SC 1.3.1).
- **Skip links** — a route to bypass repeated blocks for keyboard and screen
  readers.
- **Names and states** — controls are announced correctly to assistive
  technology (WAI-ARIA and WCAG 2.2 SC 4.1.2).
- **Opacity in dark mode** — the dark theme's palette (including syntax
  colours) is held to the same contrast standard.
- **Language** — the `lang` attribute reflects the content language
  (WCAG 2.2 SC 3.1.1).

## Sources and standards

These principles are drawn from the following policies and best-practice
documents:

- **Web Content Accessibility Guidelines (WCAG) 2.2** — W3C Recommendation
  https://www.w3.org/TR/WCAG22/
- **Understanding WCAG 2.2** (per-success-criterion guidance, e.g. contrast
  at SC 1.4.3) — https://www.w3.org/WAI/WCAG22/Understanding/
- **WAI-ARIA 1.2** — W3C Recommendation
  https://www.w3.org/TR/wai-aria-1.2/
- **WAI-ARIA Authoring Practices (APG)** — guidance for building accessible
  interactive components — https://www.w3.org/WAI/ARIA/apg/
- **WCAG 2.1 Techniques** — reusable techniques for common patterns
  https://www.w3.org/WAI/WCAG21/Techniques/
- **How People with Disabilities Use the Web** — W3C guidance on user needs
  https://www.w3.org/WAI/people-use-web/

For UK public-sector obligations this site would additionally look to the
**GOV.UK Accessibility Requirements**:
https://www.gov.uk/guidance/accessibility-requirements-for-accessible-websites