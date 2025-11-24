#!/bin/bash
# Quick setup script for ConvoBridge development

echo "🚀 ConvoBridge Setup Script"
echo "============================"
echo ""

# Check Node version
echo "✓ Checking Node.js..."
node_version=$(node -v)
echo "  Node version: $node_version"

# Check if dependencies are installed
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  Dependencies already installed"
else
    echo "  Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check .env.local exists
echo ""
echo "✓ Checking environment setup..."
if [ -f ".env.local" ]; then
    echo "  ✓ .env.local found"
    # Check for required vars
    if grep -q "VITE_GEMINI_API_KEY" .env.local && grep -q "MONGODB_URI" .env.local; then
        echo "  ✓ Required environment variables present"
    else
        echo "  ⚠️  Missing required environment variables"
        echo "     Add VITE_GEMINI_API_KEY and MONGODB_URI to .env.local"
    fi
else
    echo "  ⚠️  .env.local not found"
    echo "  Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "  📝 Edit .env.local with your API keys:"
        echo "     - VITE_GEMINI_API_KEY: Get from https://aistudio.google.com/app/apikey"
        echo "     - MONGODB_URI: Get from MongoDB Atlas"
        echo "     - JWT_SECRET: Run: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
    fi
fi

# Check MongoDB connectivity (optional)
echo ""
echo "✓ Setup complete!"
echo ""
echo "📚 Next Steps:"
echo ""
echo "  1. Frontend only:"
echo "     npm run dev"
echo ""
echo "  2. Frontend + Backend (recommended):"
echo "     npm run dev:all"
echo ""
echo "  3. Backend only:"
echo "     npm run dev:api"
echo ""
echo "🌐 Endpoints:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3001/api"
echo ""
echo "📖 Documentation:"
echo "  - Backend API: README_BACKEND.md"
echo "  - Frontend Integration: FRONTEND_INTEGRATION_GUIDE.md"
echo "  - Vercel Deployment: VERCEL_DEPLOYMENT.md"
echo ""
