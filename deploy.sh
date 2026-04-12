nathan@550w:~/projects/profolio_v2$ cat deploy.sh.backup || echo
#!/bin/bash

# ===============================
# Next.js Deploy Script - deploy.sh
# ===============================

# Config
APP_NAME="profolio_v2"                  # PM2 app name
APP_DIR="/home/nathan/projects/profolio_v2"  # Path to your project
BRANCH="main"                        # Branch to deploy

echo "🚀 Starting deployment for $APP_NAME"

# 1. Go to project directory
cd $APP_DIR || { echo "❌ Directory $APP_DIR not found"; exit 1; }

# 2. Stash or reset local changes (optional)
echo "💾 Stashing local changes"
git stash save "Auto-stash before deploy"

# 3. Fetch latest changes
echo "📡 Fetching latest code from $BRANCH"
git fetch origin $BRANCH

# 4. Reset local branch to remote
git reset --hard origin/$BRANCH

# 5. Install dependencies
echo "📦 Installing dependencies"
npm ci || { echo "❌ npm install failed"; exit 1; }

# 6. Build the project
echo "🏗 Building Next.js project"
npm run build || { echo "❌ Build failed"; exit 1; }

# 7. Restart the app using PM2
echo "🔄 Restarting PM2 app"
pm2 startOrRestart ecosystem.config.js --only $APP_NAME

# 8. Optional: Clear old PM2 logs
# echo "🧹 Clearing PM2 logs"
# pm2 flush

echo "✅ Deployment complete!"