/**
 * Database Adapter - MongoDB/API Integration
 * This replaces Firebase/localStorage with API calls to MongoDB backend
 * Usage: Simply include this before the main app code
 */

class MongoDBAdapter {
    constructor(apiUrl = 'http://localhost:4000/api') {
        this.apiUrl = apiUrl;
        this.cache = {
            shipments: new Map(),
            users: new Map(),
            locations: new Map()
        };
        this.syncInterval = 5000; // Sync with server every 5 seconds
        this.listeners = {
            shipments: [],
            users: [],
            locations: []
        };
    }

    // --- Helper Methods ---

    async request(method, endpoint, data = null) {
        try {
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' }
            };

            if (data) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.apiUrl}${endpoint}`, options);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${method} ${endpoint}]:`, error);
            throw error;
        }
    }

    notifyListeners(type, data) {
        if (this.listeners[type]) {
            this.listeners[type].forEach(callback => callback(data));
        }
    }

    // --- Shipment Methods ---

    async getAllShipments() {
        try {
            const shipments = await this.request('GET', '/shipments');
            shipments.forEach(ship => {
                this.cache.shipments.set(ship.id, ship);
            });
            this.notifyListeners('shipments', shipments);
            return shipments;
        } catch (error) {
            console.error('Failed to fetch shipments:', error);
            // Fall back to cache
            return Array.from(this.cache.shipments.values());
        }
    }

    async getShipmentById(trackingId) {
        try {
            const shipment = await this.request('GET', `/shipments/${trackingId}`);
            this.cache.shipments.set(trackingId, shipment);
            return shipment;
        } catch (error) {
            console.error(`Failed to fetch shipment ${trackingId}:`, error);
            return this.cache.shipments.get(trackingId);
        }
    }

    async saveShipment(trackingId, shipmentData) {
        try {
            const shipment = await this.request('POST', `/shipments/${trackingId}`, {
                id: trackingId,
                ...shipmentData
            });
            this.cache.shipments.set(trackingId, shipment);
            this.notifyListeners('shipments', Array.from(this.cache.shipments.values()));
            return shipment;
        } catch (error) {
            console.error(`Failed to save shipment ${trackingId}:`, error);
            // Cache locally for offline support
            this.cache.shipments.set(trackingId, { id: trackingId, ...shipmentData });
            throw error;
        }
    }

    async updateShipmentStatus(trackingId, status, statusColor, history) {
        try {
            const shipment = await this.request('PATCH', `/shipments/${trackingId}/status`, {
                status,
                statusColor,
                history
            });
            this.cache.shipments.set(trackingId, shipment);
            this.notifyListeners('shipments', Array.from(this.cache.shipments.values()));
            return shipment;
        } catch (error) {
            console.error(`Failed to update shipment ${trackingId}:`, error);
            throw error;
        }
    }

    async deleteShipment(trackingId) {
        try {
            await this.request('DELETE', `/shipments/${trackingId}`);
            this.cache.shipments.delete(trackingId);
            this.notifyListeners('shipments', Array.from(this.cache.shipments.values()));
        } catch (error) {
            console.error(`Failed to delete shipment ${trackingId}:`, error);
            throw error;
        }
    }

    async bulkDeleteShipments(trackingIds) {
        try {
            await this.request('POST', '/shipments/bulk/delete', { ids: trackingIds });
            trackingIds.forEach(id => this.cache.shipments.delete(id));
            this.notifyListeners('shipments', Array.from(this.cache.shipments.values()));
        } catch (error) {
            console.error('Failed to bulk delete shipments:', error);
            throw error;
        }
    }

    // --- User Methods ---

    async getAllUsers() {
        try {
            const users = await this.request('GET', '/users');
            users.forEach(user => {
                this.cache.users.set(user.id, user);
            });
            this.notifyListeners('users', users);
            return users;
        } catch (error) {
            console.error('Failed to fetch users:', error);
            return Array.from(this.cache.users.values());
        }
    }

    async saveUser(userId, userData) {
        try {
            const user = await this.request('POST', `/users/${userId}`, {
                id: userId,
                ...userData
            });
            this.cache.users.set(userId, user);
            this.notifyListeners('users', Array.from(this.cache.users.values()));
            return user;
        } catch (error) {
            console.error(`Failed to save user ${userId}:`, error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            await this.request('DELETE', `/users/${userId}`);
            this.cache.users.delete(userId);
            this.notifyListeners('users', Array.from(this.cache.users.values()));
        } catch (error) {
            console.error(`Failed to delete user ${userId}:`, error);
            throw error;
        }
    }

    // --- Location Methods ---

    async getAllLocations() {
        try {
            const locations = await this.request('GET', '/locations');
            locations.forEach(loc => {
                this.cache.locations.set(loc.id, loc);
            });
            this.notifyListeners('locations', locations);
            return locations;
        } catch (error) {
            console.error('Failed to fetch locations:', error);
            return Array.from(this.cache.locations.values());
        }
    }

    async saveLocation(locationId, locationData) {
        try {
            const location = await this.request('POST', `/locations/${locationId}`, {
                id: locationId,
                ...locationData
            });
            this.cache.locations.set(locationId, location);
            this.notifyListeners('locations', Array.from(this.cache.locations.values()));
            return location;
        } catch (error) {
            console.error(`Failed to save location ${locationId}:`, error);
            throw error;
        }
    }

    async deleteLocation(locationId) {
        try {
            await this.request('DELETE', `/locations/${locationId}`);
            this.cache.locations.delete(locationId);
            this.notifyListeners('locations', Array.from(this.cache.locations.values()));
        } catch (error) {
            console.error(`Failed to delete location ${locationId}:`, error);
            throw error;
        }
    }

    // --- Listener Methods ---

    onShipmentsChange(callback) {
        this.listeners.shipments.push(callback);
    }

    onUsersChange(callback) {
        this.listeners.users.push(callback);
    }

    onLocationsChange(callback) {
        this.listeners.locations.push(callback);
    }

    // --- Health Check ---

    async checkHealth() {
        try {
            const health = await this.request('GET', '/health');
            return health.database === 'Connected';
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }

    // --- Sync Methods ---

    async syncWithServer() {
        try {
            await this.getAllShipments();
            await this.getAllUsers();
            await this.getAllLocations();
            console.log('✅ Synced with MongoDB');
            return true;
        } catch (error) {
            console.error('❌ Sync failed:', error);
            return false;
        }
    }

    startAutoSync() {
        setInterval(() => this.syncWithServer(), this.syncInterval);
        console.log(`🔄 Auto-sync enabled (every ${this.syncInterval}ms)`);
    }

    stopAutoSync() {
        // Implementation depends on storing interval ID
    }
}

// Initialize global adapter
const apiProtocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

let apiUrl;
if (window.location.hostname === 'localhost') {
    // Local development: use localhost:4000
    apiUrl = 'http://localhost:4000/api';
} else {
    // Production/Railway deployment:
    // Both frontend and backend on same Railway domain
    // Frontend: https://fedex-app-production.up.railway.app
    // Backend: https://fedex-app-production.up.railway.app/api
    apiUrl = `${apiProtocol}//${window.location.host}/api`;
}

window.dbAdapter = new MongoDBAdapter(apiUrl);

// Auto-start sync
window.dbAdapter.startAutoSync();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MongoDBAdapter;
}
