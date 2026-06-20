# Tasks: Auth Pages API Integration

**Input**: Design documents from `/specs/001-auth-api-integration/`

**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/auth-api.md ✓

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)

---

## Phase 1: Setup

**Purpose**: Environment configuration required for all API calls to work.

- [X] T001 Create `.env.local` at project root with `NEXT_PUBLIC_API_URL=https://test-back.yosrtech.com/api/v1/`

**Checkpoint**: `.env.local` exists with correct base URL.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Fix the shared `src/utils/index.js` API layer. All user stories depend on these methods being correct.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Update `baseURL` fallback in `src/utils/index.js` from `yousr.mangjornal.com/api/v1/` to `test-back.yosrtech.com/api/v1/`
- [X] T003 [P] Add `verifyToken` method to `ecommerceAPI.auth` in `src/utils/index.js`: `POST /auth/verify-token` with `{phone, token}` using `multipart/form-data`
- [X] T004 [P] Remove `verifyAccount` (wrong URL) and `resendVerificationAccount` (wrong URL) from `ecommerceAPI.auth` in `src/utils/index.js`

**Checkpoint**: `src/utils/index.js` has correct baseURL, `verifyToken` method added, broken methods removed. All existing callers of `verifyCode` and `resendVerificationCode` still work.

---

## Phase 3: User Story 1 — Login with Phone & Password (Priority: P1) 🎯 MVP

**Goal**: Clicking "تسجيل الدخول" in the sign-in modal calls the real API, stores the JWT, and updates AuthContext state.

**Independent Test**: Open the sign-in modal, enter valid credentials, confirm `localStorage.access_token` is set and navbar reflects authenticated state. Refresh the page — user remains logged in.

### Implementation for User Story 1

- [X] T005 [US1] Replace mock `login()` in `src/context/AuthContext.js` with real `ecommerceAPI.auth.login()` call: send `{phone, password, fcm_token: "", lang: getLocale(), type: "web"}`, extract `token` + `user` from `response.data.data`, call `ecommerceAPI.setAuthToken(token)`, dispatch `LOGIN_SUCCESS` with user
- [X] T006 [US1] Add `initAuth()` async function in `src/context/AuthContext.js` that reads `localStorage.getItem("access_token")` and, if present, calls `ecommerceAPI.auth.getProfile()` to restore the user; dispatch `LOGIN_SUCCESS` on success or `LOGOUT_SUCCESS` on 401
- [X] T007 [US1] Add `useEffect(() => { initAuth(); }, [])` inside `AuthProvider` in `src/context/AuthContext.js` to restore session on page load
- [X] T008 [US1] Add error handling in `login()` in `src/context/AuthContext.js`: catch block must dispatch `SET_LOADING(false)` and call `toast.error(err?.data?.message || err?.message || "فشل تسجيل الدخول")`

**Checkpoint**: Login modal works end-to-end with real API. `localStorage.access_token` is set after login. Page refresh keeps user authenticated.

---

## Phase 4: User Story 2 — Register New Account (Priority: P1)

**Goal**: The create-account page calls `POST /auth/registration` and on success redirects to the verification-code page with the correct URL params. The verify-code page handles the registration flow and authenticates the user.

**Independent Test**: Visit `/ar/create-account`, fill valid details, confirm redirect to `/ar/verification-code?identifier=<phone>&flow=registration`. Enter OTP → confirm redirect to home with authenticated state.

### Implementation for User Story 2

- [X] T009 [US2] Replace mock `register()` in `src/context/AuthContext.js` with real `ecommerceAPI.auth.register()` call: send `{name, phone, password, password_confirmation}`, on success redirect to `/${getLocale()}/verification-code?identifier=${phone}&flow=registration`
- [X] T010 [US2] Add error handling in `register()` in `src/context/AuthContext.js`: catch block dispatches `SET_LOADING(false)` and calls `toast.error(err?.data?.message || err?.message || "فشل إنشاء الحساب")`
- [X] T011 [US2] Update `src/app/[locale]/verification-code/page.tsx` to read `flow`, `identifier`, and `phone` query params using `useSearchParams()` and `useLocale()` from `next-intl`
- [X] T012 [US2] Add guard in `src/app/[locale]/verification-code/page.tsx`: if `flow` is missing or both `identifier` and `phone` are empty, redirect back to appropriate page
- [X] T013 [US2] Replace hardcoded `"1234"` check in `handleComplete` in `src/app/[locale]/verification-code/page.tsx` with: when `flow === "registration"`, call `ecommerceAPI.auth.verifyCode(code, identifier)`, on success dispatch `LOGIN_SUCCESS` (store token + user) and redirect to home `/${locale}`
- [X] T014 [US2] Import `ecommerceAPI` from `@/utils` and `useRouter` from `next/navigation` in `src/app/[locale]/verification-code/page.tsx`
- [X] T015 [US2] Add `loading` state to `src/app/[locale]/verification-code/page.tsx` and disable OTP input while API call is in progress

**Checkpoint**: Full registration flow works end-to-end: create-account → verify-code → home (authenticated).

---

## Phase 5: User Story 3 — Forgot Password Flow (Priority: P2)

**Goal**: The 3-step forgot-password flow (forgot-password → verify-code → create-new-password) connects to the real API. The existing `create-new-password/page.tsx` already calls `ecommerceAPI.auth.resetPassword()` — only the first two steps need fixing.

**Independent Test**: Visit `/ar/forgot-password`, enter a registered phone, confirm redirect to `/ar/verification-code?phone=<phone>&flow=forgot-password`. Enter OTP → confirm redirect to `/ar/create-new-password?phone=<phone>&token=<otp>`. Enter new password → confirm redirect to sign-in.

### Implementation for User Story 3

- [X] T016 [US3] Add `forgotPassword(phone)` async method to `src/context/AuthContext.js` that calls `ecommerceAPI.auth.forgotPassword(phone)` and on success redirects to `/${getLocale()}/verification-code?phone=${phone}&flow=forgot-password`; error handling via `toast.error`
- [X] T017 [US3] Rewrite `handleSubmit` in `src/app/[locale]/forgot-password/page.tsx`: import `ecommerceAPI` from `@/utils` and `useRouter` from `next/navigation`; call `ecommerceAPI.auth.forgotPassword(phone)` directly; on success redirect to `/${locale}/verification-code?phone=${phone}&flow=forgot-password`
- [X] T018 [US3] Add `loading` state and disable submit button while API call is in progress in `src/app/[locale]/forgot-password/page.tsx`
- [X] T019 [US3] Remove the `sent` state and the two-panel success/form toggle in `src/app/[locale]/forgot-password/page.tsx` — redirect handles the success case now
- [X] T020 [US3] Add `flow === "forgot-password"` branch in `handleComplete` in `src/app/[locale]/verification-code/page.tsx`: call `ecommerceAPI.auth.verifyToken(phone, code)`, on success redirect to `/${locale}/create-new-password?phone=${phone}&token=${code}`

**Checkpoint**: Forgot-password 3-step flow works end-to-end with real API. `create-new-password/page.tsx` already works (no change needed there).

---

## Phase 6: User Story 4 — Logout (Priority: P2)

**Goal**: The logout action calls `POST /auth/logout`, clears all stored tokens, and resets the auth state.

**Independent Test**: Log in, then trigger logout. Confirm `localStorage.access_token` is cleared, navbar reflects logged-out state, and `AuthContext.isAuthenticated` is false.

### Implementation for User Story 4

- [X] T021 [US4] Replace mock `logout()` in `src/context/AuthContext.js` with real implementation: wrap `ecommerceAPI.auth.logout()` in try/catch (always clears regardless), then call `ecommerceAPI.clearAuth()`, dispatch `LOGOUT_SUCCESS`, redirect to `/${getLocale()}`

**Checkpoint**: Logout clears token and resets auth state even if the API call fails.

---

## Phase 7: User Story 5 — Resend Verification Code (Priority: P3)

**Goal**: The "إعادة الإرسال" button on the verify-code page calls the correct resend endpoint based on the active flow.

**Independent Test**: Reach the verify-code page via either registration or forgot-password flow, click resend, confirm the correct API call fires in the Network tab.

### Implementation for User Story 5

- [X] T022 [US5] Replace stub `onClick` on "إعادة الإرسال" button in `src/app/[locale]/verification-code/page.tsx` with `handleResend` function: when `flow === "registration"` call `ecommerceAPI.auth.resendVerificationCode(identifier)`; when `flow === "forgot-password"` call `ecommerceAPI.auth.forgotPassword(phone)`; show success toast on resolve

**Checkpoint**: Resend button fires correct endpoint for each flow and shows feedback to user.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation across all stories.

- [X] T023 [P] Verify `ecommerceAPI.auth.register()` in `src/utils/index.js` sends `Content-Type: multipart/form-data` and explicitly unsets the `Authorization` header (matches login — already done, confirm no regression)
- [X] T024 [P] Verify `ecommerceAPI.auth.login()` in `src/utils/index.js` sends `fcm_token`, `lang`, `type` fields (check method signature accepts them from the new AuthContext call)
- [X] T025 [P] Update `updateProfile()` in `src/context/AuthContext.js` to call `ecommerceAPI.auth.updateProfile(userData)` and dispatch `UPDATE_USER` with the returned user data (replaces the current local-only dispatch)
- [ ] T026 Run all 5 validation scenarios from `specs/001-auth-api-integration/quickstart.md` in the browser

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **User Stories (Phases 3–7)**: All depend on Phase 2 completion
  - US1 (Phase 3) and US2 (Phase 4) are both P1 and can be parallelized by two developers
  - US3 (Phase 5) depends on Phase 2 only
  - US4 (Phase 6) is a single-task phase, can be done anytime after Phase 2
  - US5 (Phase 7) depends on Phase 4 (verification-code page already updated)
- **Polish (Phase 8)**: Depends on all story phases complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 only — fully independent
- **US2 (P1)**: After Phase 2 only — shares `verification-code/page.tsx` with US3 but can be done first (US3 adds the forgot-password branch)
- **US3 (P2)**: After Phase 2; best done after US2 since both edit `verification-code/page.tsx`
- **US4 (P2)**: After Phase 2 only — fully independent (single file, single method)
- **US5 (P3)**: After US2 (verification-code page must have `flow` param reading in place)

### Parallel Opportunities Within Each Story

**Phase 2 (Foundational)**: T003 and T004 are independent file edits within `utils/index.js` — conceptually parallel but same file so do sequentially.

**Phase 3 (US1)**: T005, T006, T007, T008 must be sequential — all edit `AuthContext.js` and depend on each other.

**Phase 4 (US2)**: T009–T010 (`AuthContext.js`) can be done in parallel with T011–T015 (`verification-code/page.tsx`) if two developers are working.

---

## Parallel Example: US2 with Two Developers

```
Developer A (AuthContext.js):
  T009 → T010

Developer B (verification-code/page.tsx):
  T011 → T012 → T013 → T014 → T015
```

Both branches are needed for the story to be fully testable.

---

## Implementation Strategy

### MVP (User Story 1 Only — Login)

1. T001 (env)
2. T002–T004 (fix utils)
3. T005–T008 (login in AuthContext)
4. **Validate**: Login modal works, token stored, refresh keeps session

### Incremental Delivery

1. Phase 1 + 2 → API layer ready
2. Phase 3 (US1) → Login working ✓
3. Phase 4 (US2) → Register + verify working ✓
4. Phase 5 (US3) → Forgot password working ✓
5. Phase 6 (US4) → Logout working ✓
6. Phase 7 (US5) → Resend code working ✓
7. Phase 8 → Polish + full quickstart validation

---

## Notes

- No new files needed — all changes are in existing files
- No new dependencies — `ecommerceAPI` and `react-toastify` already installed
- The `create-new-password/page.tsx` already calls `ecommerceAPI.auth.resetPassword()` and works correctly — do not modify
- The `sign-in/index.tsx` already delegates to `useAuth().login()` — will work after T005
- The `create-account/page.jsx` already delegates to `useAuth().register()` — will work after T009
- `[P]` tasks = conceptually parallel (different concerns), but most edits are in the same file so do sequentially
- Run `npm run dev` after each phase checkpoint and verify in the browser
