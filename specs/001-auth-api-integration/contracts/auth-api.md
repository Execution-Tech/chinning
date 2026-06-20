# Auth API Contract

**Base URL**: `https://test-back.yosrtech.com/api/v1/`
**Content-Type**: `multipart/form-data` (login, register); `application/json` (profile, me)
**Auth**: `Authorization: Bearer <access_token>` where required

---

## POST `/auth/login`

**Auth required**: No

**Request body** (form-data):
```
phone             string  required  e.g. "01094797959"
password          string  required
fcm_token         string  optional  "" if no push notifications
lang              string  optional  "ar" | "en"
type              string  optional  "web"
```

**Success response** (200):
```json
{
  "status": true,
  "data": {
    "token": "<jwt>",
    "user": {
      "id": 14,
      "name": "Ahmed",
      "phone": "01094797959",
      "email": null,
      "image": null
    }
  }
}
```

**Error response** (422 / 401):
```json
{ "message": "بيانات غير صحيحة" }
```

---

## POST `/auth/registration`

**Auth required**: No

**Request body** (form-data):
```
name                  string  required
phone                 string  required
password              string  required
password_confirmation string  required
```

**Success response** (201):
```json
{
  "status": true,
  "message": "تم إرسال رمز التحقق",
  "data": { "identifier": "01094797959" }
}
```

---

## POST `/auth/logout`

**Auth required**: Yes (Bearer token)

**Success response** (200):
```json
{ "status": true, "message": "تم تسجيل الخروج" }
```

---

## POST `/auth/forgot-password`

**Auth required**: No

**Request body** (form-data):
```
phone  string  required
```

**Success response** (200):
```json
{ "status": true, "message": "تم إرسال رمز التحقق" }
```

---

## POST `/auth/verify-token`

**Auth required**: No — used to verify OTP for password reset

**Request body** (form-data):
```
phone  string  required
token  string  required  (OTP code)
```

**Success response** (200):
```json
{ "status": true, "message": "تم التحقق" }
```

---

## POST `/auth/reset-password`

**Auth required**: No

**Request body** (form-data):
```
phone                 string  required
token                 string  required  (OTP code verified in previous step)
password              string  required
password_confirmation string  required
```

**Success response** (200):
```json
{ "status": true, "message": "تم تغيير كلمة المرور" }
```

---

## POST `/auth/verify-code`

**Auth required**: No — used to verify phone after registration

**Request body** (form-data):
```
identifier  string  required  (phone number)
code        string  required  (OTP code)
```

**Success response** (200):
```json
{
  "status": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": 14, "name": "Ahmed", ... }
  }
}
```

---

## POST `/auth/resend-code`

**Auth required**: No

**Request body** (form-data):
```
identifier  string  required
```

**Success response** (200):
```json
{ "status": true, "message": "تم إعادة إرسال الرمز" }
```

---

## GET `/auth/me`

**Auth required**: Yes (Bearer token)

**Success response** (200):
```json
{
  "status": true,
  "data": {
    "id": 14,
    "name": "Ahmed",
    "phone": "01094797959",
    "email": null,
    "image": null
  }
}
```

**Error response** (401): token invalid/expired → axios interceptor clears localStorage and redirects.

---

## POST `/auth/update-profile`

**Auth required**: Yes (Bearer token)

**Request body** (form-data):
```
name   string  optional
phone  string  optional
email  string  optional
```

**Success response** (200):
```json
{ "status": true, "data": { "id": 14, "name": "...", ... } }
```

---

## Notes for `src/utils/index.js` Fixes

The following methods need to be added or corrected:

```js
// ADD: verifyToken for forgot-password OTP step
verifyToken: (phone, token) =>
  apiClient.post("/auth/verify-token", { phone, token }),

// FIX: verifyAccount → wrong path, remove it; verifyCode is correct
// REMOVE: verifyAccount (wrong URL /auth/verify-account)
// REMOVE: resendVerificationAccount (wrong URL /auth/resend-verify-account)
// KEEP: verifyCode (correct URL /auth/verify-code) — update signature to match (identifier, code)
// KEEP: resendVerificationCode (correct URL /auth/resend-code)
```
