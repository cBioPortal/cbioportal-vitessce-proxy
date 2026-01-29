# cBioPortal Vitessce Proxy

A lightweight app for viewing Vitessce visualizations. Supports loading configs from local files, pasted JSON, or remote URLs. Views can be embedded in iframes.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v9+)

## Getting Started

```sh
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The app runs at `http://localhost:5173` by default.

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Run ESLint |

## Adding Datasets

Place Vitessce JSON config files in `public/view_configs/` and register them in `public/view_configs/index.json`:

```json
[
  { "name": "My Dataset", "path": "my_dataset" }
]
```

The `path` value should match the filename without `.json` (e.g., `my_dataset` maps to `public/view_configs/my_dataset.json`).

## URL Reference

| URL | Description |
|---|---|
| `/` | Homepage with dataset list and config input forms |
| `/view?dataset=<name>` | Load a local config from `view_configs/` |
| `/view?json=<url>` | Load a config from a remote URL |
| `/view?dataset=<name>&embed=true` | Embed mode (hides header and breadcrumb) |

Embed mode is also automatically activated when the page is loaded inside an iframe.
