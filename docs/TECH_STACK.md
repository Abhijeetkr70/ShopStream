# ShopStream — Technology Stack

> Single source of truth for every library, tool, and service that ships with ShopStream.

## 1. Runtime & Language

| Layer | Tool | Version | Why |
|---|---|---|---|
| Runtime | Node.js | 20 LTS | Stable, supported by Render + Vercel Edge, required by Next.js 15 + Clerk. |
| Language | TypeScript | 5.6.x | Type safety across monorepo, single source for shared Zod schemas. |
| Package manager | pnpm | 11.x | Workspace-aware, fast, content-addressable store. |
| Build orchestrator | Turborepo | 2.x | Caching, parallel tasks, workspace graph. |

## 2. Frontend (apps/web)

| Concern | Tool | Version | Why |
|---|---|---|---|
| Framework | Next.js | 15 (App Router) | RSC, ISR, edge runtime, native image opt, route handlers. |
| UI library | React | 19 | Concurrent rendering, transitions. |
| Styling | Tailwind CSS | 3.4 | Utility-first, ships tiny CSS, plays well with SSR. |
| Components | `@shopstream/ui` | workspace | Single design-system package, derived from Google Stitch. |
| Fonts | next/font (Inter, Manrope, JetBrains Mono) | 15.x | Self-hosted, subset, no FOIT. |
| State | Zustand | 5.x | Tiny, ergonomic, persisted cart, no Context boilerplate. |
| Icons | lucide-react | latest | Tree-shakeable, consistent. |
| Auth | @clerk/nextjs | 6.x | Hosted UI, JWT cookies, webhooks. |
| Real-time | socket.io-client | 4.x | Order tracking. |
| Maps | leaflet + react-leaflet | 1.9 / 5.x | Live courier tracking. |
| Diagrams | mermaid | 11.x | Docs viz. |
| Analytics | @vercel/analytics + @vercel/speed-insights | 1.x | Real-user metrics. |
| PWA | hand-rolled `sw.js` + `manifest.webmanifest` | — | No extra dep, full control over caching strategy. |

## 3. Backend (apps/api)

| Concern | Tool | Version | Why |
|---|---|---|---|
| Framework | Express | 4.21 | Mature, ecosystem for Helmet/CORS/CSRF/Multer/Socket.io. |
| Security | helmet, cors, csurf-style CSRF, express-rate-limit | 8 / 2 / custom / 7 | Defence-in-depth. |
| Real-time | socket.io | 4.x | Per-user rooms, namespaces. |
| Payments | razorpay | 2.x | Official Node SDK. |
| Email | Brevo HTTP API | — | No SDK; plain fetch. |
| Image upload | multer (memory) → cloudinary | 1.4 / 2.x | Multipart parsing + CDN transform. |
| Object storage | Backblaze B2 via @aws-sdk/client-s3 | 3.x | S3-compatible, cheap cold storage. |
| Job queue | BullMQ | 5.x | Redis-backed retries, cron, priorities. |
| Redis client | ioredis | 5.x | Stable, performant. |
| Validation | zod | 3.x | Shared with web app via @shopstream/types. |
| AI chat (primary) | Groq (Llama 3.1 8B Instant) | — | Lowest latency, generous free tier. |
| AI chat (fallback) | NVIDIA NIM (meta/llama-3.1-8b-instruct) | — | Always-on enterprise endpoint. |
| Webhooks | svix (Clerk) + raw HMAC (Razorpay) | 1.x / crypto | Official verification. |

## 4. Data Layer

| Concern | Tool | Version | Why |
|---|---|---|---|
| DB | Neon Postgres | latest | Serverless Postgres, branch-per-PR. |
| ORM | Drizzle ORM | 0.36 | Type-safe SQL, no runtime overhead. |
| Migrations | drizzle-kit | 0.28 | `drizzle-kit generate` + `migrate`. |
| Cache | Upstash Redis | latest | Low-latency edge cache + BullMQ broker. |

## 5. Shared Packages

| Package | Purpose |
|---|---|
| `@shopstream/types` | Zod schemas, shared TS types. |
| `@shopstream/lib` | Constants, env loader, JWT, Redis helpers, formatters. |
| `@shopstream/db` | Drizzle schema, client, migrations, seeder. |
| `@shopstream/ui` | Stitch-derived React components, design tokens, Zustand cart. |

## 6. External Services

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting + analytics + speed insights. |
| Render | Backend hosting + always-on ping target. |
| cron-job.org | `GET /healthz` every 5 min to keep Render warm. |
| Google Search Console | Indexing, sitemap submission. |
| Bing Webmaster Tools | Indexing, URL submission. |
| Brevo | Transactional email (order, ship, deliver). |
| Razorpay | Payments (UPI, cards, net-banking). |
| Cloudinary | Image CDN + eager transforms. |
| Backblaze B2 | Cold storage for raw uploads + DB snapshots. |
| Clerk | Identity. |
| Neon | Postgres. |
| Upstash | Redis. |

## 7. Discovery Frameworks Shipped

1. **SEO** — sitemap.xml, robots.ts, canonical, OG, Twitter.
2. **AEO** — FAQPage JSON-LD on product pages.
3. **GEO** — `llms-full.txt` with structured product + category info.
4. **LLMO** — JSON-LD `Product` / `Organization` / `FAQPage`, agent.json.
5. **AISEO / AI Search** — Bing URL submission API hint, AI-plugin.json.
6. **E-E-A-T** — `Person` schema, About page, consistent author identity across platforms.

## 8. Quality Bars

- TypeScript: `strict: true`, `noUncheckedIndexedAccess: true`.
- Lint: ESLint (Next config).
- Lighthouse mobile target ≥ 90 in all 4 categories.
- All third-party scripts loaded with `next/script` strategy.
