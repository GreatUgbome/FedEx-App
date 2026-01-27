# FedEx Shipping & Tracking Application

A comprehensive web-based shipping management system with real-time tracking, admin dashboard, invoicing, and delivery confirmation capabilities.

## 🚀 Features

### Core Features
- **Real-Time Shipment Tracking**: Track packages with live location updates and status changes
- **Admin Dashboard**: Complete shipment, user, and location management
- **Hybrid Data Storage**: Firebase Cloud or Local Storage (automatic fallback)
- **Email Notifications**: Automated shipment status notifications via EmailJS
- **PDF Generation**: Shipping labels and invoices
- **Barcode Generation**: JsBarcode integration for shipping labels

### Advanced Features (NEW)
- **✨ Invoice Management**: Generate professional invoices with tax calculations
- **📊 Analytics Dashboard**: Shipment statistics, revenue tracking, and performance metrics
- **🖊️ Delivery Confirmation**: Digital signature capture and photo upload for proof of delivery
- **🌍 Multi-Language Support**: English, Spanish, French, and German translations
- **🔧 Advanced Filters**: Search by status, service type, email, and location
- **💬 Live Chat Widget**: Real-time customer support interface
- **🌙 Dark Mode**: Admin panel dark mode toggle
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS

---

## 🔧 Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project (optional, app works offline without it)
- EmailJS account (optional, for email notifications)
- Git (for version control)

### 1. Firebase Setup (Optional but Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** > Anonymous Sign-in
4. Create a Firestore database with these collections:
   - `shipments`
   - `users`
   - `locations`

5. Copy your Firebase configuration from **Project Settings**
6. In `index.html`, replace the `firebaseConfig` object (around line 70):
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

### 2. EmailJS Setup (Optional, for Email Notifications)

1. Visit [EmailJS](https://www.emailjs.com/)
2. Sign up and create an account
3. Add an email service (Gmail recommended)
4. Create email templates with these variables:
   - Template 1 (`template_p1hhlhk`): `{{to_email}}`, `{{tracking_id}}`, `{{new_status}}`
   - Template 2 (`template_n7wa86z`): `{{to_email}}`, `{{tracking_id}}`, `{{recipient_name}}`, `{{service_type}}`

5. In `index.html`, update the service/template IDs (around line 800):
```javascript
const serviceID = "service_YOUR_ID";
const templateID = "template_YOUR_ID";
const publicKey = "YOUR_PUBLIC_KEY";
```

### 3. Google Maps Setup (Optional, for Location Features)

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com)
2. Replace `YOUR_API_KEY` in the Maps script tag (around line 10)

### 4. Local Setup

Simply open `index.html` in your browser. The app works completely offline using Local Storage!

```bash
# Clone the repository
git clone https://github.com/yourusername/FedEx-App.git
cd FedEx-App

# Open in browser (no build required!)
open index.html

# Or serve with Python
python -m http.server 8000
# Visit: http://localhost:8000
```

---

## 👤 Demo Login

- **Username**: `Admin`
- **Password**: `Admin123`

Demo tracking IDs:
- `1234567890` (Delivered)
- `9876543210` (In Transit)

---

## 📱 Usage Guide

### For Customers (Public Users)

1. **Track Shipment**:
   - Enter tracking ID in the search box
   - Click "Track" to see shipment details, location history, and delivery timeline
   - View shipment facts: service type, weight, dimensions, pieces

2. **Create Shipment**:
   - Click "Create a Shipment" button
   - Fill in sender and recipient details
   - Select service type and package dimensions
   - Receive a tracking number and download shipping label/receipt

### For Admins

1. **Login**:
   - Click "Log In" and enter Admin credentials
   - Dashboard button appears in navbar

2. **Shipment Management**:
   - View all shipments in admin dashboard
   - **Advanced Filters**: Filter by status, service, email, location
   - **Create/Edit**: Add or modify shipment details
   - **Bulk Actions**: Update multiple shipments at once
   - **Duplicate**: Clone a shipment with new tracking ID
   - **Delete**: Remove individual or all shipments

3. **Invoice Generation** ⭐:
   - Select shipments
   - Click "Invoice" button
   - Fill in invoice details (date, number, bill-to info)
   - System calculates pricing and tax
   - Download as PDF

4. **Delivery Confirmation** ⭐:
   - Click delivery confirmation icon on shipment
   - Capture recipient signature using signature pad
   - Upload delivery photo
   - Add delivery notes
   - Confirm delivery (marks shipment as delivered)

5. **Analytics Report** ⭐:
   - Click "Analytics" in Quick Actions menu
   - View shipment statistics
   - Revenue tracking
   - Service type breakdown
   - Auto-copy report to clipboard

6. **Bulk Status Update**:
   - Select shipments
   - Click "Bulk Status Update" button
   - Set new status and location for all selected
   - All shipments updated simultaneously

7. **Export Data**:
   - Click "Export CSV" button
   - Download shipment data for reporting/analysis

8. **User Management**:
   - Add/edit/delete user accounts
   - Assign roles: Customer, Admin, Support Agent

9. **Location Management**:
   - Add FedEx hub locations
   - Manage distribution centers
   - Configure drop boxes

### Dark Mode & System Settings

- Click moon icon for dark mode toggle
- View real-time system clock
- Toggle maintenance mode
- Monitor database status (Cloud vs Local)

---

## 🎨 Customization

### Pricing Tiers

Edit `SHIPMENT_PRICING` in the script (around line 1400):

```javascript
const SHIPMENT_PRICING = {
    'FedEx Ground': 15.99,
    'FedEx Express': 35.99,
    'FedEx Freight': 65.99,
    'Standard Overnight': 45.99
};
```

### Colors & Branding

Update CSS variables in `<style>` section:

```css
:root {
    --fedex-purple: #4D148C;
    --fedex-orange: #FF6200;
    --fedex-grey: #FAFAFA;
}
```

### Languages

Add translations to the `TRANSLATIONS` object:

```javascript
const TRANSLATIONS = {
    en: { /* English */ },
    es: { /* Spanish */ },
    fr: { /* French */ },
    de: { /* German */ }
};
```

---

## 🔐 Security Notes

⚠️ **Important**: This app stores Firebase credentials in client-side code for demo purposes. For production:

1. **Move Firebase config to backend** using environment variables
2. **Use Firebase Security Rules** to restrict data access
3. **Implement proper authentication** instead of anonymous auth
4. **Use HTTPS only** for all communications
5. **Validate all inputs** on both client and server
6. **Implement rate limiting** for API calls

Example backend setup (Node.js):
```javascript
// .env file
FIREBASE_API_KEY=your_key
FIREBASE_PROJECT_ID=your_project

// server.js
require('dotenv').config();
const admin = require('firebase-admin');
// Initialize with credentials
```

---

## 📊 Data Storage

### Firebase (Cloud)
- Real-time synchronization
- Automatic backups
- Scalable infrastructure
- Multi-user support

### Local Storage (Offline)
- Browser-based storage
- Works without internet
- ~5MB limit per domain
- Data persists per browser/device

The app automatically switches between modes based on Firebase availability.

---

## 🐛 Troubleshooting

### Firebase connection failing?
1. Check API key is valid
2. Enable Anonymous auth in Firebase
3. Check Firestore security rules
4. Check browser console for errors

### Emails not sending?
1. Verify EmailJS service ID and template IDs
2. Check email service configuration
3. Verify recipient email format
4. Check spam folder

### Maps not loading?
1. Add valid Google Maps API key
2. Enable Maps API in Google Cloud Console
3. Check API key restrictions

### Local Storage full?
1. Export data as CSV
2. Clear old shipments from local storage
3. Consider enabling Firebase sync

---

## 🚀 Performance Tips

1. **Limit shipments displayed**: Use pagination (currently 10 per page)
2. **Archive old shipments**: Use local storage to clean up
3. **Enable Cloud Sync**: Firebase is faster for large datasets
4. **Use filters**: Reduce rendering load with advanced filters
5. **Compress images**: For delivery photos, use compressed formats

---

## 📝 Keyboard Shortcuts (Future)

- `Ctrl+K` / `Cmd+K`: Search
- `Ctrl+Shift+D`: Download selected
- `Ctrl+E`: Export CSV
- `Ctrl+I`: Generate invoice

---

## 🔄 API Reference

### Adapter Methods

```javascript
// Shipments
await Adapter.getShipment(id)
await Adapter.saveShipment(id, data)
await Adapter.deleteShipment(id)
await Adapter.deleteAllShipments()
await Adapter.bulkUpdateStatus(ids, status, location)
await Adapter.duplicateShipment(id)

// Users
await Adapter.getUsers()
await Adapter.saveUser(data)
await Adapter.deleteUser(id)

// Locations
await Adapter.getLocations()
await Adapter.saveLocation(data)
```

---

## 🎯 Roadmap

- [ ] SMS notifications
- [ ] Real-time push notifications
- [ ] Advanced route optimization
- [ ] Predictive delivery times
- [ ] Integration with carrier APIs (UPS, DHL)
- [ ] Mobile app (React Native)
- [ ] Blockchain tracking (optional)
- [ ] AI-powered route suggestions
- [ ] Advanced reporting & BI
- [ ] API for third-party integrations

---

## 📄 License

MIT License - Feel free to use and modify

---

## 👥 Support

For issues, feature requests, or questions:
1. Check the troubleshooting section
2. Review browser console for errors
3. Contact support via live chat widget

---

## 🙏 Credits

- **Framework**: Tailwind CSS
- **Icons**: Font Awesome
- **Charts**: Chart.js
- **Barcodes**: JsBarcode
- **PDF Generation**: jsPDF
- **Backend**: Firebase
- **Email**: EmailJS
- **Maps**: Google Maps API

---

**Last Updated**: January 27, 2026
**Version**: 2.0.0
**Status**: Production Ready ✅
