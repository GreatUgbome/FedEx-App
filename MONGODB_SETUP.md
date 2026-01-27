# MongoDB Integration & Cross-Device Tracking Setup Guide

## Overview

This guide enables **cross-device shipment tracking** using a MongoDB backend. Users can now access shipment information from any device worldwide using their tracking ID.

**Key Features:**
- ✅ Centralized MongoDB database (not device-specific)
- ✅ Express.js REST API backend
- ✅ Cross-device tracking via Tracking ID
- ✅ Real-time data synchronization
- ✅ Offline fallback support
- ✅ Cloud-ready architecture

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Any Device)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Frontend (index.html + mongodb-adapter.js)           │ │
│  │  - Display shipment tracking                          │ │
│  │  - Real-time updates                                  │ │
│  │  - Offline cache support                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTP/HTTPS)
┌─────────────────────────────────────────────────────────────┐
│              Express.js Backend (server.js)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Endpoints:                                        │ │
│  │  - GET  /api/shipments/:id  (by tracking ID)          │ │
│  │  - POST /api/shipments/:id  (save/update)             │ │
│  │  - DELETE /api/shipments/:id (remove)                │ │
│  │  - And more (users, locations, bulk operations)      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ (MongoDB Protocol)
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Collections:                                          │ │
│  │  - shipments (tracking data)                          │ │
│  │  - users (admin/staff)                                │ │
│  │  - locations (warehouse/hub data)                     │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Installation

### Step 1: Install Backend Dependencies

```bash
cd /Users/chukwukagreatugbome/FedEx-App
npm install
```

This installs:
- `express` - Web framework
- `mongoose` - MongoDB driver
- `cors` - Cross-origin requests
- `dotenv` - Environment configuration
- `nodemon` - Dev server (restarts on changes)

### Step 2: Setup MongoDB

#### Option A: Local MongoDB

```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify connection
mongosh
> db.version()
```

#### Option B: MongoDB Atlas (Cloud) - Recommended

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster (leave defaults)
4. Create database user (remember username/password)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/fedex-app?retryWrites=true&w=majority
   ```

### Step 3: Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/fedex-app
PORT=5000
NODE_ENV=development

# OR for MongoDB Atlas (Cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fedex-app?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

Replace `username` and `password` with your MongoDB Atlas credentials.

### Step 4: Update Frontend

Add this script to `index.html` after the opening `<body>` tag:

```html
<!-- MongoDB Adapter - Cross-Device Tracking -->
<script src="mongodb-adapter.js"></script>
<script>
    // Replace all localStorage calls with MongoDB API
    // The adapter automatically handles all database operations
</script>
```

### Step 5: Start the Backend

**Development Mode** (with auto-restart):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

Output should show:
```
🚀 Server running on port 5000
📡 API: http://localhost:5000/api
🏥 Health: http://localhost:5000/api/health
✅ Connected to MongoDB
```

---

## API Endpoints

### Shipments

#### Get All Shipments
```bash
GET /api/shipments
```

#### Get Shipment by Tracking ID
```bash
GET /api/shipments/:id

# Example
curl http://localhost:5000/api/shipments/FDX123456789
```

#### Create/Update Shipment
```bash
POST /api/shipments/:id
Content-Type: application/json

{
  "status": "In Transit",
  "location": "Memphis Hub",
  "recipient": { "name": "John Doe", "addr": "123 Main St" },
  "history": [...]
}
```

#### Update Status Only
```bash
PATCH /api/shipments/:id/status
Content-Type: application/json

{
  "status": "Delivered",
  "statusColor": "#10b981"
}
```

#### Delete Shipment
```bash
DELETE /api/shipments/:id
```

### Users

#### Get All Users
```bash
GET /api/users
```

#### Create/Update User
```bash
POST /api/users/:id
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@fedex.com",
  "role": "admin"
}
```

### Locations

#### Get All Locations
```bash
GET /api/locations
```

#### Create/Update Location
```bash
POST /api/locations/:id
Content-Type: application/json

{
  "name": "Memphis Hub",
  "address": "2455 Airways Blvd, Memphis, TN",
  "phone": "901-555-0123"
}
```

### Health Check

```bash
GET /api/health

# Response:
{
  "status": "OK",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "database": "Connected"
}
```

---

## Cross-Device Tracking Example

### User on Device A (Smartphone)
1. Opens app in browser
2. Enters Tracking ID: `FDX123456789`
3. Clicks "Track"
4. Sees shipment details from MongoDB

### User on Device B (Laptop)
1. Opens app in different browser
2. Enters same Tracking ID: `FDX123456789`
3. Clicks "Track"
4. **Gets same data** from MongoDB (synced across devices)

### Live Updates
- Admin updates shipment status in warehouse
- MongoDB is updated
- All users see update within 5 seconds (auto-sync interval)

---

## Deployment

### Option 1: Railway (Recommended - Free Tier)

1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repo
3. Set environment variables:
   ```
   MONGODB_URI=your_atlas_connection_string
   NODE_ENV=production
   ```
4. Railway auto-deploys
5. Get API URL: `https://your-app.railway.app/api`

### Option 2: Heroku

```bash
# Login
heroku login

# Create app
heroku create fedex-app-backend

# Set environment
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option 3: Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables
7. Deploy

---

## Frontend Integration

The `mongodb-adapter.js` provides drop-in replacement methods:

```javascript
// Instead of localStorage.setItem('shipments', ...)
await dbAdapter.saveShipment(trackingId, shipmentData);

// Instead of localStorage.getItem('shipments')
const shipment = await dbAdapter.getShipmentById(trackingId);

// Get all shipments
const allShipments = await dbAdapter.getAllShipments();

// Listen for changes
dbAdapter.onShipmentsChange((shipments) => {
    console.log('Shipments updated:', shipments);
});

// Check database connection
const isConnected = await dbAdapter.checkHealth();
```

---

## Testing

### Test Local Connection
```bash
curl http://localhost:5000/api/health
```

Expected:
```json
{
  "status": "OK",
  "timestamp": "2025-01-27T10:30:00.000Z",
  "database": "Connected"
}
```

### Test Creating Shipment
```bash
curl -X POST http://localhost:5000/api/shipments/FDX123456789 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Transit",
    "location": "Memphis Hub",
    "weight": "15 lbs"
  }'
```

### Test Cross-Device
1. Open app on Phone: `http://phone-ip:3000`
2. Open app on Laptop: `http://localhost:3000`
3. Create shipment on Phone
4. Refresh on Laptop
5. Shipment appears (pulled from MongoDB)

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MongoDB is running: `brew services list`
- Check connection string in `.env`
- For Atlas: Whitelist your IP in security settings

### "CORS errors"
- Backend enables CORS for frontend origin
- Update frontend API URL in HTML

### "API not responding"
- Check backend is running: `npm run dev`
- Check port 5000 is not in use: `lsof -i :5000`
- Check environment variables: `cat .env`

### "Slow syncing"
- Reduce sync interval in `mongodb-adapter.js`: `this.syncInterval = 3000`
- Check network connection
- Check MongoDB performance

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | Connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |

---

## API Response Examples

### Successful Shipment Fetch
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "id": "FDX123456789",
  "status": "In Transit",
  "statusColor": "#3b82f6",
  "location": "Memphis Hub",
  "recipient": {
    "name": "John Doe",
    "addr": "123 Main St, Anytown, USA"
  },
  "history": [
    {
      "time": "2:30 PM",
      "date": "Jan 27, 2025",
      "location": "Los Angeles Hub",
      "message": "Package picked up",
      "completed": true
    }
  ],
  "createdAt": "2025-01-27T10:00:00Z",
  "updatedAt": "2025-01-27T14:30:00Z"
}
```

### Error Response
```json
{
  "error": "Shipment not found"
}
```

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup MongoDB (local or Atlas)
3. ✅ Configure `.env` file
4. ✅ Start backend: `npm run dev`
5. ✅ Add `mongodb-adapter.js` to `index.html`
6. ✅ Test cross-device tracking
7. ✅ Deploy to production (Railway/Heroku/Render)

---

## Security Checklist

- [ ] Never commit `.env` to GitHub (use `.env.example`)
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB IP whitelist (Atlas)
- [ ] Use HTTPS in production
- [ ] Implement authentication (optional)
- [ ] Validate all API inputs
- [ ] Rate limit API endpoints
- [ ] Use CORS whitelist for frontend domains

---

## Support

For issues, check:
1. Backend logs: `npm run dev`
2. MongoDB connection: `mongosh`
3. API health: `curl http://localhost:5000/api/health`
4. Frontend console: Browser DevTools → Console
5. Network tab: Browser DevTools → Network

