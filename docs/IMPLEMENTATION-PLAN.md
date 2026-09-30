# ROSADO PERFUME — Implementation Plan

**Status:** V1 storefront + Laravel/MySQL backend implemented and wired together.  
**Source of truth:** `docs/ROSADO-PERFUME-SPEC.md`  
**Last updated:** 2026-09-28

---

## 0. Repository analysis (Phase 0)

| Area | Finding at start |
| --- | --- |
| Repository | Empty except `/docs/ROSADO-PERFUME-SPEC.md` |
| Decision | Scaffold Vite + React + TypeScript + Tailwind + Zustand + React Router + React Hook Form |

---

## 1. Architecture (as built)

```text
src/
  app/                 App shell + lazy router
  components/ui/       Design system
  components/layout/   Header, Footer, Search overlay
  components/product/  ProductCard, FilterSidebar
  components/seo/      PageMeta + JSON-LD
  pages/               Lazy route pages
  custom-builder/      Size / Fragrance / Bottle / Cap / Preview
  services/            Mock API layer (swap to HTTP later)
  store/               Zustand: builder, cart, auth, wishlist, UI
  hooks/               useCart, useAuth, useCustomPerfume
  utils/               price, currency, storage
  types/               Domain models
  data/mocks/          Master data (not imported by page UI for catalog)
  validation/          Server-authoritative custom perfume rules
```

**Non-negotiable rules**

- Bottle and Cap are **components**, never catalog products.
- No Bottle/Cap “Add to Cart”.
- `bottle.sizeId === selectedSizeId` or the bottle is not shown / not kept.
- Size change clears an incompatible bottle.
- Frontend estimates price; `validateCustomPerfume` / `orderApi.createOrder` recalculate and reject mismatches.
- Orders persist a **snapshot** (names + prices at purchase).
- Classifications are many-to-many mappings.

---

## 2. Routes

`/`, `/shop`, `/men`, `/women`, `/unisex`, `/perfumes/:slug`, `/custom-perfume`, `/cart`, `/checkout`, `/login`, `/register`, `/account`, `/account/orders`, `/account/orders/:id`, `/account/wishlist`, `/about`, `/contact`, `/privacy`, `/terms`, `/shipping`, `/returns`

---

## 3. Acceptance data (must remain in mocks)

- Fragrance `FRG001` Woody Oud + `SIZE50` base **₹399**
- Bottle `BTL002` Premium Glass 50 ML **₹50**
- Cap `CAP001` Classic Black **₹0**
- Total **₹449**
- `BTL004` is 100 ML and must be rejected with 50 ML

---

## 4. Phase checklist

| Phase | Scope | Status |
| --- | --- | --- |
| 0 | Analysis + plan | Done |
| 1 | Design system + tokens | Done |
| 2–3 | Routing, Header, Footer | Done |
| 4 | Homepage | Done |
| 5–7 | Shop, PDP, types, mocks, services | Done |
| 8 | Custom Perfume Builder | Done |
| 9 | Cart | Done |
| 10 | Checkout | Done |
| 11 | Order snapshot | Done |
| 12 | Validation (authoritative mock backend) | Done |
| 13 | Responsive / sticky builder bar | Done |
| 14 | SEO / a11y / lazy routes | Done |
| 15 | Typecheck, production build, acceptance rule check | Done |

---

## 5. How to run

Two servers, run together:

```bash
# Terminal 1 -- backend (Laravel + MySQL API on :8000)
cd backend
composer install
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000

# Terminal 2 -- frontend (Vite dev server on :5173)
npm install
npm run dev
```

Open `http://localhost:5173`. The frontend reads its API base URL from `.env` (`VITE_API_BASE_URL`, defaults to `http://127.0.0.1:8000/api`).

Backend `.env` (`backend/.env`, copy from `backend/.env.example`) needs a MySQL database named `rosado_perfume`; see `backend/database/migrations` for schema and `backend/database/seeders` for seed data (matches the mock data 1:1, including the acceptance scenario: Woody Oud + 50 ML + Premium Glass + Classic Black = ₹449).

Seeded login accounts (email + password, both min 6 chars so they bypass the public 8-char register rule):

| Email | Password |
| --- | --- |
| `admin@rosado.test` | `123456` |
| `samir@rosado.test` | `123456` |

Both accounts are also flagged `is_admin` and can sign in to the **admin dashboard** at `http://127.0.0.1:8000/admin/login` (see section 8).

---

## 6. Backend architecture (as built)

```text
backend/
  app/Models/            Eloquent models -- string PKs for masters (SIZE50, FRG001, BTL002, ...)
  app/Http/Controllers/Api/  Thin controllers, one per resource
  app/Services/           CustomPerfumeValidator, ReadyMadePricer, CartQuoteService, OrderService
  app/Support/Presenters.php  Model -> camelCase JSON matching src/types/*.ts exactly
  app/Exceptions/ApiException.php  Uniform {message, code} error envelope
  database/migrations/    28 tables: masters, pivots, inventory, cart/order snapshot, auth
  database/seeders/       Seed data mirrors src/data/mocks/* 1:1
  routes/api.php          Full endpoint list from spec section 33 + auth/addresses/wishlist
```

**Server-authoritative rules enforced in `app/Services/`** (spec sections 34/51): price, stock, and bottle/cap size compatibility are always recalculated server-side; the frontend never sends a trusted final price. Orders persist a full snapshot (`order_items` has no FK to product/fragrance/bottle/cap masters) so later price changes never rewrite history.

Auth uses Laravel Sanctum personal-access tokens (Bearer header), not cookies, since the SPA and API run on different ports/dev servers.

## 7. Admin Dashboard (as built)

A hand-built (no Filament/Nova) Blade + Tailwind v4 admin panel, session-authenticated separately from the storefront's Sanctum API tokens.

- **URL:** `http://127.0.0.1:8000/admin/login`
- **Login:** `admin@rosado.test` / `123456` or `samir@rosado.test` / `123456` (both seeded with `is_admin = true`)
- Access is gated by an `EnsureUserIsAdmin` middleware (`is_admin` column on `users`); non-admin accounts are rejected at login.

```text
backend/
  app/Http/Controllers/Admin/   AuthController, DashboardController, one controller per resource
  app/Http/Middleware/EnsureUserIsAdmin.php
  resources/views/admin/        login, dashboard, and index/form views per resource
  resources/views/components/admin-layout.blade.php   sidebar + header shell
  resources/views/components/admin/                   field/select/textarea/page-header partials
  routes/web.php                admin/* routes (session guard, separate from routes/api.php)
```

Resources managed: **Products** (with inline sizes, images, and classification checkboxes), **Fragrances** (with notes + families/characters + per-size builder pricing), **Bottles**, **Caps** (each auto-syncs its inventory row), **Sizes**, **Classifications** (all 9 groups), **Coupons**, **Shipping Methods**, **Orders** (list/filter/detail/status update), **Customers** (list + promote/revoke admin).

Rebuild admin CSS/JS after editing anything under `backend/resources/`:

```bash
cd backend
npm install   # first time only
npm run build
```

(There's a `backend/postcss.config.js` that intentionally overrides the frontend's root `postcss.config.js` — without it, PostCSS's upward config search picks up the storefront's Tailwind v3 config and the admin build breaks.)

## 8. Future work

Deferred: Perfume Finder UI, live payment gateway, image upload (admin image fields are URL text inputs, not file upload), drag-and-drop note ordering.
