# UIGen

AI-powered React component generator with live preview.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. **Optional** Edit `.env` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your-api-key-here
```

The project will run without an API key. Rather than using a LLM to generate components, static code will be returned instead.

2. Install dependencies and initialize database

```bash
npm run setup
```

This command will:

- Install all dependencies
- Generate Prisma client
- Run database migrations

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Sign up or continue as anonymous user
2. Describe the React component you want to create in the chat
3. View generated components in real-time preview
4. Switch to Code view to see and edit the generated files
5. Continue iterating with the AI to refine your components

## Features

- AI-powered component generation using Claude
- Live preview with hot reload
- Virtual file system (no files written to disk)
- Syntax highlighting and code editor
- Component persistence for registered users
- Export generated code
- End-to-end testing with Playwright
- AI-assisted browser automation via MCP (Model Context Protocol)

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma with SQLite
- Anthropic Claude AI
- Vercel AI SDK
- Playwright (E2E Testing)
- Playwright MCP (AI Browser Automation)

## Testing

### Unit Tests
```bash
npm test                    # Run unit tests with Vitest
```

### End-to-End Tests
```bash
npm run test:e2e           # Run E2E tests
npm run test:e2e:ui        # Run E2E tests with interactive UI
npm run test:e2e:headed    # Run E2E tests in headed mode
```

### AI-Assisted Testing
```bash
npm run mcp:start          # Start MCP server for AI browser automation
```

See [MCP_SETUP.md](./MCP_SETUP.md) for detailed information about AI-assisted browser automation.
