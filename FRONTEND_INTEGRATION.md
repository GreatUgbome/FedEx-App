# MongoDB Integration - Frontend Changes Guide

## Quick Start: 3 Steps to Enable Cross-Device Tracking

### Step 1: Include MongoDB Adapter

Add this before the closing `</body>` tag in `index.html`:

```html
<!-- MongoDB Database Adapter -->
<script src="mongodb-adapter.js"></script>
```

### Step 2: Update Your Data Access Functions

**Old Code (Firebase/localStorage):**
```javascript
// Save shipment locally
localStorage.setItem(`shipment_${id}`, JSON.stringify(shipmentData));

// Load shipment locally
const data = JSON.parse(localStorage.getItem(`shipment_${id}`));
```

**New Code (MongoDB):**
```javascript
// Save shipment to MongoDB (accessible from any device)
await dbAdapter.saveShipment(id, shipmentData);

// Load shipment from MongoDB
const data = await dbAdapter.getShipmentById(id);
```

### Step 3: Listen for Real-Time Updates

```javascript
// Any time shipments change, this fires
dbAdapter.onShipmentsChange((shipments) => {
    updateUI(shipments);
    console.log('Data synced from MongoDB');
});
```

---

## Common Function Replacements

### Loading All Shipments

**Before:**
```javascript
const shipments = JSON.parse(localStorage.getItem('shipments')) || [];
```

**After:**
```javascript
const shipments = await dbAdapter.getAllShipments();
```

---

### Saving a Single Shipment

**Before:**
```javascript
function saveShipment() {
    const shipment = {
        id: 'FDX123456789',
        status: 'In Transit',
        location: 'Memphis Hub'
    };
    localStorage.setItem('shipment_FDX123456789', JSON.stringify(shipment));
}
```

**After:**
```javascript
async function saveShipment() {
    const shipment = {
        status: 'In Transit',
        location: 'Memphis Hub'
    };
    await dbAdapter.saveShipment('FDX123456789', shipment);
}
```

---

### Updating Status

**Before:**
```javascript
function updateStatus() {
    const shipment = JSON.parse(localStorage.getItem('shipment_FDX123456789'));
    shipment.status = 'Delivered';
    localStorage.setItem('shipment_FDX123456789', JSON.stringify(shipment));
}
```

**After:**
```javascript
async function updateStatus() {
    await dbAdapter.updateShipmentStatus(
        'FDX123456789',
        'Delivered',
        '#10b981'  // green color
    );
}
```

---

### Deleting Shipments

**Before:**
```javascript
function deleteShipment(id) {
    localStorage.removeItem(`shipment_${id}`);
}
```

**After:**
```javascript
async function deleteShipment(id) {
    await dbAdapter.deleteShipment(id);
}
```

---

### Multiple Device Sync

All devices automatically sync every 5 seconds:

```javascript
// This happens automatically
setInterval(async () => {
    const latestShipments = await dbAdapter.getAllShipments();
    // All users see the same data
}, 5000);
```

**Example Scenario:**
1. Admin on Laptop updates shipment status → Saved to MongoDB
2. Customer on Mobile checks tracking → Sees update within 5 seconds
3. Staff on Tablet views dashboard → Also sees update within 5 seconds

---

### Error Handling

```javascript
async function trackShipment(trackingId) {
    try {
        const shipment = await dbAdapter.getShipmentById(trackingId);
        if (!shipment) {
            alert('Tracking ID not found');
            return;
        }
        displayShipment(shipment);
    } catch (error) {
        console.error('Database error:', error);
        // Falls back to cached data automatically
    }
}
```

---

### Checking Connection Status

```javascript
async function checkDatabaseStatus() {
    const isConnected = await dbAdapter.checkHealth();
    if (isConnected) {
        console.log('✅ Connected to MongoDB');
        // Show online indicator
    } else {
        console.log('❌ Using offline mode');
        // Show offline indicator
    }
}

// Check on load
window.addEventListener('load', checkDatabaseStatus);
```

---

## API Method Reference

### Shipments

```javascript
// Get all shipments
const shipments = await dbAdapter.getAllShipments();

// Get single shipment by tracking ID
const shipment = await dbAdapter.getShipmentById(trackingId);

// Create/update shipment
await dbAdapter.saveShipment(trackingId, {
    status: 'In Transit',
    location: 'Memphis Hub',
    weight: '15 lbs'
});

// Update only the status
await dbAdapter.updateShipmentStatus(
    trackingId,
    'Delivered',
    '#10b981'
);

// Delete shipment
await dbAdapter.deleteShipment(trackingId);

// Delete multiple shipments
await dbAdapter.bulkDeleteShipments(['FDX001', 'FDX002']);
```

### Users

```javascript
// Get all users
const users = await dbAdapter.getAllUsers();

// Create/update user
await dbAdapter.saveUser(userId, {
    name: 'John Admin',
    email: 'john@fedex.com',
    role: 'admin'
});

// Delete user
await dbAdapter.deleteUser(userId);
```

### Locations

```javascript
// Get all locations
const locations = await dbAdapter.getAllLocations();

// Create/update location
await dbAdapter.saveLocation(locationId, {
    name: 'Memphis Hub',
    address: '2455 Airways Blvd',
    phone: '901-555-0123'
});

// Delete location
await dbAdapter.deleteLocation(locationId);
```

### Listeners (Real-Time Updates)

```javascript
// Run when any shipment changes
dbAdapter.onShipmentsChange((shipments) => {
    console.log('Updated shipments:', shipments);
    updateShipmentTable();
});

// Run when users change
dbAdapter.onUsersChange((users) => {
    updateUserList();
});

// Run when locations change
dbAdapter.onLocationsChange((locations) => {
    updateLocationList();
});
```

---

## Testing in Browser Console

Once `mongodb-adapter.js` is loaded, you can test directly in DevTools:

```javascript
// Check connection
await dbAdapter.checkHealth()
// Output: true (if connected)

// Get a shipment
await dbAdapter.getShipmentById('FDX123456789')
// Output: { id: 'FDX123456789', status: 'In Transit', ... }

// Create a test shipment
await dbAdapter.saveShipment('TEST001', {
    status: 'Pending',
    location: 'Origin Hub'
})

// Get all shipments
await dbAdapter.getAllShipments()
```

---

## Offline Support

The adapter automatically handles offline scenarios:

```javascript
// If MongoDB is down, adapter uses local cache
// Data still displays correctly
// Changes are cached locally

// When connection restored:
// dbAdapter.syncWithServer() 
// All cached changes sync to MongoDB
```

---

## Performance Tips

1. **Reduce sync frequency** for lower bandwidth:
   ```javascript
   dbAdapter.syncInterval = 10000; // 10 seconds instead of 5
   ```

2. **Only fetch what you need**:
   ```javascript
   // Good: Single shipment
   const shipment = await dbAdapter.getShipmentById(id);
   
   // Avoid: All shipments if only need one
   const all = await dbAdapter.getAllShipments();
   ```

3. **Use listeners for UI updates**:
   ```javascript
   // Good: Reactive updates
   dbAdapter.onShipmentsChange((shipments) => {
       updateUI(shipments);
   });
   
   // Avoid: Polling
   setInterval(() => fetchAll(), 1000);
   ```

---

## Environment Configuration

For production deployment, set API URL:

```html
<script>
    // For production, use deployed API
    window.dbAdapter = new MongoDBAdapter(
        'https://your-app.railway.app/api'
    );
</script>
```

Or let it auto-detect:

```html
<script src="mongodb-adapter.js"></script>
<script>
    // Uses API_URL env variable or defaults to http://localhost:5000/api
    // Set API_URL in your deployment platform
</script>
```

---

## Need Help?

Check [MONGODB_SETUP.md](MONGODB_SETUP.md) for:
- Full installation instructions
- Database setup (local or cloud)
- Deployment guides
- Troubleshooting
- API endpoints reference

