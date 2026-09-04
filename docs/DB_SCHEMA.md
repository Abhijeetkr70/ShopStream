# ShopStream — Database Schema

> Drizzle ORM schema for Neon Postgres. Source of truth: `packages/db/src/schema.ts`.

## 1. ER Diagram

```mermaid
erDiagram
  USERS ||--o{ ADDRESSES : "has"
  USERS ||--o{ CARTS : "has"
  USERS ||--o{ ORDERS : "places"
  USERS ||--o{ WISHLISTS : "saves"
  USERS ||--o{ REVIEWS : "writes"
  USERS ||--o{ AI_CHAT_SESSIONS : "starts"

  CATEGORIES ||--o{ PRODUCTS : "groups"
  CATEGORIES ||--o{ CATEGORIES : "parent of"

  PRODUCTS ||--|| INVENTORY : "stocked in"
  PRODUCTS ||--o{ PRODUCT_IMAGES : "has"
  PRODUCTS ||--o{ ORDER_ITEMS : "appears in"
  PRODUCTS ||--o{ CART_ITEMS : "in cart"
  PRODUCTS ||--o{ WISHLISTS : "saved by"
  PRODUCTS ||--o{ REVIEWS : "rated by"

  ORDERS ||--o{ ORDER_ITEMS : "contains"
  ORDERS ||--|| ADDRESSES : "ships to"
  ORDERS ||--o{ PAYMENTS : "paid via"
  ORDERS ||--o{ SHIPMENTS : "fulfilled by"

  AI_CHAT_SESSIONS ||--o{ AI_CHAT_MESSAGES : "contains"

  USERS {
    uuid id PK
    string clerk_id UK
    string email UK
    string name
    string phone
    enum role
    timestamp created_at
    timestamp updated_at
  }
  ADDRESSES {
    uuid id PK
    uuid user_id FK
    string full_name
    string phone
    string line1
    string line2
    string city
    string state
    string pincode
    string country
    real lat
    real lng
    bool is_default
  }
  CATEGORIES {
    uuid id PK
    string slug UK
    string name
    string icon
    uuid parent_id
    int position
  }
  PRODUCTS {
    uuid id PK
    string slug UK
    string title
    string brand
    text description
    uuid category_id FK
    int price_mrp
    int price_sale
    string currency
    int stock
    real rating_avg
    int rating_count
    jsonb images
    jsonb attributes
    enum status
    timestamp created_at
    timestamp updated_at
  }
  INVENTORY {
    uuid product_id PK,FK
    string warehouse_id
    int on_hand
    int reserved
    timestamp updated_at
  }
  CARTS {
    uuid id PK
    uuid user_id FK
    timestamp updated_at
  }
  CART_ITEMS {
    uuid cart_id PK,FK
    uuid product_id PK,FK
    int quantity
  }
  WISHLISTS {
    uuid user_id PK,FK
    uuid product_id PK,FK
    timestamp added_at
  }
  ORDERS {
    uuid id PK
    uuid user_id FK
    uuid address_id FK
    enum status
    int subtotal
    int shipping
    int tax
    int total
    string currency
    text notes
    timestamp created_at
    timestamp updated_at
  }
  ORDER_ITEMS {
    int id PK
    uuid order_id FK
    uuid product_id FK
    string title
    int unit_price
    int quantity
    int line_total
  }
  PAYMENTS {
    uuid id PK
    uuid order_id FK
    string razorpay_order_id
    string razorpay_payment_id
    string razorpay_signature
    int amount
    string currency
    enum status
    string method
    timestamp created_at
  }
  SHIPMENTS {
    uuid id PK
    uuid order_id FK
    string courier
    string tracking
    enum status
    real current_lat
    real current_lng
    int eta_minutes
    timestamp created_at
    timestamp updated_at
  }
  REVIEWS {
    uuid id PK
    uuid product_id FK
    uuid user_id FK
    int rating
    string title
    text body
    timestamp created_at
  }
  COUPONS {
    string code PK
    string description
    int percent_off
    int flat_off
    int min_subtotal
    int max_redemptions
    timestamp expires_at
  }
  NEWSLETTER_SUBSCRIBERS {
    uuid id PK
    string email UK
    string source
    timestamp created_at
  }
  SEARCH_LOGS {
    int id PK
    string query
    int result_count
    uuid user_id
    timestamp created_at
  }
  AI_CHAT_SESSIONS {
    uuid id PK
    uuid user_id FK
    timestamp started_at
    timestamp ended_at
    bool handoff_to_human
  }
  AI_CHAT_MESSAGES {
    int id PK
    uuid session_id FK
    string role
    text content
    string model
    timestamp created_at
  }
  JOBS_AUDIT {
    int id PK
    string queue
    string job_id
    string status
    int attempts
    text error
    timestamp created_at
  }
  AUDIT_LOGS {
    int id PK
    string actor
    string action
    string target
    jsonb meta
    timestamp created_at
  }
```

## 2. Indexes & Constraints

- `users(clerk_id)`, `users(email)` — unique.
- `categories(slug)` — unique.
- `products(slug)` — unique; `(category_id)` and `(status)` indexed.
- `orders(user_id)`, `orders(status)` — indexed.
- `cart_items(cart_id, product_id)` — composite PK.
- `wishlists(user_id, product_id)` — composite PK.

## 3. Money

All prices are stored in **paise (integer)**. INR × 100 = paise. Conversion to rupees happens in the UI layer (`inr(paise)`).

## 4. Status Enums

| Enum | Values |
|---|---|
| `user_role` | `user`, `admin` |
| `order_status` | `created`, `paid`, `packed`, `shipped`, `delivered`, `cancelled`, `refunded` |
| `payment_status` | `pending`, `captured`, `failed`, `refunded` |
| `product_status` | `draft`, `active`, `archived` |
| `shipment_status` | `pending`, `picked_up`, `in_transit`, `out_for_delivery`, `delivered`, `exception` |

## 5. Migrations

```bash
pnpm --filter @shopstream/db generate     # generates SQL from schema
pnpm --filter @shopstream/db migrate      # applies pending migrations
pnpm --filter @shopstream/db seed         # populates ~70 demo SKUs
```

## 6. Conventions

- All `id` columns are `uuid` and server-generated via `defaultRandom()`.
- All timestamps are `timestamptz` and default to `now()`.
- Soft-deletes are **not** used; archives flip `products.status = 'archived'`.
- All FKs cascade on user/cart/order deletion.
