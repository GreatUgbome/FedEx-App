# API Configuration Guide

## 🔑 Firebase Configuration

### Step 1: Create Firebase Project
1. Visit https://console.firebase.google.com
2. Click "Add Project"
3. Enter project name (e.g., "fedex-tracking-app")
4. Click "Create Project"

### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Click "Anonymous" provider
4. Enable it and click "Save"

### Step 3: Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create Database"
3. Select "Start in production mode"
4. Choose your region (e.g., us-central1)

### Step 4: Update Security Rules
Replace default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read/write (demo only - add auth for production)
    match /shipments/{document=**} {
      allow read, write;
    }
    match /users/{document=**} {
      allow read, write;
    }
    match /locations/{document=**} {
      allow read, write;
    }
  }
}
```

### Step 5: Get Firebase Config
1. Go to **Project Settings** (gear icon)
2. Click "Your apps" section
3. Click "</>" to create web app
4. Copy the `firebaseConfig` object
5. Paste into index.html (around line 70)

**Example Firebase Config:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDKJ1lwRWQC3eHyWYbrx3WpdXCrnKT1yGs",
    authDomain: "fedex-37e89.firebaseapp.com",
    projectId: "fedex-37e89",
    storageBucket: "fedex-37e89.firebasestorage.app",
    messagingSenderId: "404051824308",
    appId: "1:404051824308:web:13c12e1d7302993648d1e1",
    measurementId: "G-7PWE0EMDVH"
};
```

---

## 📧 EmailJS Configuration

### Step 1: Create EmailJS Account
1. Visit https://www.emailjs.com/
2. Sign up and verify email
3. Go to Dashboard

### Step 2: Add Email Service
1. Click "Email Services"
2. Click "Connect new service"
3. Select "Gmail" or your email provider
4. Authorize the connection
5. Note your Service ID

**Service ID Format:**
```
service_7p0eqwj
```

### Step 3: Create Email Templates

#### Template 1: Shipment Status Update
1. Go to **Email Templates**
2. Click "Create New Template"
3. Set name: `template_p1hhlhk`
4. Add variables:
   - `{{to_email}}`
   - `{{tracking_id}}`
   - `{{new_status}}`

**Template Body Example:**
```
Subject: Shipment {{tracking_id}} - Status Update

Dear Customer,

Your shipment {{tracking_id}} has been {{new_status}}.

Please log in to your account to track your package.

Best regards,
FedEx Team
```

#### Template 2: New Shipment Confirmation
1. Create new template
2. Set name: `template_n7wa86z`
3. Add variables:
   - `{{to_email}}`
   - `{{tracking_id}}`
   - `{{recipient_name}}`
   - `{{service_type}}`

**Template Body Example:**
```
Subject: Shipment Confirmation - {{tracking_id}}

Dear {{recipient_name}},

Your shipment has been created via {{service_type}}.

Tracking Number: {{tracking_id}}

Start tracking: [app-url]/track/{{tracking_id}}

Best regards,
FedEx Team
```

### Step 4: Get EmailJS Credentials
1. Go to **Account** > **API Keys**
2. Copy Public Key
3. Note Service ID and Template IDs

**Update in index.html (around line 800):**
```javascript
const serviceID = "service_7p0eqwj";
const templateID = "template_p1hhlhk";
const publicKey = "C4BuGocvCyDxwschP";
```

---

## 🗺️  Google Maps Configuration

### Step 1: Create Google Cloud Project
1. Visit https://console.cloud.google.com
2. Create new project
3. Name it "FedEx Tracking"

### Step 2: Enable Maps API
1. Go to **APIs & Services** > **Library**
2. Search "Maps JavaScript API"
3. Click "Enable"

### Step 3: Create API Key
1. Go to **Credentials**
2. Click "Create Credentials" > "API Key"
3. Copy the key

### Step 4: Set API Key Restrictions (Optional but Recommended)
1. Click on your API key
2. Go to **Application restrictions**
3. Select "HTTP referrers (websites)"
4. Add your domain

**Update in index.html (line 10):**
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
```

Replace `YOUR_API_KEY` with your actual key.

---

## ✅ Verification Checklist

### Firebase
- [ ] Firebase project created
- [ ] Authentication enabled (Anonymous)
- [ ] Firestore database created
- [ ] Security rules updated
- [ ] Config pasted in index.html
- [ ] Collections created (shipments, users, locations)

### EmailJS
- [ ] EmailJS account created
- [ ] Email service connected
- [ ] 2 email templates created
- [ ] Service ID added to index.html
- [ ] Template IDs added to index.html
- [ ] Public Key added to index.html

### Google Maps
- [ ] Google Cloud project created
- [ ] Maps API enabled
- [ ] API key created
- [ ] API key added to index.html

---

## 🧪 Testing

### Test Firebase Connection
1. Open browser console (F12)
2. You should see: "Connected to Firebase"
3. Create a test shipment
4. Check Firestore Database in Firebase Console
5. New shipment should appear under `shipments` collection

### Test EmailJS
1. Create a shipment with a valid email
2. Check your email for confirmation
3. Update shipment status
4. Check email for status update notification

### Test Google Maps
1. Go to "Find Locations" tab
2. Enter a zip code or city
3. Map should load and show location

---

## 🚨 Troubleshooting

### Firebase Not Connecting?
```javascript
// Check browser console for:
// 1. "Failed to connect to Firebase" - check config
// 2. "auth/operation-not-allowed" - enable Anonymous auth
// 3. "PERMISSION_DENIED" - check Firestore security rules
```

**Solution:**
1. Verify Firebase config is correct
2. Enable Anonymous Authentication
3. Update Firestore security rules
4. Clear browser cache and reload

### Emails Not Sending?
```javascript
// Check:
// 1. Service ID is correct
// 2. Template IDs are correct
// 3. Public Key is correct
// 4. Email template variables match
```

**Solution:**
1. Verify all IDs in index.html
2. Check EmailJS dashboard for errors
3. Test template with EmailJS test function
4. Check spam folder

### Maps Not Loading?
```javascript
// Check browser console for:
// 1. "Google is not defined" - API key issue
// 2. API quota exceeded - upgrade plan
```

**Solution:**
1. Verify API key is correct
2. Enable Maps JavaScript API
3. Check API restrictions
4. Increase quota in Google Cloud Console

---

## 🔐 Security Best Practices

### Production Deployment Recommendations

#### 1. Move Firebase Config to Backend
```nodejs
// Backend (Express.js)
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ... other config from env vars
};
```

#### 2. Implement Proper Authentication
```javascript
// Replace Anonymous auth with:
// - Google Sign-In
// - GitHub OAuth
// - Custom JWT tokens
```

#### 3. Update Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Require user authentication
    match /shipments/{document=**} {
      allow read, write: if request.auth != null;
    }
    // Admin-only operations
    match /admin/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

#### 4. Use HTTPS Only
- Deploy on HTTPS (use Let's Encrypt for free SSL)
- Enable HSTS header
- Implement CSP (Content Security Policy)

#### 5. Rate Limiting
```javascript
// Add rate limiting to EmailJS sends
// Limit API calls per user per day
```

---

## 📞 Support Resources

- Firebase Docs: https://firebase.google.com/docs
- EmailJS Docs: https://www.emailjs.com/docs
- Google Maps Docs: https://developers.google.com/maps
- Tailwind CSS: https://tailwindcss.com/docs

---

**Version**: 2.0.0
**Last Updated**: January 27, 2026
