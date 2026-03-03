# Playwright MCP Integration

This project now includes Playwright MCP (Model Context Protocol) integration for AI-assisted browser automation and testing.

## What is Playwright MCP?

Playwright MCP allows AI assistants (like Claude) to interact with web browsers through a standardized protocol. This enables:

- Automated testing with AI assistance
- Browser automation for development tasks
- Visual testing and screenshot comparison
- Interactive debugging with AI guidance

## Setup

Playwright MCP has been installed and configured with the following components:

### Files Added:
- `playwright.config.ts` - Main Playwright configuration
- `.playwright-mcp.json` - MCP server configuration
- `e2e/` - End-to-end test directory
- `e2e/example.spec.ts` - Sample E2E tests

### Scripts Added:
- `npm run test:e2e` - Run Playwright tests
- `npm run test:e2e:ui` - Run tests with interactive UI
- `npm run test:e2e:headed` - Run tests in headed mode (visible browser)
- `npm run mcp:start` - Start MCP server for AI integration

## Usage

### Running E2E Tests
```bash
# Run all tests
npm run test:e2e

# Run tests with UI (interactive mode)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed
```

### Starting MCP Server
```bash
# Start the MCP server for AI integration
npm run mcp:start
```

### Configuration

The MCP server is configured in `.playwright-mcp.json` with:
- **Browser**: Chromium (default)
- **Base URL**: http://localhost:3000
- **Viewport**: 1280x720
- **Capabilities**: Vision (for screenshot analysis)
- **Tracing**: Enabled for debugging

## Integration with Development

The Playwright configuration includes a web server setup that automatically starts your Next.js dev server before running tests. This ensures tests run against your actual application.

## AI Assistant Usage

When the MCP server is running, AI assistants can:
1. Navigate your application
2. Interact with UI elements
3. Take screenshots and analyze them
4. Generate test cases
5. Debug issues interactively

## Example Test Cases

The included `e2e/example.spec.ts` demonstrates:
- Page title verification
- Empty state testing
- Navigation and dialog interaction

You can extend these tests or create new ones for your specific use cases.