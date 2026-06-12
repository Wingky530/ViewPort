---
name: ViewPort
description: An open-source web toolkit for developers
colors:
  primary: "#EB1D62"
  neutral-bg: "#252422"
  neutral-surface: "#252422"
  neutral-text: "#EBEBDF"
  neutral-text-muted: "#A3A39D"
  neutral-text-dim: "#7B7A75"
  neutral-border: "#3A3937"
  danger: "#EF4444"
  success: "#22C55E"
  warning: "#F59E0B"
typography:
  display:
    fontFamily: "Viewport, Inter, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "Viewport, Inter, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Viewport, Inter, system-ui, sans-serif"
    fontWeight: 500
    fontSize: "0.75rem"
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  button-primary-hover:
    backgroundColor: "#EF437A"
    textColor: "#ffffff"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.md}"
    padding: "8px"
  button-ghost-hover:
    backgroundColor: "rgba(235,235,223,0.05)"
    textColor: "{colors.neutral-text}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.md}"
    padding: "8px"
  chip-default:
    backgroundColor: "#F5F5EC"
    textColor: "#7B7A75"
    rounded: "{rounded.sm}"
    padding: "2px 10px"
  chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "2px 10px"
  toggle-switch:
    width: "36px"
    height: "20px"
    rounded: "9999px"
---

# Design System: ViewPort

## 1. Overview

**Creative North Star: "The Instrument Panel"**

ViewPort's visual system is the instrument panel of a modern cockpit — precise, legible, and trustworthy at a glance whether the sun is high or the cabin is dark. Every control occupies a deliberate position; nothing is ornamental, nothing is hidden behind a discovery layer without purpose. The interface is a tool for reading and acting, not a canvas for decoration.

The panel is not cold. The warm tint in the neutrals (the khaki-charcoal of the dark theme, the parchment-cream of the light theme) keeps the instrument feel approachable. The accent — a vivid Marker Red — works like a critical gauge: rare enough to mean something, confident enough to guide the eye.

This system explicitly rejects the DevTool information-firehose (dense tab bars, nested scroll, competing visual noise) and the SaaS startup template (heavy rounded cards, pastel gradients, icon-in-a-circle repetition). The instrument panel has no room for either.

**Key Characteristics:**
- Purposeful density: information is tight but not crowded; every pixel earns its place
- Warm neutrals with a single, saturated accent
- Flat surfaces with structural shadows for depth where it matters (modals, controls bar, preview frames)
- Minimal corner radii on chrome (8px), generous only on device bezels where realism demands it
- Two equally-crafted themes — dark is not a night mode, light is not a default

## 2. Colors

The palette lives on two axes: the warm-dark Ridge-to-Parchment neutral scale, and the single saturated Marker Red accent. Marker Red appears on ≤10% of any given surface — its rarity is its power.

**The Instrument Panel Rule.** Every color is chosen for legibility first. Body text against background must clear 4.5:1 contrast in both themes. If you can't read it at a glance, the color is wrong.

### Primary
- **Marker Red** (`#EB1D62`): The single accent. Marks interactive elements, active states, the brand mark, and critical calls to action. Never diluted with additional accent colors. In both themes, the hex is identical — it is the one constant across dark and light.

### Neutral (Dark Theme)
- **Ridge** (`#252422`): Background and surface. A warm near-black with subtle brown undertone. The entire instrument panel rests on this.
- **Parchment** (`#EBEBDF`): Primary text. Warm off-white with a faint khaki cast. The reading surface.
- **Graphite** (`#A3A39D`): Muted text for secondary information, metadata, and labels that should be present but not commanding.
- **Flint** (`#7B7A75`): Dim text for placeholders, disabled states, and the quietest information layer.
- **Shale** (`#3A3937`): Borders and dividers. Present but not aggressive.
- **Coal** (`#1C1B1A`): Preview background — the iframe well. One step darker than Ridge to frame the preview content.
- **Obsidian** (`#161514`): Frame bezel for device previews. The outermost layer.
- **Surface Hover** (`rgba(235,235,223,0.05)`): Subtle tint for hovered interactive rows.
- **Accent Hover** (`#353432`): Used for primary button hover in dark theme.
- **Accent Light** (`#454442`): Used for lighter accent-adjacent surfaces.

### Neutral (Light Theme)
- **Parchment** (`#EBEBDF`): Background. Warm off-white — the same value as dark theme's text, inverted.
- **Limestone** (`#F5F5EC`): Surface. A step lighter than Parchment for card-like containers and panels.
- **Surface Hover** (`#EEEEE3`): Subtle darkening for hovered states.
- **Ridge** (`#252422`): Primary text — the same value as dark theme's background, inverted.
- **Stone** (`#666666`): Muted text.
- **Pebble** (`#5A5957`): Dim text.
- **Sandstone** (`#D6D6C8`): Borders. Warm mid-tone divider.
- **Frame Bezel** (`#D6D6C8`): Device preview bezel in light mode.
- **Frame Notch** (`#B8B8AA`): Notch and home indicator element in light mode.
- **Accent Hover** (`#EF437A`): Brighter Marker Red for hover state on light backgrounds.
- **Accent Light** (`#F47098`): Tinted accent for highlights and backgrounds.

### Semantic
- **Danger** — `#EF4444` (dark) / `#DC2626` (light)
- **Success** — `#22C55E` (dark) / `#16A34A` (light)
- **Warning** — `#F59E0B` (dark) / `#D97706` (light)

## 3. Typography

**Display & Body Font:** Viewport (custom variable font, 300–900 weight range), with Inter, system-ui, -apple-system, sans-serif fallback.

**Character:** A single custom sans-serif family carries the entire system. Display and body are the same family differentiated by weight and size — no font swap, no stylistic collision. The variable axis (300–900) provides the full hierarchy from a single font file. The warm humanist quality of Viewport matches the warm-tinted neutrals.

### Hierarchy
- **Display** (Bold 700, `clamp(1.25rem, 3vw, 1.75rem)`, line-height 1.1): The ViewPort brand mark in the navbar. `text-wrap: balance`.
- **Title** (Medium 500, `0.875rem` / 14px, line-height 1.3): Section headers, sidebar category names. `text-wrap: balance`.
- **Body** (Regular 400, `0.875rem` / 14px, line-height 1.5): Primary text, device names, result items. Appears at ~14px with occasional 16px variants. Max line length 70ch.
- **Label** (Medium 500, `0.75rem` / 12px, `0.1em` tracking, uppercase): Category headers in sidebar, filter badges, field labels. The `uppercase tracking-widest` pattern is reserved for these navigational cues and appears at most twice on any given screen.
- **Mono** (Regular 400, `0.625rem`–`0.75rem`): Device dimensions (`360×800`), zoom percentage, URLs in the frame chrome. System font-mono or the body font at small size with monospaced numerals.

**The Single Family Rule.** One typeface, differentiated by weight alone. No serif companion, no display variant. The variable font covers the full hierarchy from light labels to bold brand marks.

## 4. Elevation

Depth is conveyed through a hybrid approach: the chrome (sidebar, navbar, main chrome) is flat at rest; surfaces layer via tonal shift (bg → surface → surface-hover). Shadows appear only for structural separation — elements that sit above the chrome layer and need to feel like a distinct panel, not a painted-on surface.

**The Flat-by-Default Rule.** At rest, no surface has a shadow. Shadows appear to elevate a layer above the instrument panel: modals, the controls toolbar, device preview frames, and toasts.

### Shadow Vocabulary
- **Modal** (`shadow-2xl`): Search modal and other full overlay panels that sit above a backdrop.
- **Controls** (`shadow-xl`): The bottom controls bar — it floats above the preview area as a distinct control surface.
- **Preview** (`shadow-[0_12px_40px_rgba(0,0,0,0.35)]`): Device preview frames for desktop and custom modes.
- **Mobile Preview** (`shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_32px_80px_rgba(0,0,0,0.8)]`): Phone and tablet bezels cast a deeper, multi-layered shadow.
- **Toast** (`shadow-lg`): Notification popups that appear above all other content.

Backdrops use semi-transparent black at `rgba(0,0,0,0.5)` (sidebar overlay) or `rgba(0,0,0,0.4)` with `backdrop-blur` (search modal) to maintain context while focusing attention.

## 5. Components

The component system is denser than a marketing site but looser than a design tool. Controls are "tactile and confident" — hit areas are generous, states are unambiguous, and the accent color marks what is interactive. Every clickable element has a clear hover state, active state (scale + color shift), and focus ring.

### Buttons
- **Shape:** Gently rounded corners (8px / `rounded-md`).
- **Primary (`<button class="... bg-accent ...">`):** Marker Red background, white text, 8px horizontal padding, 8px vertical padding. Hover shifts to a brighter tone (`#EF437A` in light, `#353432` in dark). Active state uses a scale transform (`active:scale-[0.98]`). Focus ring is Marker Red at 2px.
- **Ghost (`<button class="... text-text-muted ... hover:bg-surface-hover ...">`):** Transparent background, muted text, hover reveals a subtle surface tint. Used for icon-only toolbar buttons, sidebar toggles, and dismiss actions.
- **Outline (`<button class="... border ...">`):** 1px border, muted text, hover fills with accent-adjacent background. Used for secondary actions like "Open in new tab" in error states.
- **Danger (`<button class="... bg-danger ...">`):** Red background, white text. Used for the Donate CTA and destructive actions.

### Navigation
- **Navbar (Top Bar):** Sticky top bar with `bg-surface`, `border-b border-border`. Left section holds the hamburger menu (mobile), the ViewPort brand mark in Marker Red, and nav links. Right section holds the search and tools toggle as icon buttons. Active toggles get `text-accent bg-accent/20`. Height: ~52px (`py-3`).
- **Sidebar (Left Panel):** 260px (desktop) / 280px (mobile overlay). Scrolling device list with expandable categories (animated `max-height` transition). Selected device gets `bg-accent/15 text-accent border-l-2 border-accent`. Category headers are `text-xs uppercase tracking-widest` in muted text. A fixed bottom section hosts the dark/light toggle, zoom slider, scrolling toggle, multi-view toggle, and donate button.

### Preview Frames
- **Chrome:** Category-specific bezels simulate real hardware. Phone: `rounded-[2.5rem]` with notch and home indicator. Tablet: `rounded-[1.5rem]` with thin notch. Desktop: traffic-light buttons + stand. TV: border-only with TV feet.
- **Scaling:** Preview frames auto-scale to fit the container with a `cubic-bezier(0.16,1,0.3,1)` transition on size changes. Custom mode offers drag handles (small pill-shaped controls at each edge) for freeform resizing.
- **States:** Loading shows a centered spinner (`animate-spin`). Error shows a warning icon + message + "Open in new tab" fallback. Empty shows a globe icon + prompt.
- **Device badge:** A floating chip above the frame showing device name, dimensions, and a rotate button.

### Search Modal
- **Pattern:** Full-screen overlay with AnimatePresence (Framer Motion). Backdrop and panel enter from random directions for variety.
- **Input:** Full-width search input with magnifying glass icon, clear button, and a "Go" action button.
- **Filter:** Row of small pill-chips (all, url, phone, desktop, tablet, tv) that filter the results list. Active chip uses Marker Red background. Each chip is `text-[10px] font-medium`.
- **Results:** Combines URL history and device presets in one flat list. Each item shows a favicon/device icon, label, and a colored category badge. Hover triggers `bg-surface-hover` and `scale-[0.98]`.
- **Custom resolution:** Typing `WxH` triggers a custom resolution action button at the bottom.
- **Footer:** Keyboard shortcut hints in muted text.

### Controls Toolbar
- **Shape:** Centered pill bar (`rounded-2xl`) with `backdrop-blur` and `shadow-xl`. Floats at the bottom of the preview area.
- **Groups:** Zoom (-/+, percentage display) → Divider → Rotate, Scroll toggle, Screenshot, Multi-view → Divider → Share/Copy Link button.
- **Toggles:** Active state uses `bg-accent/20 text-accent`.
- **Share button:** Marker Red background, white text, inline icon + label. Shows a checkmark + "Copied!" on success.

### Toggle Switches
- **Style:** 36px × 20px pill track. Gray when off, Marker Red when on. White circular thumb with `translate-x-full` transition. Follows the `peer/checked` pattern with `sr-only` input.

### Inputs & Fields
- **Search Input:** Transparent background, 14px text, muted placeholder. No visible border — the SearchModal panel frame provides containment. Focus: `outline-none`.
- **Zoom Slider:** Custom range input, 4px track height, styled via inline classes. Accent focus ring on interaction.

### Toasts
- **Position:** Fixed bottom center, `left-1/2 -translate-x-1/2`.
- **Style:** `bg-gray-800 text-white` with 8px radius and `shadow-lg` in light theme. Appears with a `toast-in` animation (slide down + fade) and auto-dismisses after 3s.

## 6. Do's and Don'ts

### Do:
- **Do** use Marker Red as the sole accent. It marks active states, interactive controls, and the brand mark. Its rarity (≤10% per screen) is the point.
- **Do** use warm neutrals (Ridge, Parchment, Shale, Graphite) as the palette backbone. The warm tint distinguishes ViewPort from generic gray-scale tool UIs.
- **Do** design every component for both dark and light themes from the start — not as a mode switch, but as equal citizens.
- **Do** leave surfaces flat at rest. Use shadows only for structural separation: modals, controls bar, device frames.
- **Do** use generous hit areas on icon buttons (8px+ padding) with clear hover feedback (surface tint) and active feedback (scale press).
- **Do** use `cubic-bezier(0.16,1,0.3,1)` for size/move transitions and `cubic-bezier(0.22,1,0.36,1)` for entrances. This has an "overshoot-free, confident arrival" feel consistent with the instrument panel.
- **Do** test all body text at ≥4.5:1 contrast ratio in both themes.
- **Do** respect `prefers-reduced-motion: reduce` — all animations collapse to instant or crossfade.

### Don't:
- **Don't** add a second accent color. Marker Red is the system's only accent. If you need a second indicator, use weight, size, or a semantic color (danger/success/warning) — not a new hue.
- **Don't** create the DevTool information-firehose: dense tab bars, nested scroll containers, competing visual panels, status indicators everywhere. ViewPort is lean by design.
- **Don't** use the SaaS startup template: heavy rounded cards, pastel gradients, hero-metric banners, icon-in-a-circle card grids. ViewPort is a tool, not a marketing brochure.
- **Don't** use side-stripe borders (border-left/border-right >1px as a colored accent). Use full borders, background tints, or nothing.
- **Don't** use gradient text (`background-clip: text` + gradient). Emphasis comes from weight or size.
- **Don't** use glassmorphism as a default effect. Blurs and glass cards are rare and purposeful.
- **Don't** use the hero-metric pattern (big number + small label + stats) — this is a tool, not a landing page.

### Component-specific Don'ts:
- **Don't** ignore the upper-case `tracking-widest` label limit. These appear on category headers only — at most two visible at once.
- **Don't** use `rounded-xl` or larger on any tool chrome element. 8px (`rounded-md`) is the maximum for interactive elements. The large radii belong to device bezels only.
- **Don't** use all-caps on body text. Reserve uppercase for short labels (≤4 words) and filter badges.
