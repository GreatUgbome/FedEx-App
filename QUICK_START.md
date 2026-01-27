# Quick Reference Guide

## 🚀 Quick Start (2 minutes)

### Option 1: Use Local Storage (No Setup)
```bash
# Simply open in browser
open index.html

# Or use any web server
python -m http.server 8000
# Visit: http://localhost:8000
```

### Option 2: Cloud Sync with Firebase (10 minutes setup)
1. Go to https://console.firebase.google.com
2. Create project → Enable Anonymous Auth → Create Firestore
3. Copy Firebase config
4. Paste into index.html line ~70
5. Done! Data now syncs to cloud ☁️

---

## 👤 Demo Credentials

```
Username: Admin
Password: Admin123

Tracking IDs:
- 1234567890 (Delivered ✓)
- 9876543210 (In Transit ⚙️)
```

---

## 💻 Main Features at a Glance

| Feature | Access | Users |
|---------|--------|-------|
| 🔍 **Track Shipment** | Homepage | Everyone |
| 📦 **Create Shipment** | "Create Shipment" button | Everyone |
| 🛒 **Admin Dashboard** | Login → Dashboard button | Admin Only |
| 📊 **Analytics** | Dashboard → Quick Actions | Admin Only |
| 📄 **Invoicing** | Dashboard → Select → Invoice | Admin Only |
| 🖊️ **Delivery Proof** | Dashboard → Green checkmark | Admin Only |
| 🌍 **Multi-Language** | Footer → Language selector | Everyone |
| 💬 **Live Chat** | Chat bubble (bottom right) | Everyone |

---

## 🎯 Common Tasks

### Track a Package (Customer)
```
1. Enter tracking ID (e.g., 1234567890)
2. Click "Track"
3. View status, history, and delivery date
4. Click delivery date for more details
```

### Create & Print Label (Customer)
```
1. Click "Create a Shipment"
2. Enter sender & recipient details
3. Click "Create Label"
4. Download PDF label
5. Attach to package
```

### Generate Invoice (Admin)
```
1. Login with Admin / Admin123
2. Select shipments (checkboxes)
3. Click "Invoice" button
4. Fill invoice details
5. Click "Generate PDF"
6. Download invoice
```

### Confirm Delivery (Admin)
```
1. Login to Dashboard
2. Click ✓ button on shipment
3. Enter recipient name
4. Optional: Capture signature & photo
5. Click "Confirm Delivery"
```

### View Analytics (Admin)
```
1. Dashboard → Quick Actions (⚡)
2. Click "Analytics"
3. View shipment statistics
4. Report auto-copied to clipboard
```

### Filter Shipments (Admin)
```
1. Dashboard → Click "Filters" button
2. Select filters:
   - Status
   - Service Type
   - Customer Email
   - Location
3. Results update automatically
```

---

## 📱 Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Track Package | Enter (in search box) |
| Create Shipment | Ctrl+N |
| Open Dashboard | Ctrl+Shift+D |
| Export CSV | Ctrl+E |
| Dark Mode | Ctrl+M |

---

## 🌐 Language Support

Supported languages:
- 🇺🇸 English (en)
- 🇪🇸 Spanish (es)
- 🇫🇷 French (fr)
- 🇩🇪 German (de)

Set language:
```javascript
window.setLanguage('es');  // Spanish
window.setLanguage('fr');  // French
```

---

## 🔐 Admin Panel Overview

```
┌─────────────────────────────────────────────────┐
│ Admin Dashboard                            [X]   │
├─────────────────────────────────────────────────┤
│ [⚡ Quick Actions] [🔔 Notifications] [🌙 Dark] │
├─────────────────────────────────────────────────┤
│                                                 │
│ Sidebar:                  Main Content:          │
│ ├─ 📦 Shipments          ├─ Chart (Status)      │
│ ├─ 👥 Users             ├─ Activity Log        │
│ └─ 📍 Locations         └─ Data Table          │
│                                                 │
│ [Filters] [Search] [CSV] [Bulk] [New] [+]      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📊 Shipment Statuses

| Status | Color | Meaning |
|--------|-------|---------|
| Label Created | 🔵 Blue | Ready to ship |
| In Transit | 🟠 Orange | On the way |
| Pending | 🟡 Yellow | Awaiting action |
| Exception | 🔴 Red | Issue occurred |
| Delivered | 🟢 Green | Completed |

---

## 📧 Email Integration

When you update a shipment with a customer email:
1. **Creation Email** → Confirmation with tracking ID
2. **Status Email** → Update when status changes
3. **Custom Email** → Admin can send any message

### Setup Required:
1. EmailJS account: https://www.emailjs.com
2. Add email service (Gmail, Outlook, etc.)
3. Create 2 email templates
4. Add credentials to index.html

See **CONFIG_GUIDE.md** for detailed setup.

---

## 🗺️  Maps Integration

**Find Locations** feature shows nearby FedEx centers on map.

### Setup Required:
1. Google Cloud API key
2. Enable Maps JavaScript API
3. Add key to index.html

See **CONFIG_GUIDE.md** for setup.

---

## 📂 File Structure

```
FedEx-App/
├── index.html           # Main app (2514 lines, all-in-one)
├── README.md            # Complete user guide
├── CONFIG_GUIDE.md      # API setup instructions
├── CHANGELOG.md         # Version history & features
├── SETUP.sh             # Interactive setup script
└── .git/                # Version control
```

---

## 🐛 Troubleshooting Quick Fixes

### App not loading?
```
1. Hard refresh: Ctrl+Shift+R
2. Clear cache: Ctrl+Shift+Delete
3. Check console: F12 → Console tab
```

### Firebase not syncing?
```
1. Check config is correct (look for errors in console)
2. Enable Anonymous Auth in Firebase
3. Check Firestore security rules
```

### Emails not sending?
```
1. Check EmailJS credentials in index.html
2. Verify email address format
3. Check template variable names match
```

### Maps not showing?
```
1. Verify Google Maps API key
2. Check browser console for errors
3. Ensure API key has Maps permission
```

### Local storage full?
```
1. Export data as CSV first
2. Clear old shipments
3. Or enable Firebase sync
```

---

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com
- **EmailJS Dashboard**: https://www.emailjs.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Font Awesome Icons**: https://fontawesome.com/icons

---

## 📈 Performance Tips

1. **Limit displayed shipments**: Use filters
2. **Archive old data**: Keep local storage under 5MB
3. **Enable Firebase**: Better for >1000 shipments
4. **Use CSV export**: For backups and analysis
5. **Clear notifications**: Prevent memory leaks

---

## 🚀 Advanced Usage

### Custom Pricing
Edit around line 1400:
```javascript
const SHIPMENT_PRICING = {
    'FedEx Ground': 15.99,      // Change these values
    'FedEx Express': 35.99,     // to your actual prices
    // ...
};
```

### Custom Colors
Edit CSS variables:
```css
:root {
    --fedex-purple: #4D148C;    /* Main color */
    --fedex-orange: #FF6200;    /* Accent color */
    --fedex-grey: #FAFAFA;      /* Background */
}
```

### Add New Status
1. Edit status options in modals
2. Add color in `getStatusColor()` function
3. Update status chart logic
4. Update filter options

---

## 📞 Support

**Having issues?**
1. Check README.md FAQ section
2. Review CONFIG_GUIDE.md for setup
3. Check browser console (F12)
4. Look at CHANGELOG.md for known issues

---

## ✅ Checklist for First Run

- [ ] Download index.html
- [ ] Open in browser (or use web server)
- [ ] See demo with default data
- [ ] Try tracking ID: 1234567890
- [ ] Login with Admin/Admin123
- [ ] Explore admin dashboard
- [ ] Create test shipment
- [ ] (Optional) Set up Firebase
- [ ] (Optional) Set up EmailJS
- [ ] Share with team!

---

**Version**: 2.0.0  
**Last Updated**: January 27, 2026  
**Status**: Production Ready ✅
