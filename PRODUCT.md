# Product

## Register

product

## Users

Broad web developer audience — anyone building for the web. From solo full-stack devs running local servers to frontend engineers fine-tuning responsive layouts. The user is already at a keyboard, already in a browser, already debugging or previewing their own work. ViewPort meets them there: a utility, not a destination.

## Product Purpose

ViewPort is an open-source web toolkit for developers. It ships one tool today — Responsive Preview (iframe-based testing with device presets, zoom, rotate, custom dimensions, and a local URL proxy) — and will grow into a suite of browser-adjacent utilities (CSS inspector, color picker, performance monitor, DOM inspector, console, network waterfall, accessibility audit, Lighthouse integration).

Success looks like: a developer opens ViewPort, uses it to diagnose or verify something in their own work, closes it, and gets back to building. Fast in, fast out. The tool is a bridge between the developer's local environment and the many viewports their work needs to survive.

## Brand Personality

Precise · Minimal · Capable

Voice: direct, no filler. Instructive without being bossy. Expert confidence — the tool knows its job and doesn't need to explain itself at length. Tone is neutral-to-warm, never chirpy, never cold. The vocabulary of a good CLI: terse but not cryptic, helpful but not hand-holdy.

Emotional goal: the calm of a well-organized toolbox. Everything in its place, everything works as expected, nothing demands attention unless it has something to say.

## Anti-references

- **DevTool overload.** Chrome DevTools and browser inspector UIs are the anti-model: information-firehose layouts, dense tab bars, nested scroll containers, visual noise competing for attention. ViewPort should never feel like you need to hunt through a panel to find what you need.
- **SaaS blandness.** The generic startup template — heavy rounded cards, pastel gradients, hero-metric banners, icon-in-a-circle card grids — is the baseline to reject. ViewPort is a tool, not a marketing brochure.

## Design Principles

1. **Precision over ornament.** Every pixel serves the user's workflow. Borders are 1px when they orient, 0px when they don't. Spacing is tight enough that related things read as a group, generous enough that nothing feels cramped. Decoration earns its place by making the tool clearer, not "prettier."

2. **Tool, not theater.** The interface stays out of the way. No splash screens, no onboarding carousels, no empty-state illustrations. Capability is the aesthetic — controls are visible, state is readable, feedback is immediate.

3. **One surface, many contexts.** Dark and light modes are equally crafted, not one as an afterthought of the other. Each surface temperature (the warm-neutral light, the near-black dark) is deliberate and tied to the brand, not a default. The tool works at noon on a patio and at 2am in a dark room.

4. **Approachable power.** Responsive preview, URL proxying, device presets — these are complex concerns. Surface them with clarity, not clutter. A first-time user should feel oriented in seconds; a daily user should never fight a redundant click. Progressive disclosure where it helps, flat access where speed matters.

5. **Practice what you preview.** The tool is about testing responsiveness. Its own UI must prove the concept: fluid layout, no horizontal scroll, thoughtful breakpoints. If ViewPort breaks on a tablet, the user stops trusting it with their own work.

## Accessibility & Inclusion

- WCAG 2.1 AA compliance target
- All animations respect `prefers-reduced-motion: reduce` with instant or crossfade fallbacks
- Semantic HTML structure, keyboard-navigable controls, visible focus indicators
- Color not used as the sole differentiator for tool states
- Contrast floor of 4.5:1 for body text in both themes
