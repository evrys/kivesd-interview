# KI-VesD Interview Project

## Setup

This project uses [pnpm](https://pnpm.io/installation) and [@antfu/ni](https://github.com/antfu/ni) for fast and space-efficient package management while reducing typing for common operations. You can install them like so:

```
corepack enable
corepack prepare pnpm@latest --activate
pnpm i -g @antfu/ni
```

Now you can use `ni` to install dependencies in the repo:

```bash
ni
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
nr dev
```

## Production

To make a static site build and deploy to Cloudflare Pages:

```bash
nr deploy
```