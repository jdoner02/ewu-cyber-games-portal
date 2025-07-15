#!/bin/bash
# Development server startup script for EWU Cyber Games Portal

# Change to the project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🎮 Starting EWU Cyber Games Portal Development Server..."
echo "📍 Working Directory: $(pwd)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the ewu-cyber-games-production directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Start the development server
echo "🚀 Starting Next.js development server..."
NEXT_TELEMETRY_DISABLED=1 npx next dev
