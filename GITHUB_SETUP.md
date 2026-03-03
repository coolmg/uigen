# GitHub Integration Setup Guide

This guide will help you set up GitHub integration for your UIGen project, including CI/CD, deployment, and useful GitHub Apps.

## 🚀 Quick Setup

### 1. Create GitHub Repository

```bash
# Add all files and commit
git add .
git commit -m "feat: initial commit with GitHub integration setup"

# Create repository on GitHub (replace YOUR_USERNAME)
gh repo create YOUR_USERNAME/uigen --public --description "AI-powered React component generator"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/uigen.git
git branch -M main
git push -u origin main
```

### 2. Configure Repository Settings

Go to your GitHub repository settings and configure:

**Branches:**
- Set `main` as default branch
- Enable branch protection rules:
  - Require pull request reviews
  - Require status checks (CI tests)
  - Require up-to-date branches

**Secrets (for deployment):**
- `VERCEL_TOKEN` - Your Vercel deployment token
- `ORG_ID` - Your Vercel organization ID  
- `PROJECT_ID` - Your Vercel project ID
- `ANTHROPIC_API_KEY` - Your Anthropic API key (optional)

## 🤖 Recommended GitHub Apps

### Essential Apps

1. **Vercel** - Automatic deployments
   - Install: https://github.com/apps/vercel
   - Connects to Vercel for seamless deployments
   - Preview deployments for pull requests

2. **Dependabot** - Dependency updates
   - Already configured in `.github/dependabot.yml`
   - Automatically creates PRs for dependency updates
   - Security vulnerability alerts

3. **CodeQL** - Security analysis
   - Go to Security tab → Code scanning → Set up CodeQL
   - Automated security vulnerability detection
   - Supports JavaScript/TypeScript

### Development Enhancement Apps

4. **Codecov** - Test coverage
   - Install: https://github.com/apps/codecov
   - Tracks test coverage across PRs
   - Integrates with CI pipeline

5. **Renovate** - Advanced dependency management
   - Install: https://github.com/apps/renovate
   - More advanced than Dependabot
   - Grouped updates and smart scheduling

6. **Semantic Release** - Automated versioning
   - Install: https://github.com/apps/semantic-release-bot
   - Automated semantic versioning
   - Changelog generation

### AI/Development Apps

7. **GitHub Copilot** - AI code assistance
   - Install: https://github.com/features/copilot
   - AI-powered code suggestions
   - Perfect for component development

8. **Sourcegraph** - Code intelligence
   - Install: https://github.com/apps/sourcegraph
   - Advanced code search and navigation
   - Cross-repository code insights

## 🔧 CI/CD Pipeline

The setup includes two GitHub Actions workflows:

### CI Workflow (`.github/workflows/ci.yml`)
- **Triggers**: Push to main/develop, PRs to main
- **Tests**: Node.js 18.x and 20.x matrix
- **Steps**:
  - Linting with ESLint
  - Unit tests with Vitest
  - E2E tests with Playwright
  - Build verification
  - Artifact upload for test reports

### Deploy Workflow (`.github/workflows/deploy.yml`)
- **Triggers**: Push to main, PRs
- **Features**:
  - Production deployment on main branch
  - Preview deployments for PRs
  - Vercel integration

## 📋 Issue Templates

Pre-configured templates for:
- **Bug Reports** - Structured bug reporting with environment details
- **Feature Requests** - Enhancement suggestions with component generation context

## 🔄 Pull Request Template

Includes checklist for:
- Code quality verification
- Testing requirements
- Documentation updates
- Component generation testing

## 🛡️ Security Features

1. **Dependabot** - Automated dependency updates
2. **CodeQL** - Security vulnerability scanning
3. **Branch Protection** - Prevents direct pushes to main
4. **Required Reviews** - Ensures code quality

## 📊 Monitoring & Analytics

### Recommended Additional Integrations

1. **Sentry** - Error monitoring
   ```bash
   npm install @sentry/nextjs
   ```

2. **Vercel Analytics** - Performance monitoring
   ```bash
   npm install @vercel/analytics
   ```

3. **PostHog** - Product analytics
   ```bash
   npm install posthog-js
   ```

## 🚀 Deployment Options

### Vercel (Recommended)
- Zero-config Next.js deployment
- Automatic preview deployments
- Edge functions support
- Built-in analytics

### Alternative Platforms
- **Netlify** - Similar to Vercel with different features
- **Railway** - Full-stack deployment with databases
- **AWS Amplify** - AWS-native deployment
- **GitHub Pages** - Static site deployment (requires build modifications)

## 📈 Next Steps

1. **Set up Vercel deployment**
2. **Configure branch protection rules**
3. **Install recommended GitHub Apps**
4. **Add team members as collaborators**
5. **Set up project boards for issue tracking**
6. **Configure notifications and webhooks**

## 🔗 Useful Commands

```bash
# Install GitHub CLI for easier management
brew install gh

# Create repository
gh repo create

# View repository status
gh repo view

# Create and manage issues
gh issue create
gh issue list

# Manage pull requests
gh pr create
gh pr list
gh pr merge

# View GitHub Actions status
gh run list
gh run view
```

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/git)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [GitHub Apps Marketplace](https://github.com/marketplace)

---

Your UIGen project is now ready for professional development with comprehensive GitHub integration! 🎉