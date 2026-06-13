# Feature Specification: Auth Pages API Integration

**Feature Branch**: `001-auth-api-integration`

**Created**: 2026-06-13

**Status**: Draft

**Input**: Connect all auth pages (login, register, forgot-password, verify-code, reset-password) to the real backend API at `https://test-back.yosrtech.com/api/v1/`

## User Scenarios & Testing

### User Story 1 - Login with Phone & Password (Priority: P1)

A returning user enters their phone number and password in the sign-in modal and, upon success, is authenticated, their token is stored, and the UI reflects the logged-in state.

**Why this priority**: Login is the most fundamental auth action. All authenticated features depend on it.

**Independent Test**: Can be tested by opening the sign-in modal, entering valid credentials, and confirming the navbar shows the user's name and cart is accessible.

**Acceptance Scenarios**:

1. **Given** a registered user, **When** they submit valid phone + password in the sign-in modal, **Then** a JWT token is stored in localStorage (`access_token`), AuthContext `isAuthenticated` becomes `true`, and the user is shown as logged in.
2. **Given** the sign-in modal is open, **When** the user submits invalid credentials, **Then** the API error message is displayed via toast and the form remains open.
3. **Given** a successful login, **When** the page is refreshed, **Then** the user remains authenticated (token persisted in localStorage).

---

### User Story 2 - Register New Account (Priority: P1)

A new user fills in name, phone, password, and optionally email, submits the registration form, and is redirected to the verification-code page to confirm their phone number.

**Why this priority**: Registration is the entry point for new users; the app has no value without an account.

**Independent Test**: Can be tested by visiting `/create-account`, filling valid data, and confirming redirect to `/verification-code?identifier=<phone>&flow=registration`.

**Acceptance Scenarios**:

1. **Given** a new user on `/create-account`, **When** they submit a valid name, phone, and password, **Then** `POST /auth/registration` is called and on success they are redirected to the verification-code page with `identifier` and `flow=registration` in the URL.
2. **Given** the registration form is submitted, **When** the phone is already registered, **Then** the API error ("phone already taken") is shown via toast.
3. **Given** the registration call succeeds, **When** the user lands on the verification-code page, **Then** the page detects `flow=registration` and calls `POST /auth/verify-code` on OTP submit.

---

### User Story 3 - Forgot Password Flow (Priority: P2)

A user who forgot their password enters their phone, receives an OTP, enters the OTP on the verify-code page, then sets a new password on the create-new-password page.

**Why this priority**: Required for self-service account recovery; depends on login being implemented first.

**Independent Test**: Can be tested end-to-end: forgot-password → verify-code?flow=forgot-password → create-new-password.

**Acceptance Scenarios**:

1. **Given** the user is on `/forgot-password`, **When** they submit a valid phone, **Then** `POST /auth/forgot-password` is called and on success they are redirected to `/verification-code?phone=<phone>&flow=forgot-password`.
2. **Given** the verify-code page with `flow=forgot-password`, **When** the user enters the OTP, **Then** `POST /auth/verify-token` is called; on success redirect to `/create-new-password?phone=<phone>&token=<otp>`.
3. **Given** the user is on `/create-new-password` with phone and token in URL, **When** they submit matching passwords, **Then** `POST /auth/reset-password` is called and on success they are redirected to sign-in.
4. **Given** the OTP entered is wrong, **When** the API returns an error, **Then** an error toast is shown and the OTP input is cleared.

---

### User Story 4 - Logout (Priority: P2)

An authenticated user can log out, which calls the API, clears the stored token, and resets the auth state.

**Why this priority**: Required for security and session management.

**Independent Test**: Can be tested by logging in, then clicking logout in the navbar/profile, and confirming `isAuthenticated` is false and `access_token` is removed from localStorage.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they trigger logout, **Then** `POST /auth/logout` is called, localStorage `access_token` is removed, and AuthContext resets to unauthenticated state.
2. **Given** the logout API call fails, **Then** local state is still cleared (fail-safe logout).

---

### User Story 5 - Resend Verification Code (Priority: P3)

On the verification-code page, the user can request a new OTP if the previous one expired.

**Why this priority**: Nice-to-have for UX; requires registration and forgot-password flows first.

**Independent Test**: Can be tested by reaching the verify-code page and clicking the resend button, checking the toast and the API call.

**Acceptance Scenarios**:

1. **Given** the user is on the verify-code page, **When** they click "إعادة الإرسال", **Then** the appropriate resend endpoint is called based on `flow` param (`POST /auth/resend-code` for registration, `POST /auth/forgot-password` for password reset).
2. **Given** the resend call succeeds, **Then** a success toast is shown.

---

### Edge Cases

- What happens when the token in localStorage is expired? → 401 interceptor in `utils/index.js` already clears tokens and redirects.
- How does the verify-code page know which flow it's in? → URL param `flow` (values: `registration` | `forgot-password`).
- What if the user navigates directly to `/verification-code` without a phone/identifier? → Redirect back to the relevant starting page.
- What if the API base URL changes? → Controlled by `NEXT_PUBLIC_API_URL` env variable.

## Requirements

### Functional Requirements

- **FR-001**: System MUST call `POST /auth/login` with `{phone, password, fcm_token, lang, type}` on sign-in form submit and store the returned JWT in `localStorage` as `access_token`.
- **FR-002**: System MUST call `POST /auth/registration` with `{name, phone, password, password_confirmation}` on create-account form submit.
- **FR-003**: System MUST redirect to `/verification-code?identifier=<phone>&flow=registration` after successful registration.
- **FR-004**: System MUST call `POST /auth/forgot-password` with `{phone}` on forgot-password form submit.
- **FR-005**: System MUST redirect to `/verification-code?phone=<phone>&flow=forgot-password` after successful forgot-password call.
- **FR-006**: System MUST call `POST /auth/verify-code` with `{identifier, code}` on OTP submit when `flow=registration`.
- **FR-007**: System MUST call `POST /auth/verify-token` with `{phone, token}` on OTP submit when `flow=forgot-password`, then redirect to `/create-new-password?phone=<phone>&token=<otp>`.
- **FR-008**: System MUST call `POST /auth/reset-password` with `{phone, token, password, password_confirmation}` on create-new-password form submit.
- **FR-009**: System MUST call `POST /auth/logout` when user logs out and clear localStorage tokens.
- **FR-010**: System MUST update `AuthContext` (`isAuthenticated`, `user`) from the real API response on login.
- **FR-011**: System MUST persist auth token in `localStorage` as `access_token` and restore auth state from it on page load.
- **FR-012**: System MUST show API error messages via `react-toastify` on all auth failures.

### Key Entities

- **User**: Represents the authenticated user — fields: `id`, `name`, `phone`, `email`, `image`
- **AuthToken**: JWT stored in localStorage as `access_token`; used in `Authorization: Bearer <token>` header
- **OTP/Code**: 4-6 digit numeric code sent to user's phone via SMS for verification

## Success Criteria

### Measurable Outcomes

- **SC-001**: A user can complete login in under 5 seconds on a standard connection (real API call + state update + UI refresh).
- **SC-002**: All 5 auth flows (login, register, forgot-password, verify-code, reset-password) make the correct API call with the correct payload as defined in the Postman collection.
- **SC-003**: After login, refreshing the page keeps the user authenticated (token persisted and read on mount).
- **SC-004**: No mock/stub code remains in `AuthContext.js` — all methods call `ecommerceAPI.auth.*`.
- **SC-005**: API error messages from the backend (e.g., "رقم الهاتف غير صحيح") are surfaced to the user via toast, not swallowed.

## Assumptions

- The backend is live and reachable at `https://test-back.yosrtech.com/api/v1/`.
- The `ecommerceAPI` axios client in `src/utils/index.js` is the single API layer — no new HTTP client is introduced.
- Token storage uses `localStorage` only (no cookies for SSR — this is a client-side app).
- The `fcm_token` field in login/register is optional and can be sent as an empty string or omitted; the app does not implement push notifications now.
- The `lang` field in login is set from the current locale (`getLocale()`), and `type` is always `"web"`.
- Verification code is 4 digits (matching the existing `OtpInput length={4}` UI component).
- No i18n changes are needed for new strings — existing Arabic strings in pages cover the flows.
