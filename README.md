# ShopStream — Swiggy-style e-commerce, full-stack

> Mobile-first, app-like shopping for India. Fashion, electronics, grocery, beauty, home, books — with the same Swiggy feel.

- **Web**: Next.js 15 + React 19 + TypeScript + Tailwind CSS (Vercel).
- **API**: Express + TypeScript on Render.
- **DB**: Neon Postgres + Drizzle ORM.
- **Cache + Queues**: Upstash Redis + BullMQ.
- **Auth**: Clerk → JWT HTTP-only cookies.
- **Payments**: Razorpay. **Email**: Brevo. **Images**: Cloudinary. **Cold storage**: Backblaze B2.
- **Real-time**: Socket.io. **Maps**: Leaflet.
- **AI**: Groq (Llama 3.1) + NVIDIA NIM fallback.
- **PWA**: hand-rolled service worker + `manifest.webmanifest`.
- **Discovery**: SEO + AEO + GEO + LLMO + AISEO + E-E-A-T — sitemap, robots, JSON-LD, `llms-full.txt`, agent.json, consistent author identity.

## Quick start

```bash
pnpm install
cp .env.example .env   # fill secrets
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Web: http://localhost:3000 · API: http://localhost:4000

## Documentation

- [TECH_STACK](./docs/TECH_STACK.md)
- [ARCHITECTURE](./docs/ARCHITECTURE.md)
- [API](./docs/API.md)
- [DB_SCHEMA](./docs/DB_SCHEMA.md)
- [DEPLOYMENT](./docs/DEPLOYMENT.md)
- [EDGE_CASES](./docs/EDGE_CASES.md)
- [WORKFLOW](./docs/WORKFLOW.md)
- [AI_DISCOVERABILITY_FRAMEWORKS](./docs/AI_DISCOVERABILITY_FRAMEWORKS.md)
- [STITCH_PROMPT](./docs/STITCH_PROMPT.md)

## Indexing files

- `apps/web/src/app/sitemap.ts` → `/sitemap.xml`
- `apps/web/src/app/robots.ts` → `/robots.txt`
- `apps/web/public/llms.txt`
- `apps/web/public/llms-full.txt`
- `apps/web/public/ai-plugin.json`
- `apps/web/public/.well-known/agent.json`

## Author identity

Same `name`, `jobTitle`, and URL appear in `Person` JSON-LD, About, footer, llms files, and (recommended) GitHub + LinkedIn.
See `packages/lib/src/index.ts → BRAND.author`.
