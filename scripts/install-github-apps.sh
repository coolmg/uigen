#!/bin/bash

# GitHub Apps Installation Script for UIGen
# Run this after your repository is created and pushed to GitHub

set -e

echo "🚀 Installing GitHub Apps for UIGen..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if repository exists
REPO_URL="https://github.com/coolmg/uigen"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$REPO_URL")
if [ "$HTTP_STATUS" != "200" ]; then
    echo -e "${RED}❌ Repository not accessible at $REPO_URL (HTTP $HTTP_STATUS)${NC}"
    echo -e "${YELLOW}Please ensure the repository exists and is accessible.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Repository found at $REPO_URL${NC}"

# Function to open GitHub Apps in browser
open_app() {
    local app_name=$1
    local app_url=$2
    echo -e "${BLUE}📱 Opening $app_name...${NC}"
    open "$app_url"
    read -p "Press Enter after installing $app_name..."
}

echo -e "${YELLOW}🔧 Installing Essential GitHub Apps...${NC}"

# Essential Apps
open_app "Vercel (Deployments)" "https://github.com/apps/vercel"
open_app "CodeQL (Security)" "https://github.com/coolmg/uigen/security/code-scanning"

echo -e "${YELLOW}🛠️ Installing Development Apps...${NC}"

# Development Apps
if command -v gh &> /dev/null; then
    echo -e "${BLUE}📱 Installing GitHub CLI extensions...${NC}"
    gh extension install github/gh-copilot 2>/dev/null || echo "Copilot extension already installed or not available"
else
    echo -e "${YELLOW}⚠️ GitHub CLI not found. Install with: brew install gh${NC}"
    open_app "GitHub Copilot" "https://github.com/features/copilot"
fi

open_app "Codecov (Test Coverage)" "https://github.com/apps/codecov"
open_app "Renovate (Dependencies)" "https://github.com/apps/renovate"

echo -e "${YELLOW}📊 Installing Monitoring Apps...${NC}"

open_app "Sentry (Error Monitoring)" "https://github.com/apps/sentry"

echo -e "${GREEN}✅ GitHub Apps installation links opened!${NC}"

# Post-installation setup
echo -e "${BLUE}🔧 Post-Installation Setup:${NC}"
echo ""
echo "1. Configure Vercel:"
echo "   - Connect your GitHub repository"
echo "   - Vercel will auto-detect Next.js settings"
echo "   - Add ANTHROPIC_API_KEY to Vercel environment variables"
echo ""
echo "2. Set up CodeQL:"
echo "   - GitHub will prompt you to commit the CodeQL workflow"
echo "   - Accept the default configuration"
echo ""
echo "3. Configure Codecov:"
echo "   - Sign up at codecov.io with your GitHub account"
echo "   - Add the repository to Codecov"
echo "   - Copy the upload token to GitHub Secrets as CODECOV_TOKEN"
echo ""
echo "4. Configure Renovate:"
echo "   - Renovate will create a configuration PR"
echo "   - Review and merge the renovate.json configuration"
echo ""
echo "5. Set up Sentry:"
echo "   - Create a Sentry project for React/Next.js"
echo "   - Add SENTRY_DSN to your environment variables"
echo "   - Install Sentry SDK: npm install @sentry/nextjs"
echo ""

# Check GitHub Actions status
if command -v gh &> /dev/null; then
    echo -e "${BLUE}📋 Checking GitHub Actions status...${NC}"
    gh run list --repo coolmg/uigen --limit 5 2>/dev/null || echo "No GitHub Actions runs found yet"
fi

echo -e "${GREEN}🎉 GitHub Apps installation process complete!${NC}"
echo -e "${YELLOW}📚 See GITHUB_SETUP.md for detailed configuration instructions${NC}"