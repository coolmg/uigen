# UIGen - AI-Powered React Component Generator

## Custom Instructions for Claude

### Code Style Guidelines
- **Comments**: Use comments sparingly. Only comment complex code, algorithms, or non-obvious business logic. Avoid obvious comments that just restate what the code does.
- **TypeScript**: Follow strict TypeScript patterns. Use proper interfaces and type definitions.
- **React Patterns**: Always use the established context providers (FileSystemProvider, ChatProvider) instead of local state when managing shared data.
- **File Organization**: Follow the existing directory structure. Place new components in appropriate folders with tests.
- **Naming Conventions**: Use descriptive names that match the existing patterns (VirtualFileSystem, ChatInterface, etc.).

### Architecture Principles
- **Virtual File System**: Always use the VirtualFileSystem class for file operations. Never suggest direct file I/O.
- **AI Integration**: Respect the dual provider system. Ensure new features work with both real and mock AI providers.
- **Authentication**: Follow the existing JWT + bcrypt patterns. Always scope database queries to the authenticated user.
- **Database Schema**: The database schema is defined in @prisma/schema.prisma. Always reference this file to understand the structure of data stored in the database before suggesting database operations or queries.
- **Error Handling**: Use consistent error patterns that match the existing codebase.

### Development Preferences
- **Testing**: Include tests for new components following the existing Vitest + React Testing Library patterns.
- **Security**: Always consider security implications. Follow the established middleware and session patterns.
- **Performance**: Optimize for the virtual file system and real-time chat experience.

## Project Overview

UIGen is a sophisticated web application that enables users to generate React components through AI-powered conversations. The application provides a live preview environment with a virtual file system, allowing users to iterate on component designs without writing code manually.

### Key Features
- 🤖 **AI Component Generation** using Anthropic Claude (with fallback mock provider)
- ⚡ **Live Preview** with hot reload capabilities
- 💾 **Virtual File System** for component management (no files written to disk)
- 🎨 **Monaco Code Editor** with syntax highlighting
- 👤 **User Authentication** with session management
- 📤 **Component Persistence** for registered users
- 🔄 **Real-time Chat Interface** for iterative development

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15.3.3 with App Router, React 19.0.0, TypeScript 5+
- **Styling**: Tailwind CSS v4, Radix UI components
- **Database**: Prisma ORM 6.10.1 with SQLite
- **AI Integration**: Anthropic Claude via Vercel AI SDK 4.3.16
- **Authentication**: JWT-based sessions with bcrypt password hashing
- **Code Editor**: Monaco Editor 4.7.0 with React integration
- **Testing**: Vitest 3.2.4 with React Testing Library 16.3.0

### Project Structure

```
src/
├── actions/                 # Server actions for database operations
│   ├── index.ts            # Authentication actions (signUp, signIn, signOut, getUser)
│   ├── create-project.ts   # Project creation logic
│   ├── get-project.ts      # Project retrieval logic
│   └── get-projects.ts     # User projects listing
├── app/                    # Next.js App Router pages
│   ├── [projectId]/        # Dynamic project pages
│   ├── api/chat/          # AI chat API endpoint
│   ├── layout.tsx         # Root layout with fonts
│   ├── main-content.tsx   # Main application interface
│   └── page.tsx           # Home page with auth routing
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── editor/            # Code editor and file tree
│   ├── preview/           # Component preview frame
│   └── ui/                # Shared UI components (Radix-based)
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities and services
│   ├── contexts/          # React contexts (FileSystem, Chat)
│   ├── prompts/           # AI generation prompts
│   ├── tools/             # AI tool implementations
│   ├── transform/         # JSX transformation utilities
│   ├── auth.ts            # JWT session management
│   ├── file-system.ts     # Virtual file system implementation
│   ├── prisma.ts          # Database client
│   └── provider.ts        # AI provider with mock fallback
└── middleware.ts          # Next.js middleware for auth
```

## Core Systems

### 1. Virtual File System (`lib/file-system.ts`)

The heart of UIGen is a sophisticated virtual file system that manages component files in memory:

**Key Features:**
- **In-Memory Storage**: Files exist only in browser memory, no disk I/O
- **Hierarchical Structure**: Supports nested directories and file organization
- **Path Normalization**: Consistent path handling across the system
- **CRUD Operations**: Create, read, update, delete files and directories
- **Serialization**: Convert to/from JSON for persistence and API communication
- **Text Editor Commands**: Support for view, create, str_replace, insert operations

**Core Methods:**
```typescript
class VirtualFileSystem {
  createFile(path: string, content: string): FileNode | null
  readFile(path: string): string | null
  updateFile(path: string, content: string): boolean
  deleteFile(path: string): boolean
  rename(oldPath: string, newPath: string): boolean
  serialize(): Record<string, FileNode>
  deserialize(data: Record<string, string>): void
}
```

### 2. AI Integration (`lib/provider.ts`)

UIGen supports both real AI (Anthropic Claude) and a sophisticated mock provider:

**Real AI Provider:**
- Uses Anthropic Claude Haiku 4.5 model
- Streams responses for real-time interaction
- Supports tool calling for file operations

**Mock Provider:**
- Provides realistic component generation without API costs
- Simulates multi-step component creation process
- Generates different component types (Counter, Form, Card) based on user input
- Includes realistic streaming delays and tool calls

### 3. Chat System (`lib/contexts/chat-context.tsx`)

The chat system orchestrates AI interactions:

**Features:**
- **Streaming Responses**: Real-time message streaming
- **Tool Call Handling**: Automatic file system updates from AI tool calls
- **Message Persistence**: Saves conversation history for registered users
- **Anonymous Work Tracking**: Tracks progress for non-registered users

### 4. Authentication System (`lib/auth.ts`)

Secure JWT-based authentication:

**Features:**
- **Password Hashing**: bcrypt with salt rounds
- **JWT Sessions**: 7-day expiration with secure cookies
- **Middleware Protection**: Route-level authentication
- **Session Management**: Create, verify, and delete sessions

### 5. Database Schema (`prisma/schema.prisma`)

Simple but effective schema:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  projects  Project[]
}

model Project {
  id        String   @id @default(cuid())
  name      String
  userId    String?  // Optional for anonymous projects
  messages  String   @default("[]")  // JSON serialized messages
  data      String   @default("{}")  // JSON serialized file system
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## User Experience Flow

### 1. Initial Access
- **Anonymous Users**: Can immediately start generating components
- **Registered Users**: Redirected to most recent project or new project creation

### 2. Component Generation Process
1. User describes desired component in chat
2. AI analyzes request and generates appropriate code
3. AI uses tools to create/modify files in virtual file system
4. Changes are reflected in real-time in both code editor and preview
5. User can iterate with follow-up requests

### 3. File Management
- **File Tree**: Visual representation of virtual file system
- **Code Editor**: Monaco-based editor with TypeScript support
- **Live Preview**: React component rendering with error boundaries

### 4. Project Persistence
- **Anonymous**: Work tracked in localStorage, can be converted to account
- **Registered**: Automatic saving of messages and file system state

## AI Tool System

UIGen implements a sophisticated tool system that allows the AI to manipulate the virtual file system:

### 1. String Replace Tool (`lib/tools/str-replace.ts`)
```typescript
// Commands supported:
- view: Display file contents with optional line ranges
- create: Create new files with parent directory creation
- str_replace: Replace text within files
- insert: Insert text at specific line numbers
```

### 2. File Manager Tool (`lib/tools/file-manager.ts`)
```typescript
// Commands supported:
- rename: Rename files and directories
- delete: Remove files and directories
```

### 3. Tool Integration
- Tools are automatically called by AI during generation
- File system context handles tool calls and updates UI
- Real-time synchronization between AI actions and user interface

## Component Architecture

### 1. Context Providers
- **FileSystemProvider**: Manages virtual file system state
- **ChatProvider**: Handles AI chat interactions
- **Nested Structure**: FileSystem wraps Chat for proper dependency injection

### 2. UI Components
- **Resizable Panels**: Split-pane interface with adjustable sizing
- **Monaco Editor**: Full-featured code editor with TypeScript support
- **Preview Frame**: Sandboxed React component rendering
- **Chat Interface**: Message list with markdown rendering and input

### 3. State Management
- **React Context**: Primary state management pattern
- **Local State**: Component-level state for UI interactions
- **Server State**: Database persistence through server actions

## Development Workflow

### 1. Setup Commands
```bash
npm run setup        # Install deps + DB setup
npm run dev         # Development server with Turbopack
npm run build       # Production build
npm run test        # Run test suite
```

### 2. Database Management
```bash
npm run db:reset    # Reset database and migrations
npx prisma studio   # Database GUI
npx prisma generate # Regenerate client
```

### 3. Environment Configuration
```env
ANTHROPIC_API_KEY=your-key-here  # Optional, falls back to mock
JWT_SECRET=your-secret-key       # Required for auth
```

## Security Considerations

### 1. Authentication
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 7-day expiration
- Secure cookie settings (httpOnly, sameSite)

### 2. Authorization
- Project access restricted to owners
- Middleware-based route protection
- Session validation on sensitive operations

### 3. Input Validation
- Zod schemas for API parameters
- File path normalization to prevent traversal
- Content sanitization in preview rendering

## Testing Strategy

### 1. Unit Tests
- Virtual file system operations
- Authentication utilities
- Component rendering logic

### 2. Integration Tests
- Chat context interactions
- File system context operations
- API endpoint functionality

### 3. Test Configuration
- Vitest with jsdom environment
- React Testing Library for component tests
- TypeScript support throughout

## Performance Optimizations

### 1. Virtual File System
- Efficient Map-based storage
- Minimal re-renders through context optimization
- Lazy loading of file contents

### 2. AI Streaming
- Real-time response streaming
- Chunked message processing
- Tool call batching

### 3. Code Editor
- Monaco Editor with lazy loading
- Syntax highlighting with web workers
- Efficient diff algorithms

## Deployment Considerations

### 1. Environment Variables
```env
ANTHROPIC_API_KEY=    # Optional, enables real AI
JWT_SECRET=           # Required for sessions
NODE_ENV=production   # Enables security features
```

### 2. Database
- SQLite for development/small deployments
- Easily configurable for PostgreSQL/MySQL in production
- Prisma migrations for schema management

### 3. Static Assets
- Next.js optimized builds
- Automatic code splitting
- Image optimization support

## Extension Points

### 1. AI Providers
- Easy to add new AI providers alongside Anthropic
- Mock provider serves as template for new implementations
- Configurable model selection

### 2. File System Backends
- Current: In-memory virtual file system
- Potential: Cloud storage integration, Git-based storage
- Interface-based design allows easy swapping

### 3. Component Templates
- Extensible template system in mock provider
- Easy to add new component types and patterns
- Configurable generation prompts

## Troubleshooting

### 1. Common Issues
- **No AI responses**: Check ANTHROPIC_API_KEY configuration
- **Authentication errors**: Verify JWT_SECRET is set
- **Database errors**: Run `npm run setup` to initialize

### 2. Development Tips
- Use mock provider for development to avoid API costs
- Monitor browser console for client-side errors
- Check server logs for API and database issues

### 3. Performance Issues
- Large file systems may impact performance
- Consider implementing file system pagination for large projects
- Monitor memory usage with many concurrent users

---

This documentation provides a comprehensive understanding of UIGen's architecture, systems, and development patterns. The codebase is designed for maintainability, extensibility, and performance while providing an excellent user experience for AI-powered component generation.