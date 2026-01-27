/**
 * FedEx App - Backend Server with MongoDB Integration
 * Node.js/Express server for cross-device shipment tracking
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fedex-app';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ Connected to MongoDB');
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
});

// --- SCHEMAS ---

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, index: true },
    status: String,
    statusColor: String,
    service: String,
    weight: String,
    dimensions: String,
    pieces: Number,
    progress: Number,
    progressBar: String,
    location: String,
    deliveryDate: String,
    customerEmail: String,
    sender: {
        name: String,
        addr: String
    },
    recipient: {
        name: String,
        addr: String
    },
    history: [{
        time: String,
        date: String,
        location: String,
        message: String,
        active: Boolean,
        completed: Boolean
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// User Schema
const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, index: true },
    role: String,
    createdAt: { type: Date, default: Date.now }
});

// Location Schema
const locationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: String,
    address: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

// Create Models
const Shipment = mongoose.model('Shipment', shipmentSchema);
const User = mongoose.model('User', userSchema);
const Location = mongoose.model('Location', locationSchema);

// --- SHIPMENT ROUTES ---

// Get all shipments
app.get('/api/shipments', async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get shipment by ID (tracking ID)
app.get('/api/shipments/:id', async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ id: req.params.id });
        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or update shipment
app.post('/api/shipments/:id', async (req, res) => {
    try {
        const shipmentData = {
            id: req.params.id,
            ...req.body,
            updatedAt: new Date()
        };

        const shipment = await Shipment.findOneAndUpdate(
            { id: req.params.id },
            shipmentData,
            { upsert: true, new: true }
        );

        res.json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update shipment status
app.patch('/api/shipments/:id/status', async (req, res) => {
    try {
        const { status, statusColor, history } = req.body;

        const shipment = await Shipment.findOneAndUpdate(
            { id: req.params.id },
            {
                status,
                statusColor,
                history,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!shipment) return res.status(404).json({ error: 'Shipment not found' });
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete shipment
app.delete('/api/shipments/:id', async (req, res) => {
    try {
        const result = await Shipment.deleteOne({ id: req.params.id });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Shipment not found' });
        res.json({ message: 'Shipment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk update shipments
app.post('/api/shipments/bulk/update', async (req, res) => {
    try {
        const { ids, status, location } = req.body;

        const updateData = { updatedAt: new Date() };
        if (status) updateData.status = status;
        if (location) updateData.location = location;

        const result = await Shipment.updateMany(
            { id: { $in: ids } },
            updateData
        );

        res.json({ modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk delete shipments
app.post('/api/shipments/bulk/delete', async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await Shipment.deleteMany({ id: { $in: ids } });
        res.json({ deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- USER ROUTES ---

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or update user
app.post('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { upsert: true, new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
    try {
        const result = await User.deleteOne({ id: req.params.id });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- LOCATION ROUTES ---

// Get all locations
app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create or update location
app.post('/api/locations/:id', async (req, res) => {
    try {
        const location = await Location.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { upsert: true, new: true }
        );
        res.json(location);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete location
app.delete('/api/locations/:id', async (req, res) => {
    try {
        const result = await Location.deleteOne({ id: req.params.id });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Location not found' });
        res.json({ message: 'Location deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- HEALTH CHECK ---

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// --- ERROR HANDLING ---

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// --- START SERVER ---

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});

module.exports = app;
