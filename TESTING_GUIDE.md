# FedEx App - Complete Testing Guide

## ✅ Environment Setup

### Prerequisites
- Railway deployment with these env variables set:
  - `EMAIL_USER=fedex94688491@gmail.com`
  - `EMAIL_PASS=xeyh dhhw syjf kygj`
  - `EMAIL_HOST=smtp.gmail.com`
  - `EMAIL_PORT=587`
  - `EMAIL_FROM=fedex94688491@gmail.com`
  - `APP_URL=https://fedex-app-production.up.railway.app`
  - `MONGODB_URI=mongodb+srv://greatugbome5_db_user:Nigeria123%24@cluster0.yas9t3a.mongodb.net/fedex-app?retryWrites=true&w=majority`

---

## 🧪 Test Cases

### Test 1: Sign Up with New User
**Objective:** Verify new user registration and email sending

1. Go to: https://fedex-app-production.up.railway.app
2. Click "Sign Up" tab
3. Fill in:
   - Full Name: `Test User 123`
   - Email: `testuser123@example.com` (use unique email)
   - Phone: `+1-555-1234`
   - Password: `Password123`
   - Confirm Password: `Password123`
4. Click "Create Account"

**Expected Results:**
- ✅ Form validates input
- ✅ Success message: "Account created! Check your email..."
- ✅ Verification form appears with demo link
- ✅ Email sent to testuser123@example.com (check inbox)

**If email doesn't arrive:**
- Check spam folder
- Verify Railway variables set correctly
- Check server logs for email errors

---

### Test 2: Verify Email from Link
**Objective:** Test email verification via link

1. From Test 1, check email for verification link
2. Click the link in the email
3. Should redirect to: `https://fedex-app-production.up.railway.app/verify?token=...`

**Expected Results:**
- ✅ Success toast: "✅ Email verified!"
- ✅ Auto-redirected to login
- ✅ Email pre-filled in login form

**Alternative: Use Demo Link**
- In verification form, click "Click here to verify" link
- Should verify account instantly

---

### Test 3: Log In with New Account
**Objective:** Test user login after verification

1. From Test 2, in Login tab enter:
   - Email: `testuser123@example.com`
   - Password: `Password123`
2. Click "Log In"

**Expected Results:**
- ✅ Success message: "✅ Welcome, Test User 123!"
- ✅ Modal closes
- ✅ User account button appears (top-right)
- ✅ Shows user name

---

### Test 4: Admin Console Login
**Objective:** Test hardcoded admin access

1. Go to: https://fedex-app-production.up.railway.app
2. Click "Log In" tab
3. Enter:
   - Email: `Admin`
   - Password: `Admin123`
4. Click "Log In"

**Expected Results:**
- ✅ Admin console opens
- ✅ Shows "Admin" badge
- ✅ Can access shipments, users, locations tabs
- ✅ Can create/edit/delete shipments

---

### Test 5: Create and Track Shipment
**Objective:** Test shipment creation and cross-device tracking

1. In Admin Console, click "Shipments" tab
2. Click "New Shipment" button
3. Fill in shipment details (tracking ID, service, etc.)
4. Click "Save"

**Expected Results:**
- ✅ Shipment appears in table
- ✅ Can see copy link icon (🔗) next to tracking ID
- ✅ Click icon copies tracking link to clipboard

---

### Test 6: Copy Tracking Link
**Objective:** Test shareable tracking link functionality

1. From Test 5, in admin shipments table
2. Find the shipment you created
3. Click the purple link icon (🔗)

**Expected Results:**
- ✅ Toast shows: "✅ Tracking link copied!"
- ✅ Link looks like: `https://fedex-app-production.up.railway.app?trackingId=ABC123`
- ✅ Can paste this link to users

---

### Test 7: Track Shipment as User (Public)
**Objective:** Test public shipment tracking

1. From Test 6, use the copied tracking link
2. Open link in new tab/window
3. Should auto-populate tracking search

**Expected Results:**
- ✅ Tracking ID auto-populated in search
- ✅ Can see shipment details
- ✅ Can see location map
- ✅ Can see status and history

---

### Test 8: Validation Errors
**Objective:** Test form validation

**Test 8a: Sign Up - Empty Fields**
- Try signing up without filling fields
- Expected: Error messages for each required field

**Test 8b: Sign Up - Password Mismatch**
- Fill signup but passwords don't match
- Expected: Error: "Passwords don't match"

**Test 8c: Sign Up - Short Password**
- Fill signup with password `123`
- Expected: Error: "Password must be at least 6 characters"

**Test 8d: Sign Up - Invalid Email**
- Try email `invalid-email`
- Expected: Error: "Please enter a valid email address"

**Test 8e: Login - Unverified Account**
- Try logging in with account not yet verified
- Expected: Error: "Please verify your email first"

---

### Test 9: Duplicate Email Signup
**Objective:** Test duplicate email handling

1. Sign up with email: `duplicate@test.com`
2. Verify and logout
3. Try signing up again with same email

**Expected Results:**
- ✅ Error: "This email is already registered. Please log in instead."

---

### Test 10: Cross-Device Tracking
**Objective:** Test MongoDB persistence

1. Create shipment on one device (Admin)
2. Track it from another device/browser (Public link)

**Expected Results:**
- ✅ Shipment visible on both
- ✅ Updates sync in real-time (check sync indicator)
- ✅ Database shows same data

---

## 🔍 Error Scenarios to Test

### Email Issues
- [ ] Email service down → Error logged, user notified
- [ ] Invalid Gmail credentials → Fallback message shown
- [ ] Email already registered → Clear error message

### API Issues
- [ ] Network error → Toast: "Connection error"
- [ ] Invalid token → Error page shown
- [ ] Missing env variables → Graceful fallback

### CORS Issues
- [ ] API call blocked → Check browser console for CSP error
- [ ] Should NOT see: "Refused to connect"

### Data Issues
- [ ] MongoDB connection lost → Error logged
- [ ] Invalid user data → Validation error shown

---

## 📋 Final Verification Checklist

### Backend (server.js)
- [ ] All API endpoints respond with correct status codes
- [ ] CORS allows Railway domains
- [ ] Email service connects successfully
- [ ] MongoDB connection works
- [ ] Verification tokens expire after 24 hours
- [ ] Passwords not stored as plaintext (TODO: Hash passwords)

### Frontend (index.html)
- [ ] Sign up form validates input
- [ ] Login calls /api/auth/login for API users
- [ ] Login still supports hardcoded Admin account
- [ ] Verification form appears after signup
- [ ] Email link auto-verifies account
- [ ] All buttons and modals work correctly
- [ ] Mobile responsive

### Database (MongoDB)
- [ ] Users collection created
- [ ] Shipments collection created
- [ ] User verification working
- [ ] Data persisting across sessions

### Security
- [ ] Email credentials not in code (env variables only)
- [ ] CSP headers protecting from XSS
- [ ] CORS whitelist only production domains
- [ ] No console errors on production

---

## 🚀 Deployment Verification

Before calling complete, verify:

1. ✅ Signup/Login flow works end-to-end
2. ✅ Emails are sent and received
3. ✅ Verification links work
4. ✅ Admin can create shipments
5. ✅ Public users can track
6. ✅ Copy link feature works
7. ✅ No console errors
8. ✅ No CSP violations
9. ✅ CORS allows all needed domains
10. ✅ Database shows correct data

---

## 📞 Support

If any test fails:

1. Check browser console (F12) for errors
2. Check server logs on Railway dashboard
3. Verify environment variables are set
4. Check email inbox/spam folder
5. Clear browser cache and retry

