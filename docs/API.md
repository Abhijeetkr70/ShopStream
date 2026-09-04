# ShopStream — API Reference

> Base URL: `https://shopstream-api.onrender.com/api/v1`
> Auth: Clerk (frontend) → JWT HTTP-only cookie `ss_jwt` (backend).
> Content type: `application/json` (multipart for uploads).
> Errors: `{ "error": { "code": 400, "message": "..." } }`

---

## Auth

### `GET /healthz`
Liveness probe used by cron-job.org and Render.

### `GET /readyz`
Verifies Redis is reachable.

### `POST /api/v1/auth/csrf`
Issues a CSRF token cookie and returns a hashed version to mirror in the `x-csrf-token` header on unsafe requests.

### `POST /api/v1/auth/issue`
Body: `{ "clerkId": "user_xxx" }`
Sets the `ss_jwt` cookie. Web app calls this after Clerk session is established.

### `POST /api/v1/auth/logout`
Clears `ss_jwt`.

### `GET /api/v1/auth/me`
Requires auth. Returns `{ user: { id, role, email } }`.

---

## Catalog

### `GET /api/v1/categories`
Returns all categories ordered by position.

### `GET /api/v1/products?category=fashion&limit=24`
Returns products filtered by category slug.

### `GET /api/v1/products/:slug`
Returns a single product by slug.

### `GET /api/v1/search?q=earbuds&limit=24`
Full-text search across title/brand/description.

---

## Cart

### `GET /api/v1/cart`
Returns the current user's cart lines.

### `POST /api/v1/cart`
Body: `{ "productId": "uuid", "quantity": 1 }`
Adds or increments a line.

### `DELETE /api/v1/cart/:productId`
Removes the line.

---

## Wishlist

### `GET /api/v1/wishlist`
### `POST /api/v1/wishlist`
### `DELETE /api/v1/wishlist/:productId`

---

## Orders

### `GET /api/v1/orders`
Returns the current user's orders.

### `POST /api/v1/orders`
Body:
```json
{
  "addressId": "uuid",
  "items": [{ "productId": "uuid", "quantity": 1 }]
}
```
Response:
```json
{
  "orderId": "uuid",
  "razorpayOrderId": "order_xxx",
  "amount": 129900
}
```

---

## AI

### `POST /api/v1/ai/chat`
Body: `{ "message": "string", "sessionId": "uuid?" }`
Response: `{ "reply": "string", "model": "groq" | "nvidia-nim" | "fallback" }`

---

## Uploads (admin/owner only — wire RBAC before exposing)

### `POST /api/v1/uploads/sign`
Returns Cloudinary signature for direct browser uploads.

### `POST /api/v1/uploads`
`multipart/form-data` field `file`. Streams to Cloudinary, returns `{ url, publicId }`.

---

## Storage (Backblaze B2)

### `PUT /api/v1/storage/b2/:key`
Body: raw bytes. Stores in B2 bucket.

### `GET /api/v1/storage/b2/:key`
Streams the object back.

---

## Webhooks

### `POST /api/v1/webhooks/clerk`
Headers: `svix-id`, `svix-timestamp`, `svix-signature`. Verifies signature, syncs user into Postgres.

### `POST /api/v1/webhooks/razorpay`
Header: `x-razorpay-signature`. Verifies HMAC, marks payment captured, updates order to `paid`, enqueues confirmation email.

---

## Realtime (Socket.io)

- Endpoint: `wss://shopstream-api.onrender.com`
- Query: `{ orderId: "uuid" }`
- Events emitted: `location` `{ lat, lng }`, `eta` `number` (minutes).
- Client subscribes via `socket.emit("subscribe-order", orderId)`.

---

## Rate Limiting

- Default: 120 req/min/IP across `/api/*`.
- Heavier endpoints (search, ai/chat): 30 req/min/IP.
- Headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (RFC draft-7).
