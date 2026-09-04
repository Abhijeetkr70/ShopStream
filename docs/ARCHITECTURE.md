# ShopStream — Architecture

> High-level system architecture with Mermaid diagrams.

## 1. Context (C4 Level 1)

```mermaid
flowchart LR
  User([Shopper])
  Crawler([Answer / Search Engine])
  AI([AI Agent])
  Web[Next.js — Vercel]
  Api[Express API — Render]
  Neon[(Neon Postgres)]
  Upstash[(Upstash Redis)]
  Clerk{{Clerk}}
  Rzp{{Razorpay}}
  Brevo{{Brevo}}
  Cld{{Cloudinary}}
  B2{{Backblaze B2}}
  Groq{{Groq}}
  Nim{{NVIDIA NIM}}
  Cron([cron-job.org])

  User --> Web
  Crawler --> Web
  AI --> Web
  Web --> Api
  Web --> Clerk
  Api --> Neon
  Api --> Upstash
  Api --> Rzp
  Api --> Brevo
  Api --> Cld
  Api --> B2
  Api --> Groq
  Api --> Nim
  Cron --> Api
```

## 2. Containers

```mermaid
flowchart TB
  subgraph Browser
    UI[Next.js App Router]
    Store[Zustand cart store]
    SW[Service Worker]
  end

  subgraph Vercel
    UI
  end

  subgraph Render
    API[Express API]
    WS[Socket.io]
    Q[BullMQ workers]
  end

  subgraph Neon
    DB[(Postgres)]
  end

  subgraph Upstash
    R[(Redis)]
  end

  UI <--> WS: wss
  UI --> API: https /api/v1
  API --> DB
  Q --> R
  API <--> R: cache + queues
```

## 3. Authentication Sequence

```mermaid
sequenceDiagram
  participant U as User
  participant W as Next.js
  participant C as Clerk
  participant A as Express API

  U->>W: Click "Sign in"
  W->>C: Open Clerk Hosted UI
  C-->>U: OTP / SSO
  C-->>W: Session token
  W->>A: POST /api/v1/auth/issue { clerkId }
  A->>A: Look up user, sign JWT
  A-->>W: Set-Cookie: ss_jwt (HttpOnly, Secure)
  W->>A: GET /api/v1/auth/me (Cookie)
  A-->>W: 200 { user }
```

## 4. Checkout Sequence

```mermaid
sequenceDiagram
  participant U as User
  participant W as Next.js
  participant A as Express
  participant DB as Postgres
  participant RZ as Razorpay
  participant B as Brevo
  participant Q as BullMQ

  U->>W: Place order
  W->>A: POST /api/v1/orders { addressId, items }
  A->>DB: Insert order + items + payment(pending)
  A->>RZ: orders.create({ amount, receipt })
  A->>Q: enqueue email "order-created"
  Q->>B: sendBrevoEmail(...)
  A-->>W: { orderId, razorpayOrderId }
  U->>RZ: Pay via UPI / card
  RZ->>A: POST /api/v1/webhooks/razorpay
  A->>A: Verify HMAC signature
  A->>DB: payment.status=captured, orders.status=paid
  A->>Q: enqueue email "order-paid"
  Q->>B: sendBrevoEmail(...)
  A-->>RZ: 200 OK
```

## 5. Real-time Tracking

```mermaid
sequenceDiagram
  participant App as Courier App
  participant API as Express
  participant DB as Postgres
  participant Sock as Socket.io
  participant W as Next.js (browser)

  App->>API: POST /api/v1/shipment/:id/tick { lat, lng, eta }
  API->>DB: Update shipment
  API->>Sock: io.to(`order:${orderId}`).emit('location', ...)
  Sock-->>W: 'location' event
  W->>W: Update Leaflet marker
```

## 6. AI Chat Routing

```mermaid
flowchart LR
  M[User message] --> R{Provider?}
  R -- configured --> G[Groq llama-3.1-8b-instant]
  G -- errored --> N[NVIDIA NIM meta/llama-3.1-8b-instruct]
  N -- errored --> F[Fallback reply]
  F --> Out
  G --> Out[Reply + model tag]
  N --> Out
```

## 7. Deploy Topology

| Component | Host | URL |
|---|---|---|
| `apps/web` | Vercel | `https://shopstream.vercel.app` |
| `apps/api` | Render Web Service | `https://shopstream-api.onrender.com` |
| Postgres | Neon | `postgres://…neon.tech/shopstream` |
| Redis | Upstash | `https://…upstash.io` |
| Object storage | Backblaze B2 | `https://…b-cdn.net` |
| CDN | Cloudinary | `https://res.cloudinary.com/…` |
| Cron | cron-job.org | `GET /healthz` every 5 min |

## 8. Why this split?

- Vercel excels at edge-rendered React + image optimization + analytics.
- Render keeps a single long-lived Node process for Socket.io, BullMQ workers, webhooks, and easy health probes.
- The two communicate over a tight JSON contract; both read the same Drizzle schema.
