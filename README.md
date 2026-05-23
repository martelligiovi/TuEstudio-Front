# TuEstudio Frontend

Frontend app for TuEstudio built with React, TypeScript, and Vite.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm run dev
```

## Build

```bash
pnpm run build
```

## Cloudflare Pages

This repo is configured to deploy from GitHub Actions, so Cloudflare Pages should receive the prebuilt `dist` folder from the workflow.

If you ever switch back to Cloudflare's Git-connected build, use this configuration:

| Setting          | Value            |
| ---------------- | ---------------- |
| Framework preset | Vite             |
| Build command    | `pnpm run build` |
| Output directory | `dist`           |

## GitHub Actions deployment

The workflow deploys the built `dist` folder to Cloudflare Pages on every push to `main`.

Configure these GitHub repository secrets:

| Secret                  | Value                                      |
| ----------------------- | ------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token with Pages edit scope |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID                      |

Configure these GitHub repository variables:

| Variable                  | Value                         |
| ------------------------- | ----------------------------- |
| `CLOUDFLARE_PROJECT_NAME` | Cloudflare Pages project name |
| `VITE_API_URL`            | Backend API URL, if separate  |

`VITE_API_URL` must be available in GitHub Actions because Vite injects it at build time.

Example:

```txt
VITE_API_URL=https://api.tuestudio.com
```

## Lint

```bash
pnpm run lint
```
