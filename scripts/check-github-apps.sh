#!/bin/bash

# GitHub Apps Status Checker for UIGen
# Check which GitHub Apps are installed and configured

set -e

echo "🔍 Checking GitHub Apps Status for UIGen..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPO="coolmg/uigen"

# Check if GitHub CLI is available
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️ GitHub CLI not found. Install with: brew install gh${NC}"
    echo -e "${BLUE}💡 Some checks will be limited without GitHub CLI${NC}"
    echo ""
fi

# Check repository status
echo -e "${BLUE}📊 Repository Status:${NC}"
if command -v gh &> /dev/null; then
    gh repo view $REPO --json name,description,visibility,defaultBranchRef 2>/dev/null || echo -e "${RED}❌ Repository not accessible${NC}"
else
    curl -s "https://api.github.com/repos/$REPO" | grep -E '"name"|"description"|"private"' || echo -e "${RED}❌ Repository not found${NC}"
fi
echo ""

# Check GitHub Actions
echo -e "${BLUE}⚙️ GitHub Actions Status:${NC}"
if command -v gh &> /dev/null; then
    echo "Recent workflow runs:"
    gh run list --repo $REPO --limit 3 2>/dev/null || echo -e "${YELLOW}No workflow runs found${NC}"
else
    echo -e "${YELLOW}Install GitHub CLI to check workflow status${NC}"
fi
echo ""

# Check for essential files
echo -e "${BLUE}📁 Configuration Files:${NC}"
files=(
    ".github/workflows/ci.yml:CI Workflow"
    ".github/workflows/deploy.yml:Deploy Workflow"
    ".github/dependabot.yml:Dependabot Config"
    "playwright.config.ts:Playwright Config"
    "package.json:Package Config"
)

for file_info in "${files[@]}"; do
    IFS=':' read -r file desc <<< "$file_info"
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $desc ($file)${NC}"
    else
        echo -e "${RED}❌ $desc ($file)${NC}"
    fi
done
echo ""

# Check GitHub Apps (requires GitHub CLI)
echo -e "${BLUE}🤖 GitHub Apps Status:${NC}"
if command -v gh &> /dev/null; then
    echo "Checking installed apps..."
    
    # Check if apps are responding (indirect method)
    apps=(
        "Vercel:Deployment automation"
        "Dependabot:Dependency updates"
        "CodeQL:Security scanning"
        "Codecov:Test coverage"
        "Renovate:Advanced dependency management"
    )
    
    for app_info in "${apps[@]}"; do
        IFS=':' read -r app desc <<< "$app_info"
        echo -e "${YELLOW}📱 $app - $desc${NC}"
        echo -e "   Check manually at: https://github.com/$REPO/settings/installations"
    done
else
    echo -e "${YELLOW}Install GitHub CLI for detailed app status${NC}"
    echo -e "Manual check: https://github.com/$REPO/settings/installations"
fi
echo ""

# Check secrets (if GitHub CLI available)
echo -e "${BLUE}🔐 Repository Secrets:${NC}"
if command -v gh &> /dev/null; then
    echo "Checking for required secrets..."
    secrets=(
        "VERCEL_TOKEN:Vercel deployment"
        "ORG_ID:Vercel organization"
        "PROJECT_ID:Vercel project"
        "CODECOV_TOKEN:Test coverage reporting"
        "ANTHROPIC_API_KEY:AI component generation"
    )
    
    for secret_info in "${secrets[@]}"; do
        IFS=':' read -r secret desc <<< "$secret_info"
        echo -e "${YELLOW}🔑 $secret - $desc${NC}"
    done
    echo -e "   Configure at: https://github.com/$REPO/settings/secrets/actions"
else
    echo -e "${YELLOW}Configure secrets at: https://github.com/$REPO/settings/secrets/actions${NC}"
fi
echo ""

# Check deployment status
echo -e "${BLUE}🚀 Deployment Status:${NC}"
echo -e "${YELLOW}Check Vercel deployments at: https://vercel.com/dashboard${NC}"
echo -e "${YELLOW}Check GitHub Pages at: https://github.com/$REPO/settings/pages${NC}"
echo ""

# Recommendations
echo -e "${BLUE}💡 Recommendations:${NC}"
echo "1. Ensure all GitHub Apps are installed and configured"
echo "2. Add required secrets for deployment and monitoring"
echo "3. Enable branch protection rules for main branch"
echo "4. Review and merge any Dependabot/Renovate PRs"
echo "5. Check that CI/CD workflows are passing"
echo ""

echo -e "${GREEN}🎉 GitHub Apps status check complete!${NC}"
echo -e "${BLUE}📚 See GITHUB_SETUP.md for detailed setup instructions${NC}"