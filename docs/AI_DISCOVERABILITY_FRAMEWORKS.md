# ShopStream — AI Discoverability Frameworks

> How ShopStream ships six overlapping discoverability frameworks — SEO, AEO, GEO, LLMO, AISEO, E-E-A-T — without duplicating effort.

## 1. The Six Frameworks (one-line each)

| # | Acronym | Full name | Optimised for |
|---|---|---|---|
| 1 | **SEO** | Search Engine Optimization | Google / Bing ranking |
| 2 | **AEO** | Answer Engine Optimization | Direct answers in SERPs / voice |
| 3 | **GEO** | Generative Engine Optimization | Generative search (Perplexity, SGE) |
| 4 | **LLMO** | Large Language Model Optimization | Inclusion in LLM outputs |
| 5 | **AISEO / AI Search** | AI Search Engine Optimization | Bing Copilot, ChatGPT search, Perplexity |
| 6 | **E-E-A-T** | Experience, Expertise, Authoritativeness, Trust | Google quality rater signals |

## 2. What each framework actually needs

### 2.1 SEO

| Asset | Status | Location |
|---|---|---|
| Sitemap | ✅ Dynamic | `apps/web/src/app/sitemap.ts` |
| Robots | ✅ Dynamic + static fallback | `apps/web/src/app/robots.ts`, `public/robots.txt` |
| Canonical | ✅ Per page | `metadata.alternates.canonical` |
| OpenGraph | ✅ | `metadata.openGraph` |
| Twitter cards | ✅ | `metadata.twitter` |
| Structured data | ✅ JSON-LD | inline per page |

### 2.2 AEO

| Asset | Status | Where |
|---|---|---|
| FAQPage schema | ✅ | product pages |
| Direct-answer headings | ✅ | "What is the return policy?" |
| Voice-friendly 30-word answers | ✅ | llms-full.txt |

### 2.3 GEO

| Asset | Status | Where |
|---|---|---|
| `llms-full.txt` | ✅ | `apps/web/public/llms-full.txt` |
| `llms.txt` (short) | ✅ | `apps/web/public/llms.txt` |
| `ai-plugin.json` | ✅ | `apps/web/public/ai-plugin.json` |

### 2.4 LLMO

| Asset | Status | Where |
|---|---|---|
| JSON-LD (Product / FAQPage / Organization / Person) | ✅ | per page |
| Agent skill manifest | ✅ | `public/.well-known/agent.json` |
| Catalog API | ✅ | `/api/agent/catalog` |
| Markdown view of every page (`Accept: text/markdown`) | planned v1.1 | future middleware |

### 2.5 AISEO / AI Search

| Asset | Status | Where |
|---|---|---|
| Bing Webmaster submission | ✅ | manual + URL Submission API |
| `NOCACHE` and meta headers | ✅ | for fresh content |
| Indexing webhook on product create | planned v1.1 | BullMQ → Bing API |

### 2.6 E-E-A-T

| Asset | Status | Where |
|---|---|---|
| About page | ✅ | `/about` |
| Author bio page | ✅ | `/author/shopstream` |
| `Person` schema | ✅ | author page |
| Consistent identity (name + jobTitle + URL) | ✅ | `BRAND.author` constant |
| HTTPS + HSTS preload | ✅ | `next.config.ts` |
| Privacy / Terms | ✅ | `/legal/privacy`, `/legal/terms` |

## 3. The Single Source of Truth — `BRAND.author`

```ts
// packages/lib/src/index.ts
export const BRAND = {
  author: {
    name: "ShopStream Team",
    handle: "shopstream",
    jobTitle: "Founder & Engineering",
    url: "https://shopstream.app/author/shopstream",
  },
};
```

Every page, JSON-LD, sitemap entry, llms file, About page, and Footer that mentions the author pulls from this constant. Changing the name in one place updates all six frameworks atomically.

## 4. Discoverability Checklist (pre-launch)

- [ ] Sitemap lists every active product URL.
- [ ] `robots.ts` allows AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended).
- [ ] Each product page emits a `Product` JSON-LD with offers + aggregateRating.
- [ ] Each product page emits a `FAQPage` JSON-LD.
- [ ] Each page emits an `Organization` JSON-LD.
- [ ] Author page emits a `Person` JSON-LD with `worksFor`.
- [ ] `llms-full.txt` is regenerated after every catalog change.
- [ ] About page links to `/author/shopstream`.
- [ ] Footer links to `/author/shopstream`.
- [ ] Same name + jobTitle on: GitHub org description, LinkedIn page, About page, JSON-LD.
- [ ] Sitemap submitted to Google Search Console.
- [ ] Sitemap submitted to Bing Webmaster Tools.
- [ ] Top 10 product URLs requested for indexing.
- [ ] `agent.json` registered with model-context marketplaces.
- [ ] Lighthouse SEO score ≥ 95.

## 5. Agentic Browsing Playbook

When an AI agent hits ShopStream:

1. `GET /` → RSC HTML with semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`).
2. `GET /llms-full.txt` → comprehensive catalog + pricing policy.
3. `GET /.well-known/agent.json` → typed skill manifest.
4. `GET /api/agent/catalog` → JSON catalog.
5. `GET /product/{slug}` → product HTML with `Product` JSON-LD.

## 6. Six-framework scorecard

| Framework | Coverage |
|---|---|
| SEO | ✅ ✅ ✅ ✅ ✅ — A |
| AEO | ✅ ✅ ✅ ✅ — A- |
| GEO | ✅ ✅ ✅ ✅ ✅ — A |
| LLMO | ✅ ✅ ✅ ✅ — A- |
| AISEO | ✅ ✅ ✅ — B+ |
| E-E-A-T | ✅ ✅ ✅ ✅ ✅ — A |

## 7. Continuous improvement

- Monthly: regenerate `llms-full.txt`, re-submit sitemap, audit author consistency.
- Quarterly: review JSON-LD via Google's Rich Results test.
- Per release: run Lighthouse + PageSpeed Insights, fix regressions.
- Per new product: enqueue `index-product` job → updates llms-full.txt + submits URL.
