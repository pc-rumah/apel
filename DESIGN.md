---
name: Nurture & Bloom
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#474553'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#787584'
  outline-variant: '#c8c4d5'
  surface-tint: '#594cc3'
  primary: '#564ac0'
  on-primary: '#ffffff'
  primary-container: '#6f64db'
  on-primary-container: '#fffbff'
  inverse-primary: '#c6c0ff'
  secondary: '#1b6b4f'
  on-secondary: '#ffffff'
  secondary-container: '#a6f2cf'
  on-secondary-container: '#247155'
  tertiary: '#665f3d'
  on-tertiary: '#ffffff'
  tertiary-container: '#b4ab83'
  on-tertiary-container: '#453f20'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4dfff'
  primary-fixed-dim: '#c6c0ff'
  on-primary-fixed: '#150066'
  on-primary-fixed-variant: '#4031aa'
  secondary-fixed: '#a6f2cf'
  secondary-fixed-dim: '#8bd6b4'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#ede3b8'
  tertiary-fixed-dim: '#d1c79d'
  on-tertiary-fixed: '#201c02'
  on-tertiary-fixed-variant: '#4d4727'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The brand personality is empathetic, calm, and supportive, designed to act as a gentle companion for parents navigating the complexities of child-rearing. The aesthetic balances the playfulness of childhood with the clarity and reliability required for educational content.

We utilize a **Modern Soft UI** style characterized by:
- **Gentle Geometry:** Avoiding sharp corners to evoke safety and approachability.
- **Low-Density Information:** Generous whitespace to prevent cognitive overload for busy parents.
- **Subtle Depth:** Using soft shadows and tonal shifts rather than harsh borders to define hierarchy.
- **Illustrative Warmth:** Integrating organic shapes and soft-focus backgrounds to create a welcoming digital environment.

## Colors

The palette is rooted in soft pastels that provide a soothing psychological effect. 

- **Primary (Lavender):** Used for key actions, brand identity, and focus states. It represents wisdom and calm.
- **Secondary (Mint):** Used for success states, growth-related content, and "positive activity" highlights.
- **Tertiary (Soft Yellow):** Reserved for call-outs, "things to remember," and light-hearted highlights to add warmth.
- **Neutrals:** We use a warm slate for typography to maintain readability without the harshness of pure black. Backgrounds should utilize very light tints of lavender (#F8F7FF) to maintain the "Soft UI" atmosphere.

## Typography

This design system uses a two-font pairing to distinguish between emotional storytelling and functional guidance.

- **Headlines:** *Plus Jakarta Sans* provides a friendly, rounded geometric appearance that feels contemporary and approachable.
- **Body & UI:** *Manrope* is used for its exceptional legibility and professional, balanced structure. It ensures that long-form parenting advice remains easy to digest.

**Usage Rules:**
- Use **headline-xl** for page titles and hero sections.
- Use **label-md** with the specified letter spacing for small overlines or category tags.
- Ensure **body-lg** is used for the primary narrative text to reduce eye strain.

## Layout & Spacing

The layout philosophy follows a **fluid grid** model with significant emphasis on "breathing room."

- **Desktop:** 12-column grid with a max-width of 1280px. Content is centered with 64px outer margins.
- **Tablet:** 8-column grid with 32px margins.
- **Mobile:** 4-column grid with 16px margins.

**Spacing Rhythm:**
We utilize an 8pt grid system. Components should prioritize `lg` (48px) spacing between major sections to maintain a sense of calm. Content within cards should use `md` (24px) padding to ensure the "Soft UI" feel isn't compromised by cramped text.

## Elevation & Depth

We avoid high-contrast shadows to maintain the friendly, approachable aesthetic. Depth is communicated through:

1.  **Tonal Tiers:** Surfaces are defined by subtle color shifts (e.g., a white card on a #F8F7FF background).
2.  **Soft Ambient Shadows:** For interactive elements like cards and buttons, use a "Cloud Shadow"—very large blur radii (20px-40px) with extremely low opacity (4-8%) using a tint of the primary color rather than pure black.
3.  **Containment:** Using soft-colored borders (1px, 10% opacity of the primary color) instead of shadows for secondary containers.

## Shapes

The shape language is consistently "Rounded" to reflect the safety and softness associated with childcare.

- **Standard Components:** Buttons and inputs use a 0.5rem (8px) radius.
- **Containers & Cards:** Content blocks and feature sections use `rounded-xl` (1.5rem / 24px) to create a friendly, enclosed feel.
- **Iconography:** Use rounded-end caps (round join/cap) for all stroke-based icons to match the typography.

## Components

### Buttons
- **Primary:** Solid Lavender (#8B80F9) with white text. High-padding (12px 24px) and rounded-md.
- **Secondary:** Ghost style with Lavender text and a soft Lavender-tinted background (5% opacity).
- **Tertiary/Ghost:** No background, underline on hover, used for less critical actions.

### Cards
- Cards must use a white background with a `rounded-xl` radius. 
- Apply the "Cloud Shadow" (see Elevation) to make cards feel like they are floating gently on the page.
- Header cards for specific topics (e.g., "Speech Delay") can use a 4px left-accent border in a pastel color to categorize content.

### Inputs & Selects
- Backgrounds should be a very light neutral or white.
- Borders should be 1.5px thick in a light slate, turning Lavender on focus.
- Help text should always use `body-sm`.

### Chips & Tags
- Used for categories (e.g., "Age 0-18 months").
- Use pill-shaped geometry with a light pastel fill and a darker version of the same hue for the text.

### Progress Indicators
- For guides or checklists, use thick, rounded progress bars in Mint (#A7F3D0) to provide a satisfying sense of accomplishment.