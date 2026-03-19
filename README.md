# RiceWerkz

Official website for RiceWerkz

Live site: https://ricewerkz.alyxcuiedio.com

## What it is

A React + Vite site with the following pages:

- **Home** — hero image carousel, member cards, scrolling gallery, about, and contact
- **Member Cars** — grid of all member vehicles
- **Vehicle Info** — individual car page with specs and gallery
- **Gallery** — full photo gallery (in progress)
- **Parts** — parts list page (in progress)
- **Upload** (`/upload`) — PWA upload tool for pushing photos directly to Cloudinary from your phone

## Images

Photos are stored and served through Cloudinary. The hero and gallery carousels fetch images automatically by tag — no code changes needed to add or remove photos.

To upload new photos, go to `/upload`, select Hero or Gallery, pick your files, and upload. Images appear on the site immediately.

## Local development

```bash
npm install
npm run dev
```

Requires a `.env` file — see `.env.example` for the required variables.

## Deployment

Deployed on Vercel. Environment variables must be added in the Vercel dashboard to match `.env.example`.
