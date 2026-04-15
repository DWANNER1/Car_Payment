#!/usr/bin/env bash
set -euo pipefail

sudo apt-get update
sudo apt-get install -y curl git nginx postgresql postgresql-contrib redis-server

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

npm install
npm run build

echo "Setup complete. Next steps:"
echo "1. Configure environment variables"
echo "2. Create PostgreSQL database"
echo "3. Add Nginx and PM2 configs"
echo "4. Start API and frontend preview or deploy built assets"
