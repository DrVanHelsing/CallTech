#!/bin/bash

# Quick Deployment Script for Voice AI Application
echo "🚀 Voice AI Quick Deployment Helper"
echo "==================================="

# Check if git repo is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing latest changes..."
    git add .
    git commit -m "Production deployment updates"
    git push origin main
    echo "✅ Changes pushed to GitHub"
else
    echo "✅ Git repo is clean"
fi

echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. 📱 Deploy Frontend (2 minutes):"
echo "   → Go to https://vercel.com"
echo "   → Click 'Import Git Repository'"
echo "   → Select 'helpful-voice-ai' repo"
echo "   → Click Deploy!"
echo ""
echo "2. ⚙️ Deploy Backend APIs (3 minutes):"
echo "   → Go to https://railway.app"
echo "   → Click 'Deploy from GitHub'"
echo "   → Select 'helpful-voice-ai' repo"
echo "   → Create TWO services:"
echo "     • Node.js API (auto-detects server/index.js)"
echo "     • Python API (auto-detects python-backend/main.py)"
echo ""
echo "3. 🔧 Configure Environment Variables:"
echo "   → In Vercel: Add VITE_NODE_API_URL and VITE_PYTHON_API_URL"
echo "   → Use your Railway service URLs"
echo "   → Redeploy frontend"
echo ""
echo "4. ✅ Test Your Deployed App:"
echo "   → Frontend: https://your-app.vercel.app"
echo "   → Node API: https://your-node.railway.app/health"
echo "   → Python API: https://your-python.railway.app/health"
echo ""
echo "🎉 Total time: ~5 minutes for full deployment!"
echo ""
echo "💡 Pro tip: Railway provides the service URLs immediately after deployment"
echo "   Copy them to update your Vercel environment variables"
