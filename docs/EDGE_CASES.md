# ShopStream — Edge Cases & Failure Modes

> How ShopStream behaves when things go wrong, and how we recover.

## 1. Payments

### 1.1 Razorpay webhook arrives twice

- Razorpay retries failed webhooks up to 5 times.
- Our handler uses the `razorpay_order_id` to look up the payment and idempotently updates status; second hit is a no-op.
- DB has unique index on `payments.razorpay_order_id` to catch duplicates upstream.

### 1.2 Webhook signature fails

- Return `400 Bad signature`. Render logs the event.
- Manual reconciliation job (cron) compares Razorpay payments against `orders.status='created' > 30 min` and pings support.

### 1.3 Order total mismatch

- The Razorpay order amount equals `orders.total`. The webhook handler re-derives the total from `order_items` and rejects if mismatched. Logged + manual review.

### 1.4 User abandons checkout

- `orders.status='created'` for > 30 min → auto-cancel cron, release inventory reservation, no email sent.

## 2. Inventory

### 2.1 Stock race condition

- `add_to_cart` decrements `inventory.on_hand` and increments `inventory.reserved` atomically with a conditional `WHERE on_hand >= qty` SQL.
- On checkout success: `reserved` is converted to actual shipment.
- On checkout cancel: `reserved` decrements, `on_hand` increments back.

### 2.2 Negative stock

- The conditional update prevents negatives. If a row is missing, the system falls back to optimistic decrement and logs the discrepancy.

### 2.3 Out-of-stock product page

- PDP shows "Out of stock" via `Badge tone="danger"` and disables `Add to cart`.
- The PDP still serves with a `Product` JSON-LD where `offers.availability = OutOfStock` (good for SEO).

## 3. Authentication

### 3.1 Clerk session expires mid-checkout

- The web app re-prompts via Clerk's modal. The cart is in `localStorage`, no state lost.
- JWT cookie remains valid until expiry; re-issue on next login.

### 3.2 Clerk webhook user deletion

- We delete the corresponding row in `users`, cascade-deletes `addresses`, `carts`, `wishlists`.
- We retain `orders` (with `user_id = null` via a soft FK column we add later) for financial records — out of scope v1.

### 3.3 CSRF token missing / mismatch

- Backend returns `403`. UI surfaces a toast and triggers a refresh to get a new token.

## 4. Rate Limiting

- `120 req/min/IP` per route group.
- On breach: `429 Too Many Requests` with `Retry-After`.
- Web app shows a friendly toast.

## 5. Email (Brevo)

- Worker has 5 retries with exponential backoff.
- On final failure, the job moves to BullMQ's failed queue.
- We persist every job in `jobs_audit` for forensics.

## 6. CDN / Images

### 6.1 Cloudinary upload fails

- Retry once in the worker; on failure mark product image as missing in DB.
- Admin alert via Slack webhook (out of scope v1).

### 6.2 Backblaze B2 outage

- Bucket reads fall back to Cloudinary URLs.
- Cron snapshots skipped — log a warning; resumes when B2 returns.

## 7. Cron / Render Sleep

- Render free tier sleeps after 15 min of inactivity → cold start.
- Mitigation: cron-job.org pings `/healthz` every 5 minutes.
- If health fails twice, Render auto-restarts; if it keeps failing, an UptimeRobot check emails support.

## 8. Realtime Tracking

### 8.1 Socket.io disconnects

- The browser auto-reconnects; the courier app re-emits last known position on reconnect.
- Server keeps the room alive for 5 minutes after last subscriber.

### 8.2 Webhook burst

- If the courier app fires > 1 update/sec we throttle to 1 update every 5 seconds per shipment.

## 9. AI Chat

### 9.1 Both Groq and NVIDIA NIM down

- Route returns `{ reply: <fallback>, model: "fallback" }` and the user is shown a "support handoff" banner with `support@shopstream.app`.

### 9.2 Token limit / abuse

- Per-IP rate limit on `/ai/chat`: 30/min. Hard cap of 2000 chars per message.

## 10. PWA

### 10.1 Service worker cache stale

- `caches.delete()` on `activate` for any key != `shopstream-shell-v1`. Increment `v1` → `v2` to nuke on deploy.

### 10.2 Offline checkout attempt

- Disabled by default; the checkout page shows an offline banner.

## 11. Indexability

### 11.1 Crawl storm

- `robots.ts` disallows `/api`, `/admin`, `/cart`, `/checkout`, `/orders`.
- Rate-limit per bot IP via the same Redis bucket.

### 11.2 llms-full.txt stale

- Regenerated weekly by a cron that re-reads the catalog and rewrites the file.

## 12. Author Identity Drift

- Single source of truth: `BRAND.author` in `packages/lib/src/index.ts`.
- Every page that mentions the author references this constant. CI fails the build if a hard-coded name appears in a markdown file under `apps/web/src/app/author/` or `apps/web/public/`.
