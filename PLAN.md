# E-Commerce → Static Design Project — Master Plan

## Overview

Copy the existing `../e-commerce/` Next.js project here, strip all API/backend
integration, replace with static mock data, then update the UI to match the new
Figma design.

**Figma reference:** https://www.figma.com/design/W7cLOwFqBVdyWXzVNvWOga/canvas?node-id=9-38
*(screenshots needed — Figma requires login, cannot be fetched automatically)*

---

## Tech Stack (unchanged)

| Tool | Version |
|------|---------|
| Next.js | 15 (App Router + Turbopack) |
| TypeScript | 5 |
| Tailwind CSS | v4 |
| next-intl | 4 (i18n / locale routing) |
| Swiper | 11 |
| react-toastify | 11 |

**Removed:** `axios` (no longer needed after API strip)

---

## Phase 1 — Copy Project

- [ ] `rsync` source from `../e-commerce/` → `./` excluding `node_modules/` and `build/`
- [ ] Run `npm install` fresh
- [ ] Confirm `npm run dev` boots without errors

---

## Phase 2 — Remove API Integration

### 2.1 Delete the entire API utility layer
- [ ] Delete `src/utils/index.js` (axios client + `ecommerceAPI` object)
- [ ] Remove `axios` from `package.json`

### 2.2 Replace `AuthContext` with static mock
**File:** `src/context/AuthContext.js`

- [ ] Remove all `ecommerceAPI.auth.*` calls
- [ ] Replace with static state:
  - `isAuthenticated: false` by default
  - Mock user object available for UI preview
  - `login()` / `logout()` toggle state locally (no network)
  - `register()` is a no-op that shows a success toast

### 2.3 Replace `CartContext` with localStorage-based cart
**File:** `src/context/CartContext.js`

- [ ] Remove all `ecommerceAPI.cart.*` calls
- [ ] Use `localStorage` to persist cart items
- [ ] `addItem` / `removeItem` / `updateItemQuantity` work purely on local state
- [ ] Recalculate `total` client-side from item prices

---

## Phase 3 — Clean Up Pages & Components

### Files with API calls to fix:

| File | Action |
|------|--------|
| `src/app/[locale]/search/page.tsx` | Replace API fetch → hardcoded mock products array |
| `src/app/[locale]/product-overview/[id]/page.tsx` | Replace API fetch → static mock product data |
| `src/app/[locale]/shopping-carts/page.tsx` | Reads CartContext — ensure context is clean |
| `src/app/[locale]/checkout-forms/page.tsx` | Make form static (no submit API call, just toast) |
| `src/componant/sign-in/index.tsx` | Remove login API call — form stays, uses mock AuthContext |
| `src/componant/nav-bar.tsx` | Remove auth API dependency — use mock state from context |
| `src/componant/categories-icons/categories-icons.tsx` | Replace API fetch → static categories array |
| `src/componant/catgerories-slider/index.jsx` | Replace API fetch → static slides array |
| `src/componant/item-chip/index.tsx` | Replace API fetch → static data |
| `src/componant/search-filters/search-filters.tsx` | Make filters static |

### Mock data to create:
- [ ] `src/data/products.ts` — array of ~12 mock products (id, name, price, image, category, rating)
- [ ] `src/data/categories.ts` — array of ~8 mock categories
- [ ] `src/data/cart.ts` — empty initial cart shape

---

## Phase 4 — Design Update (Figma)

> **Status: PENDING — waiting for Figma screenshots**
>
> Once screenshots are provided, this section will be filled in with specific
> component-level design changes (colors, typography, layout, spacing, etc.)

### Sections to redesign (placeholders):

- [ ] **Navbar** — colors, logo position, search bar style, cart/auth buttons
- [ ] **Hero / Banner section** — layout, background, CTA button style
- [ ] **Categories section** — card style, icon treatment, grid layout
- [ ] **Product cards** — image ratio, badge style, price display, add-to-cart button
- [ ] **Search page** — filter sidebar, results grid, pagination
- [ ] **Product overview page** — image gallery, description layout, quantity selector
- [ ] **Shopping cart page** — item row layout, summary panel
- [ ] **Checkout forms** — form field style, step indicator (stepper), payment methods
- [ ] **Sign in / Create account pages** — form card style, input design
- [ ] **Footer** — columns layout, social icons, app store badges

### Design tokens to define (from Figma):
- [ ] Primary color
- [ ] Secondary / accent color
- [ ] Background color
- [ ] Text colors (heading, body, muted)
- [ ] Border radius scale
- [ ] Font family / sizes / weights
- [ ] Shadow styles

---

## Payment Methods Policy

**Supported payment methods — only two options:**

| Method | Details |
|--------|---------|
| **Cash on Delivery** | User selects cash, no gateway needed, order placed directly |
| **Paymob** | Card payment via Paymob gateway integration |

**Explicitly excluded:**
- ~~Installment plans~~ — not supported
- ~~Buy Now Pay Later (BNPL)~~ — not supported
- ~~Wallet payments (other than Paymob)~~ — not supported
- ~~Any other payment gateway~~ — Paymob only

### Checkout page impact:
- [ ] Show only two radio options: "Cash on Delivery" and "Pay with Card (Paymob)"
- [ ] Remove any installment / BNPL UI (if present in current design)
- [ ] Cash flow: submit order → show confirmation, no redirect
- [ ] Paymob flow: on submit → open Paymob payment iframe/redirect (static placeholder for now since API is stripped — just show a "Redirecting to Paymob..." toast)

---

## Phase 5 — Verify & Polish

- [ ] Run `npm run dev` — all pages render with no console errors
- [ ] Test navigation between all pages (locale routing works)
- [ ] Test cart add/remove/update (localStorage persists)
- [ ] Test auth toggle (sign in / sign out updates UI)
- [ ] Check mobile responsiveness
- [ ] Run `npm run build` — TypeScript compiles clean

---

## File Structure Reference

```
src/
├── app/
│   ├── favicon.ico
│   ├── globals.css           ← design tokens / global styles
│   ├── layout.tsx
│   ├── page.jsx
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── checkout-forms/page.tsx
│       ├── create-account/page.jsx
│       ├── forgot-password/page.tsx
│       ├── product-overview/[id]/page.tsx
│       ├── search/page.tsx
│       ├── shopping-carts/page.tsx
│       └── verification-code/page.tsx
├── componant/
│   ├── nav-bar.tsx
│   ├── footer/index.tsx
│   ├── sign-in/index.tsx
│   ├── stepper/index.tsx
│   ├── ToastProvider.tsx
│   ├── categories-icons/categories-icons.tsx
│   ├── catgerories-slider/index.jsx
│   ├── item-chip/index.tsx
│   └── search-filters/search-filters.tsx
├── context/
│   ├── AuthContext.js        ← Phase 2.2
│   ├── CartContext.js        ← Phase 2.3
│   └── index.js
├── data/                     ← NEW (Phase 3)
│   ├── products.ts
│   └── categories.ts
├── hooks/
│   └── useAuth.js
├── i18n/
│   ├── middleware.ts
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
└── utils/
    └── index.js              ← DELETED in Phase 2.1
```

---

## Notes

- Keep `next-intl` i18n fully intact — locale routing (`/en`, `/ar`) stays
- Keep `react-toastify` — used for visual feedback on form actions
- Keep `swiper` — used in category slider
- All design changes use **Tailwind CSS v4** utility classes only (no custom CSS files unless needed for animations)
- No feature flags, no backwards-compat shims — just clean static UI
