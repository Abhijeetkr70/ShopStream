# ShopStream — Deployment

> Step-by-step production deployment to Vercel (web) + Render (api) + cron-job.org (keep-alive).

## 1. Prerequisites

- pnpm 11+
- A Neon project (`DATABASE_URL`).
- An Upstash Redis database (REST URL + token, optionally `REDIS_URL`).
- A Clerk application (publishable key + secret + webhook secret).
- A Razorpay account (key id + secret + webhook secret).
- A Brevo account (API key).
- A Cloudinary account (cloud name, API key, API secret).
- A Backblaze B2 account (endpoint, key id, application key, bucket).
- A Vercel account.
- A Render account.
- (Optional) Groq API key, NVIDIA NIM API key.

## 2. Local Development

```bash
git clone <your-fork-url> shopstream
cd shopstream
cp .env.example .env
# fill in all required secrets

pnpm install
pnpm db:generate
pnpm db:migrate
pnpm db:seed

pnpm dev   # runs web + api in parallel via turbo
```

Web: http://localhost:3000  
API: http://localhost:4000

## 3. Vercel — Frontend

1. Create a new Vercel project from the monorepo root.
2. **Root directory**: `apps/web`.
3. **Build command**: `cd ../.. && pnpm install && cd apps/web && pnpm build` (Vercel auto-detects this for monorepos).
4. Add every `NEXT_PUBLIC_*` and `CLERK_*` variable from `.env.example`.
5. Add `Razorpay` webhook URL after deploy: `https://shopstream.vercel.app/api/webhooks/razorpay` (we proxy on the web app) — the canonical handler lives on the API at `/api/v1/webhooks/razorpay`.
6. Enable **Vercel Analytics** + **Speed Insights** in the dashboard.

## 4. Render — Backend

1. Create a new **Web Service** from the same repo.
2. **Root directory**: `apps/api`.
3. **Build command**: `cd ../.. && pnpm install && pnpm --filter @shopstream/api build`.
4. **Start command**: `pnpm --filter @shopstream/api start`.
5. **Health check path**: `/healthz`.
6. Add every server-side env var from `.env.example`.
7. Plan: Starter (free) or Standard; free tier sleeps after 15 min — wire cron-job.org (next step) to prevent.

## 5. cron-job.org — Keep Render Warm

1. Create a free cron-job.org account.
2. New cronjob → `*/5 * * * *` (every 5 minutes) → `GET https://<your-render-host>.onrender.com/healthz`.
3. Optional header `Authorization: Bearer $HEALTH_TOKEN` if you front the route with a token.

## 6. Neon

1. Create a database `shopstream`.
2. Copy both pooled (`DATABASE_URL`) and unpooled (`DATABASE_URL_UNPOOLED`) URLs.
3. Apply migrations:
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

## 7. Upstash

1. Create a Redis database (any region close to Render).
2. Copy REST URL + token.
3. (Optional) For BullMQ direct connection, also copy `rediss://…` URL and set `REDIS_URL`.

## 8. Cloudinary

1. Create a signed upload preset (`shopstream`).
2. Copy cloud name, API key, API secret.

## 9. Backblaze B2

1. Create a private bucket (e.g. `shopstream-assets`).
2. Create an application key with `listBuckets`, `listFiles`, `readFiles`, `writeFiles`, `deleteFiles`.
3. Copy S3-compatible endpoint (`https://s3.<region>.backblazeb2.com`).

## 10. Razorpay

1. Activate Live mode after you've tested with Test mode.
2. Add webhook URL: `https://<your-render-host>.onrender.com/api/v1/webhooks/razorpay`.
3. Subscribe to events: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`.

## 11. Brevo

1. Verify a sender domain (`shopstream.app`).
2. Copy API key (v3).
3. Set `BREVO_FROM_EMAIL` to an address on the verified domain.

## 12. Search Engine Submission

### Google Search Console
1. Add property for `https://shopstream.app`.
2. Verify via DNS TXT record.
3. Submit sitemap: `https://shopstream.app/sitemap.xml`.
4. Request indexing for top 10 product URLs.

### Bing Webmaster Tools
1. Add site, verify via DNS.
2. Submit sitemap (same URL).
3. Optionally use the URL Submission API to push new product URLs automatically.

## 13. CI / CD

Suggested GitHub Actions (`.github/workflows/ci.yml`):

```yaml
name: ci
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 11 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm --filter @shopstream/db generate
```

Vercel + Render auto-deploy on push to `main`.

## 14. Smoke Tests

After deploy, run:

```bash
curl https://shopstream.vercel.app/                      # 200
curl https://shopstream-api.onrender.com/healthz          # 200
curl https://shopstream-api.onrender.com/api/v1/categories # 200
curl https://shopstream.vercel.app/sitemap.xml | head     # XML
curl https://shopstream.vercel.app/llms-full.txt | head   # text
```

PageSpeed Insights (mobile): target ≥ 90 in all four categories.

## 15. Rollback

- Vercel: Project → Deployments → Promote previous deployment.
- Render: Manual Deploy → pick previous commit.
- DB: Neon branching lets you roll back to a branch snapshot.
