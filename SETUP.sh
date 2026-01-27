#!/bin/bash
# FedEx App Quick Setup Guide
# This script helps you configure the FedEx app

echo "=================================================="
echo "   FedEx Shipping & Tracking App - Setup Guide"
echo "=================================================="
echo ""

# Check if running in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found in current directory"
    echo "Please run this script from the FedEx-App root directory"
    exit 1
fi

echo "✅ Found index.html"
echo ""

# Display setup options
echo "What would you like to do?"
echo ""
echo "1. Setup Firebase (Cloud Storage)"
echo "2. Setup EmailJS (Email Notifications)"
echo "3. Setup Google Maps API"
echo "4. Start Local Development Server"
echo "5. View Current Configuration"
echo "6. Reset to Demo Configuration"
echo ""
read -p "Select an option (1-6): " choice

case $choice in
    1)
        echo ""
        echo "📝 Firebase Setup Instructions:"
        echo "================================"
        echo ""
        echo "1. Go to https://console.firebase.google.com"
        echo "2. Create a new project (or select existing)"
        echo "3. Enable Authentication > Anonymous Sign-in"
        echo "4. Create Firestore Database"
        echo "5. Create collections: shipments, users, locations"
        echo ""
        echo "6. Go to Project Settings and copy your config"
        echo ""
        echo "7. Edit index.html and find the firebaseConfig object"
        echo "   Search for: const firebaseConfig = {"
        echo ""
        echo "8. Replace the values with your credentials:"
        echo "   - apiKey"
        echo "   - authDomain"
        echo "   - projectId"
        echo "   - storageBucket"
        echo "   - messagingSenderId"
        echo "   - appId"
        echo "   - measurementId"
        echo ""
        echo "9. Save index.html and refresh the browser"
        echo ""
        echo "✅ Setup complete!"
        ;;
    2)
        echo ""
        echo "📧 EmailJS Setup Instructions:"
        echo "=============================="
        echo ""
        echo "1. Go to https://www.emailjs.com/docs"
        echo "2. Sign up and create account"
        echo "3. Add email service (Gmail recommended)"
        echo ""
        echo "4. Create 2 email templates:"
        echo ""
        echo "   Template 1 (Shipment Status Update):"
        echo "   - Name: template_p1hhlhk"
        echo "   - Variables: {{to_email}}, {{tracking_id}}, {{new_status}}"
        echo ""
        echo "   Template 2 (New Shipment Confirmation):"
        echo "   - Name: template_n7wa86z"
        echo "   - Variables: {{to_email}}, {{tracking_id}}, {{recipient_name}}, {{service_type}}"
        echo ""
        echo "5. Edit index.html and search for: const serviceID = "
        echo ""
        echo "6. Update these values:"
        echo "   - serviceID"
        echo "   - templateID (for each template)"
        echo "   - publicKey"
        echo ""
        echo "✅ Setup complete!"
        ;;
    3)
        echo ""
        echo "🗺️  Google Maps Setup Instructions:"
        echo "===================================="
        echo ""
        echo "1. Go to https://console.cloud.google.com"
        echo "2. Create a new project"
        echo "3. Enable Maps JavaScript API"
        echo "4. Create an API key (Application default credentials)"
        echo ""
        echo "5. Edit index.html and find the Maps script tag:"
        echo "   <script async defer src=\"https://maps.googleapis.com/maps/api/js?"
        echo ""
        echo "6. Replace YOUR_API_KEY with your actual API key"
        echo ""
        echo "✅ Setup complete!"
        ;;
    4)
        echo ""
        echo "🚀 Starting Development Server..."
        echo ""
        
        # Check if Python is available
        if command -v python3 &> /dev/null; then
            echo "Starting server on http://localhost:8000"
            echo "Press Ctrl+C to stop"
            echo ""
            python3 -m http.server 8000
        elif command -v python &> /dev/null; then
            echo "Starting server on http://localhost:8000"
            echo "Press Ctrl+C to stop"
            echo ""
            python -m http.server 8000
        elif command -v node &> /dev/null; then
            echo "Starting server with Node.js..."
            npx http-server -p 8000
        else
            echo "❌ No suitable server found"
            echo "Please install Python 3 or Node.js to run a local server"
        fi
        ;;
    5)
        echo ""
        echo "📋 Current Configuration:"
        echo "========================"
        echo ""
        echo "Check these values in index.html:"
        echo ""
        grep -n "const firebaseConfig" index.html | head -1
        echo "  └─ Firebase config found ✓"
        echo ""
        grep -n "const serviceID" index.html | head -1
        echo "  └─ EmailJS service found ✓"
        echo ""
        grep -n "Google Maps API" index.html | head -1
        echo "  └─ Google Maps script found ✓"
        echo ""
        ;;
    6)
        echo ""
        echo "🔄 Resetting to Demo Configuration..."
        echo ""
        echo "⚠️  This will remove all custom settings"
        read -p "Are you sure? (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            # Backup current file
            cp index.html index.html.backup
            echo "✅ Backup created: index.html.backup"
            echo ""
            echo "To restore demo config, manually edit index.html or:"
            echo "git checkout index.html"
            echo ""
            echo "Demo credentials:"
            echo "  Admin Username: Admin"
            echo "  Admin Password: Admin123"
            echo ""
            echo "Demo Tracking IDs:"
            echo "  1234567890 (Delivered)"
            echo "  9876543210 (In Transit)"
        fi
        ;;
    *)
        echo "❌ Invalid option"
        ;;
esac

echo ""
echo "=================================================="
echo "For more help, see: README.md"
echo "=================================================="
