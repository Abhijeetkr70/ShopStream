# ShopStream — Workflows

> End-to-end user and admin flows. Mermaid diagrams describe happy paths; edge cases live in `EDGE_CASES.md`.

## 1. Discovery → Purchase

```mermaid
flowchart TD
  A[Open shopstream.app] --> B[Swiggy-style landing]
  B --> C{Select intent}
  C -- category --> D[CategoryStrip]
  C -- search --> E[Hero search]
  C -- deal --> F[DealCountdown]
  D --> G[Category listing]
  E --> H[Search results]
  F --> I[Deal grid]
  G --> J[Product page]
  H --> J
  I --> J
  J --> K{Auth?}
  K -- no --> L[Clerk sign-in/up]
  L --> M[Cart drawer]
  K -- yes --> M
  M --> N[Checkout]
  N --> O[Razorpay pay]
  O --> P[Webhook: payment.captured]
  P --> Q[Order = paid]
  Q --> R[Email: order-paid]
  Q --> S[Order tracking page]
  S --> T[Email: order-shipped]
  T --> U[Email: order-delivered]
```

## 2. Cart Lifecycle

```mermaid
sequenceDiagram
  participant U as User
  participant Z as Zustand (localStorage)
  participant API as Express
  participant DB as Postgres

  U->>Z: Add item
  Z->>Z: persist JSON
  U->>API: POST /cart (after auth)
  API->>DB: upsert cart_items
  U->>U: Navigate
  U->>API: DELETE /cart/:productId
  API->>DB: delete line
```

## 3. Admin (Catalog CRUD)

```mermaid
flowchart LR
  A[Admin /admin/products] --> B[New product]
  B --> C[POST /admin/products]
  C --> D[Insert into products]
  C --> E[Insert into product_images]
  C --> F[Insert/update inventory]
  C --> G[enqueue index-product]
  G --> H[Re-write llms-full.txt entry]
  G --> I[Re-submit URL to Bing]
```

## 4. Realtime Tracking

```mermaid
sequenceDiagram
  participant C as Courier App
  participant API as Express
  participant DB as Postgres
  participant Sock as Socket.io
  participant W as Web

  C->>API: POST /shipment/:id/tick {lat,lng,eta}
  API->>DB: update shipment
  API->>Sock: emit location to room
  Sock-->>W: location
  W->>W: Leaflet marker move
  API->>Sock: emit eta to room
  Sock-->>W: eta minutes
```

## 5. Newsletter Signup

```mermaid
sequenceDiagram
  participant U as Visitor
  participant W as Web
  participant DB as Postgres
  participant B as Brevo
  U->>W: Submit email
  W->>DB: insert newsletter_subscribers (idempotent)
  W-->>U: Success toast + discount code
  DB-->>B: nightly sync
  B->>U: Welcome email
```

## 6. Search Indexing Loop

```mermaid
flowchart LR
  P[Product created] --> I[enqueue index-product]
  I --> W[Worker]
  W --> M[Update llms-full.txt]
  W --> B[POST Bing URL Submission]
  W --> G[Ping Google Indexing API]
```

## 7. Health & Keep-alive

```mermaid
sequenceDiagram
  participant C as cron-job.org
  participant A as Render API
  participant R as Redis
  C->>A: GET /healthz every 5 min
  A-->>C: 200
  A->>R: ping
  R-->>A: PONG
```

## 8. Deployment Workflow

```mermaid
flowchart LR
  Dev[Developer push to main] --> CI[GitHub Actions]
  CI --> Vercel
  CI --> Render
  Vercel --> WebCDN
  Render --> API
  CI --> Smoke[curl smoke tests]
  Smoke --> Slack[Slack #deploys]
```
