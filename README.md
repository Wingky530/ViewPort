<a id="readme-top"></a>

# ViewPort

![ViewPort Logo](public/img/logo.png)

**An open-source and free web toolkit.**

A modern web application built with Astro and React, designed as a growing suite of tools for web developers.

## About The Project

ViewPort is an open-source web toolkit that bundles multiple developer utilities into one place. The first available tool is **Responsive Preview**, an interactive iframe-based preview for testing any URL across device sizes, with support for device presets (mobile, tablet, desktop, TV), zoom, rotation, custom dimensions, and a built-in proxy for local URLs. More tools are coming.

### Built With

* [![Astro][Astro.dev]][Astro-url]
* [![React][React.js]][React-url]
* [![Tailwind CSS][TailwindCSS.com]][TailwindCSS-url]
* [![Framer Motion][FramerMotion.com]][FramerMotion-url]
* [![Anime.js][Animejs.com]][Animejs-url]
* [![Phosphor Icons][PhosphorIcons.com]][PhosphorIcons-url]
* [![PNPM][PNPM.io]][PNPM-url]

## Getting Started

### Prerequisites

Requires Node.js 22.12.0 or higher and pnpm installed globally.

```sh
npm install -g pnpm
```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Wingky530/ViewPort.git
   ```
2. Install dependencies
   ```sh
   pnpm install
   ```

## Usage

Start the development server and open `localhost:1234` (or `localhost:1234/app`):

```sh
pnpm dev
```

Enter any URL into the search bar to preview it inside the responsive iframe.

### Local Development URLs

ViewPort includes a built-in server-side proxy (`/api/proxy`) that handles local and private URLs like `localhost`, `127.0.0.1`, and `192.168.x.x` that would normally be blocked by `X-Frame-Options` or CSP headers. Just type the URL (e.g., `localhost:4321`) and the proxy takes care of the rest.

## CLI Commands

| Command | Description |
|---|---|
| `pnpm dev` | Starts the local development server at `localhost:1234` |
| `pnpm build` | Builds the production-ready server (SSR via `@astrojs/node`) |
| `pnpm preview` | Previews the built server locally |
| `pnpm astro check` | Astro type-checker (slow, may hang; use `pnpm tsc --noEmit` instead) |
| `pnpm tsc --noEmit` | Fast TypeScript check (recommended) |

> **Note:** This project runs in SSR mode (`output: 'server'`). The proxy endpoint requires the server to be running.

## Features

See [FEATURES.md](FEATURES.md) for a detailed list of current features and the development roadmap.

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
2. **Normalization** — The client normalizes the URL (`localhost:4321` to `http://localhost:4321`)
3. **Local Detection** — If the hostname is a private or local address, the iframe src is routed through `/api/proxy?url=...`
4. **Proxy Fetch** — The server fetches the target URL, strips blocking response headers (`X-Frame-Options`, `CSP`), injects a `<base href>` for relative resource resolution, and returns the modified HTML
5. **Rendering** — The browser renders the proxied content inside the sandboxed iframe

## Roadmap

- [ ] **UI Polish** — Refine layout, animations, responsive behavior, and dark mode consistency
- [ ] **Multi-view** — Reduce to 2 views, responsive layout, sidebar sync, and persistent state
- [ ] **Keyboard Shortcuts** — Quick navigation (`Cmd+K` for search, `Cmd+1-4` for device presets)
- [ ] **Multi-language Support** — i18n support
- [ ] **More Tools** — Additional web developer utilities coming to the toolkit

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
[FramerMotion.com]: https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white
[FramerMotion-url]: https://www.framer.com/motion/
[Animejs.com]: https://img.shields.io/badge/Anime.js-FFB300?style=for-the-badge&logo=animejs&logoColor=white
[Animejs-url]: https://animejs.com/
