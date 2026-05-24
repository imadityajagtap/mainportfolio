#!/bin/bash
# Bash script to cleanly restart Next.js dev server

echo "🔄 Restarting Next.js dev server..."

# Kill any existing Next.js processes on ports 3000-3001
echo "🛑 Stopping existing dev servers..."
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null || echo "  No servers running on ports 3000-3001"

# Clear Next.js cache
echo "🗑️  Clearing Next.js cache..."
rm -rf .next

echo "✅ Ready to start fresh!"
echo "Run: npm run dev"
