# User Management Frontend - Next.js

A modern, responsive frontend application built with Next.js 16, featuring a comprehensive UI component library and seamless integration with the backend API.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: React 18
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **Validation**: Zod
- **Authentication**: JWT with Context API
- **State Management**: React Context + Hooks
- **Package Manager**: Yarn

## UI Component Library

### Button
- **Variants**: primary, secondary, outline, ghost, danger
- **Sizes**: sm, md, lg
- **Features**: Loading state, disabled state, full TypeScript support
- **Accessibility**: ARIA attributes, keyboard navigation

### InputField
- **Features**: Label, error state, helper text, required indicator
- **Validation**: Visual error feedback
- **Accessibility**: ARIA attributes, proper labeling, ref forwarding

### Modal
- **Features**: ESC key handling, click-outside to close, focus trap
- **Sizes**: sm, md, lg, xl
- **Accessibility**: ARIA attributes, keyboard navigation, body scroll prevention

### Tabs
- **Features**: Keyboard navigation (arrows, Home, End), lazy loading
- **Modes**: Controlled and uncontrolled
- **Variants**: default (underline) and pills
- **Accessibility**: Full ARIA support

### Card
- **Pattern**: Compound component (Card, CardHeader, CardBody, CardFooter)
- **Features**: Flexible composition, hover effects
- **Usage**: Composable slots for complex layouts

## Prerequisites

- Node.js 20+
- Yarn 1.22+
- Backend API running on http://localhost:3000

## Installation

```bash
yarn install
```

## Configuration

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development

```bash

yarn dev

```

## Code Quality

```bash

yarn lint

yarn build
```

## Features Implemented

### Authentication
-  JWT-based authentication flow
-  Login page with credential validation
-  Auto-login after registration
-  Protected routes with auth guards
-  Automatic token refresh on expiry
-  Secure token storage (localStorage)
-  Auth context provider
-  Logout functionality
-  Auto-redirect to login when unauthorized

### UI Components
-  5 reusable UI components (Button, InputField, Modal, Tabs, Card)
-  Full TypeScript typing with generics
-  Accessibility (ARIA attributes, keyboard navigation, focus management)
-  Loading and error states
-  Responsive design (mobile-first)
-  Modern UI with TailwindCSS

### Core Features
-  Server and Client Component composition
-  Form validation with Zod (login, register)
-  Type-safe API client with JWT interceptor
-  Automatic token attachment to requests
-  Token refresh on 401 responses
-  ESLint configured

### Testing
- 🔄 Frontend tests (Phase 5 - Planned)
  - Unit tests for UI components
  - Authentication flow tests
  - Form validation tests
  - Protected route tests

## Design Patterns

- **Compound Components**: Card with composable slots
- **Controlled/Uncontrolled**: Tabs and Modal support both patterns
- **Render Props**: Component flexibility through children
- **Custom Hooks**: State management patterns
- **Server/Client Composition**: Optimal data fetching strategy

## API Integration

The frontend communicates with the backend gateway service:

### Public Endpoints (No Auth Required)
- **POST /auth/register**: Register new user (returns JWT tokens)
- **POST /auth/login**: Login with credentials (returns JWT tokens)
- **POST /auth/refresh**: Refresh access token

### Protected Endpoints (Requires JWT)
- **GET /auth/users**: Fetch all users
- **GET /auth/users/:id**: Fetch user by ID
