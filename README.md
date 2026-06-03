<a id="readme-top"></a>

# Viewport: Responsive Web Preview Tool

A modern web application built with Astro and React for providing an interactive iframe-based preview of URLs, designed for responsive development and testing.

## About The Project

Viewport is a responsive web preview tool that allows developers to quickly view and interact with web pages within an iframe. It supports URL input, search functionality, device presets (mobile, tablet, desktop, TV), zoom, rotation, and maintains a history of recent URLs.

### Built With

* [![Astro][Astro.dev]][Astro-url]
* [![React][React.js]][React-url]
* [![Tailwind CSS][TailwindCSS.com]][TailwindCSS-url]
* [![Phosphor Icons][PhosphorIcons.com]][PhosphorIcons-url]
* [![PNPM][PNPM.io]][PNPM-url]

## Getting Started

### Prerequisites

Ensure you have pnpm installed globally.

```sh
npm install -g pnpm
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/viewport.git
   ```
2. Install PNPM packages
   ```sh
   pnpm install
   ```

## Usage

Start the development server and navigate to `localhost:1234` (or `localhost:1234/app`):

```sh
pnpm dev
```

Enter any URL into the search bar to preview it within the responsive iframe.

### Local Development URLs

Viewport includes a built-in server-side proxy (`/api/proxy`) that enables previewing local/private URLs (e.g., `localhost`, `127.0.0.1`, `192.168.x.x`) that would otherwise be blocked by browser `X-Frame-Options` or CSP headers. Simply type the URL (e.g., `localhost:4321`) and the proxy will fetch and inject it into the iframe.

## CLI Commands

| Command | Description |
|---|---|
| `pnpm dev` | Starts the local development server at `localhost:1234` |
| `pnpm build` | Builds the production-ready server (SSR via `@astrojs/node`) |
| `pnpm preview` | Previews the built server locally |
| `pnpm astro check` | Runs the Astro CLI type-checker (use `tsc --noEmit` for faster checks) |
| `pnpm tsc --noEmit` | Fast TypeScript check (recommended) |

> **Note:** This project runs in **SSR mode** (`output: 'server'`). The proxy endpoint requires the server to be running.

## Features

- **Iframe Preview** — Displays any URL inside a sandboxed iframe
- **Local URL Proxy** — Server-side proxy strips `X-Frame-Options` / `CSP` blocking headers from private URLs, enabling localhost preview
- **Device Presets** — Mobile, tablet, desktop, and TV viewports with realistic bezels
- **Custom Dimensions** — Resize the viewport freely with drag handles
- **Zoom & Rotate** — Scale and flip between portrait/landscape
- **URL History** — Recent URLs persisted in local storage
- **Search Modal** — Quick URL entry and history browsing

## Project Structure

```
/
├── public/                      # Static assets (images, favicons, etc.)
├── src/
│   ├── assets/                  # General assets (e.g., global images)
│   ├── components/              # React components
│   │   ├── landing/             # Landing page components (Hero, Features, etc.)
│   │   ├── layout/              # Layout components (Navbar, Sidebar)
│   │   ├── ui/                  # UI components (PreviewFrame, SearchModal, Controls, UrlInput)
│   │   └── AppShell.tsx         # Main application orchestrator
│   ├── content/
│   │   └── devices.ts           # Device preset definitions
│   ├── hooks/
│   │   └── useLocalStorage.ts   # Local storage React hook
│   ├── layouts/                 # Astro layouts for pages
│   ├── pages/                   # Astro pages (routes)
│   │   ├── api/
│   │   │   └── proxy.ts         # Server-side proxy for local URLs
│   │   ├── app.astro            # Main app page (AppShell entrypoint)
│   │   └── index.astro          # Marketing/landing page
│   └── styles/
│       └── globals.css          # Global CSS with Tailwind v4 directives
├── astro.config.mjs             # Astro configuration (SSR, Node adapter, Tailwind)
└── package.json                 # Project dependencies and scripts
```

## How It Works

1. **URL Input** — The user types a URL (e.g., `localhost:4321`)
2. **Normalization** — The client normalizes the URL (`localhost:4321` → `http://localhost:4321`)
3. **Local Detection** — If the hostname is a private/local address, the iframe src is routed through `/api/proxy?url=...`
4. **Proxy Fetch** — The server fetches the target URL, strips blocking response headers (`X-Frame-Options`, `CSP`), injects a `<base href>` for proper relative resource resolution, and returns the modified HTML
5. **Rendering** — The browser renders the proxied content inside the sandboxed iframe

## Roadmap

- [ ] **UI Polish** — Refine layout, animations, responsive behavior, and dark mode consistency. Clean up unused components (e.g., `UrlInput.tsx`).
- [ ] **Multi-view Revision** — Reduce from 3 to 2 views, add responsive layout, fix sidebar sync, persist state, and resolve UX dead-end when tools are hidden.
- [ ] **Multi-language Support** — Add i18n via `react-intl` or similar.
- [ ] **Logo & Branding** — Custom logo, favicon, and meta tags.
- [ ] **Keyboard Shortcuts** — Quick navigation (e.g., `Cmd+K` for search, `Cmd+1-4` for device presets).

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[Astro.dev]: https://img.shields.io/badge/Astro-B35F97?style=for-the-badge&logo=astro&logoColor=white
[Astro-url]: https://astro.build/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
[TailwindCSS.com]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[PhosphorIcons.com]: https://img.shields.io/badge/Phosphor_Icons-20232A?style=for-the-badge&logo=phosphor-icons&logoColor=white
[PhosphorIcons-url]: https://phosphoricons.com/
[PNPM.io]: https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white
[PNPM-url]: https://pnpm.io/
