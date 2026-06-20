# Quickstart: Validate Auth API Integration

## Prerequisites

- Node.js 18+
- `npm install` done
- Backend live at `https://test-back.yosrtech.com/api/v1/`
- `.env.local` contains `NEXT_PUBLIC_API_URL=https://test-back.yosrtech.com/api/v1/`

## Start Dev Server

```bash
npm run dev
# Open http://localhost:3000/ar
```

---

## Validation Scenarios

### 1. Login Flow

1. Click the cart icon or any protected action → sign-in modal opens.
2. Enter a valid phone + password.
3. Submit → toast "تم تسجيل الدخول بنجاح" appears, modal closes, navbar shows user name.
4. Open DevTools → `localStorage.access_token` should contain a JWT.
5. Refresh page → user remains logged in (AuthContext restores from token via `GET /auth/me`).

**Test error path**: Enter wrong password → toast shows the API error message.

---

### 2. Register Flow

1. Navigate to `http://localhost:3000/ar/create-account`.
2. Fill in: name, phone (use a fresh number), password, password_confirmation.
3. Submit → `POST /auth/registration` fires (check Network tab).
4. On success → redirected to `/ar/verification-code?identifier=<phone>&flow=registration`.
5. Enter the 4-digit OTP received on the phone.
6. Submit → `POST /auth/verify-code` fires; on success → redirected to home, user is authenticated.

---

### 3. Forgot Password Flow

1. Navigate to `http://localhost:3000/ar/forgot-password`.
2. Enter a registered phone number.
3. Submit → `POST /auth/forgot-password` fires.
4. On success → redirected to `/ar/verification-code?phone=<phone>&flow=forgot-password`.
5. Enter the OTP → `POST /auth/verify-token` fires.
6. On success → redirected to `/ar/create-new-password?phone=<phone>&token=<otp>`.
7. Enter and confirm new password → `POST /auth/reset-password` fires.
8. On success → redirected to home with sign-in modal.

---

### 4. Logout

1. Log in (scenario 1).
2. Navigate to profile or use the logout button in the navbar.
3. Click logout → `POST /auth/logout` fires.
4. `localStorage.access_token` is cleared.
5. Navbar reflects logged-out state.

---

### 5. Resend Code

1. Reach the verify-code page via registration or forgot-password flow.
2. Click "إعادة الإرسال".
3. Check Network tab: `POST /auth/resend-code` (registration) or `POST /auth/forgot-password` (forgot-password) is called.
4. Toast shows success message.

---

## Key Files Changed

See `contracts/auth-api.md` for endpoint specs and `data-model.md` for state shape.

| File | Change |
|------|--------|
| `src/context/AuthContext.js` | Replace all stubs with real `ecommerceAPI.auth.*` calls; add `initAuth()` on mount |
| `src/utils/index.js` | Add `verifyToken`; fix `verifyAccount`/`resendVerificationAccount` URLs |
| `src/app/[locale]/forgot-password/page.tsx` | Call `ecommerceAPI.auth.forgotPassword(phone)` instead of stub |
| `src/app/[locale]/verification-code/page.tsx` | Read `flow` param; call correct API per flow |
| `src/app/[locale]/create-account/page.jsx` | Already uses `register()` from context — no page change needed (context fix is sufficient) |
| `src/componant/sign-in/index.tsx` | Already uses `login()` from context — no page change needed |

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://test-back.yosrtech.com/api/v1/
```

The existing `src/utils/index.js` reads this with fallback to `https://yousr.mangjornal.com/api/v1/`. Update the fallback URL or ensure `.env.local` is set.
