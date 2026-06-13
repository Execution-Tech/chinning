# Data Model: Auth API Integration

## Entities

### AuthState (in-memory, React context)

Managed by `AuthContext.js` via `useReducer`.

| Field | Type | Description |
|-------|------|-------------|
| `isAuthenticated` | `boolean` | `true` when a valid token exists and user is loaded |
| `user` | `User \| null` | Current user profile; null when logged out |
| `isLoading` | `boolean` | `true` during any async auth operation |
| `error` | `string \| null` | Last error message (optional, currently unused) |

**Initialization**: On `AuthProvider` mount → read `access_token` from localStorage → if present, call `GET /auth/me` → populate `user`.

**State Transitions**:
```
LOGGED_OUT ──login/register──► LOADING ──success──► AUTHENTICATED
AUTHENTICATED ──logout──► LOGGED_OUT
LOADING ──error──► LOGGED_OUT (error toast shown)
AUTHENTICATED ──token_expired(401)──► LOGGED_OUT (axios interceptor clears token)
```

---

### User (API response)

Returned by `POST /auth/login` and `GET /auth/me`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number` | ✓ | Unique user identifier |
| `name` | `string` | ✓ | Display name |
| `phone` | `string` | ✓ | Phone number (used as login identifier) |
| `email` | `string \| null` | — | Optional email |
| `image` | `string \| null` | — | Profile image URL |

**Source**: `response.data.data.user` or `response.data.user` (verify with live API response shape).

---

### AuthToken (localStorage)

| Key | Value |
|-----|-------|
| `access_token` | JWT string, e.g. `eyJ0eXAiOiJKV1QiLCJhbGci...` |

**Written by**: `ecommerceAPI.setAuthToken(token)` in AuthContext after login.
**Read by**: Axios request interceptor in `src/utils/index.js` (sets `Authorization: Bearer <token>`).
**Cleared by**: `ecommerceAPI.clearAuth()` in AuthContext logout action.

---

### OTP/VerificationCode (transient, URL param)

Not stored persistently. Passed between pages via URL query params.

| Param | Page | Description |
|-------|------|-------------|
| `phone` | forgot-password → verify-code | Phone number for OTP target |
| `identifier` | registration → verify-code | Phone number as identifier |
| `flow` | verify-code | `"registration"` or `"forgot-password"` |
| `token` | verify-code → create-new-password | OTP code used to authorize password reset |

**Validation rules**:
- Code is 4-6 digits (current UI uses `length={4}`)
- `identifier` / `phone` must be non-empty; if missing on verify-code page → redirect back

---

## Actions (AuthContext methods)

| Method | API Call | Side Effects |
|--------|----------|-------------|
| `login(phone, password)` | `POST /auth/login` | setAuthToken, dispatch LOGIN_SUCCESS |
| `register(name, phone, password, email?)` | `POST /auth/registration` | redirect to verify-code?flow=registration |
| `logout()` | `POST /auth/logout` | clearAuth, dispatch LOGOUT_SUCCESS |
| `forgotPassword(phone)` | `POST /auth/forgot-password` | redirect to verify-code?flow=forgot-password |
| `verifyRegistration(identifier, code)` | `POST /auth/verify-code` | on success redirect to home |
| `verifyPasswordToken(phone, token)` | `POST /auth/verify-token` | on success redirect to create-new-password |
| `resetPassword(phone, token, password, confirmation)` | `POST /auth/reset-password` | on success redirect to sign-in |
| `resendCode(identifier)` | `POST /auth/resend-code` | toast success |
| `initAuth()` | `GET /auth/me` | dispatch LOGIN_SUCCESS if token valid |
| `updateProfile(data)` | `POST /auth/update-profile` | dispatch UPDATE_USER |
