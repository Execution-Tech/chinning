# Research: Auth Pages API Integration

## API Endpoint Mapping

**Decision**: Map each auth page to the exact Postman collection endpoints.
**Rationale**: Direct 1:1 mapping avoids ambiguity; all endpoints confirmed from `chinning.postman_collection.json`.
**Alternatives considered**: Building an abstraction layer — rejected; the `ecommerceAPI.auth.*` object in `src/utils/index.js` already serves this role.

### Confirmed Endpoints (base: `https://test-back.yosrtech.com/api/v1/`)

| Flow | Method | Path | Body fields |
|------|--------|------|-------------|
| Login | POST | `auth/login` | phone, password, fcm_token, lang, type |
| Register | POST | `auth/registration` | name, phone, password, password_confirmation |
| Logout | POST | `auth/logout` | — (requires Bearer token) |
| Forgot Password | POST | `auth/forgot-password` | phone |
| Verify Token (reset) | POST | `auth/verify-token` | phone, token |
| Reset Password | POST | `auth/reset-password` | phone, token, password, password_confirmation |
| Verify Code (registration) | POST | `auth/verify-code` | identifier, code |
| Resend Code | POST | `auth/resend-code` | identifier |
| Get Profile | GET | `auth/me` | — (requires Bearer token) |
| Update Profile | POST | `auth/update-profile` | name, phone, email |

---

## Bug: Incorrect Endpoint URLs in `src/utils/index.js`

**Decision**: Fix two wrong endpoint paths in `ecommerceAPI.auth`.
**Rationale**: Current utils has `verifyAccount → /auth/verify-account` and `resendVerificationAccount → /auth/resend-verify-account`. Postman shows correct paths are `/auth/verify-code` and `/auth/resend-code`.
**How to apply**: Update `verifyCode` method to use the correct path; the method already exists but was not wired to pages. Add `verifyToken` method for forgot-password flow.

### Discrepancies found:

| Method in utils | Current URL | Correct URL (from Postman) |
|-----------------|-------------|---------------------------|
| `verifyAccount` | `/auth/verify-account` | `/auth/verify-code` |
| `resendVerificationAccount` | `/auth/resend-verify-account` | `/auth/resend-code` |
| `verifyCode` | `/auth/verify-code` ✓ | `/auth/verify-code` ✓ |
| `resetPassword` | `/auth/reset-password` ✓ | `/auth/reset-password` ✓ |
| Missing | — | `/auth/verify-token` (for forgot-password OTP check) |

---

## Token Storage Strategy

**Decision**: Store JWT in `localStorage` as `access_token`. Restore on AuthContext mount via `localStorage.getItem("access_token")`.
**Rationale**: The app is client-side rendered (Next.js App Router with `"use client"`). The existing axios interceptor already reads `access_token` from localStorage. No SSR auth is needed.
**Alternatives considered**: HttpOnly cookies — rejected; requires server-side middleware and the existing codebase is fully client-side.

---

## AuthContext Initialization (Hydration)

**Decision**: On `AuthProvider` mount, read `access_token` from localStorage and call `GET /auth/me` to restore user state.
**Rationale**: Without this, a page refresh always shows the user as logged out even though the token is valid.
**Alternatives considered**: Storing full user object in localStorage — rejected; stale user data risk. Better to re-fetch profile from API using the stored token.

---

## Verification Code Flow Disambiguation

**Decision**: Use a `flow` URL query param to distinguish registration vs. forgot-password on the verify-code page.
**Values**:
- `flow=registration` → calls `POST /auth/verify-code` with `{identifier, code}`
- `flow=forgot-password` → calls `POST /auth/verify-token` with `{phone, token}`

**Rationale**: The verify-code page is shared between two distinct flows; the query param is the cleanest signal without duplicating the OTP UI.
**Alternatives considered**: Two separate pages — rejected; the UI is identical.

---

## `fcm_token`, `lang`, `type` in Login/Register

**Decision**: Send `fcm_token: ""`, `lang: getLocale()`, `type: "web"` in login and register API calls.
**Rationale**: These fields appear in the Postman collection. The app does not implement Firebase push notifications, so `fcm_token` is an empty string. `lang` is derived from the URL locale, `type` is always `"web"` for this Next.js frontend.
**Alternatives considered**: Omitting these fields — may cause validation errors on some API versions.

---

## Error Handling Pattern

**Decision**: All catch blocks in AuthContext actions extract `err?.data?.message || err?.message || "حدث خطأ"` and surface via `toast.error()`.
**Rationale**: The axios response interceptor in `utils/index.js` already formats errors as `{ message, status, data }`, so the pattern is consistent with `create-new-password/page.tsx` (already implemented).
**Alternatives considered**: Throwing errors to page components — rejected; AuthContext is the right layer for auth error handling since the same context is used by multiple pages.
