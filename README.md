# TuEstudio Frontend

Frontend app for TuEstudio built with React, TypeScript, and Vite.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Cloudflare Pages

Use this configuration when creating the Pages project:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework preset | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |

Set `VITE_API_URL` in Cloudflare Pages environment variables when the backend is not served from the same origin.

Example:

```txt
VITE_API_URL=https://api.tuestudio.com
```

## Lint

```bash
npm run lint
```
