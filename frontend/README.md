# User Management Frontend - Next.js

A modern, responsive frontend application built with Next.js 16, featuring a comprehensive UI component library and seamless integration with the backend API.

## Architecture

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page with navigation
│   ├── login/             # Login page with JWT auth
│   ├── register/          # Registration page (auto-login)
│   └── users/             # Protected users list page
├── components/
│   └── ui/                # Reusable UI component library
│       ├── Button.tsx     # Button with variants and loading state
│       ├── InputField.tsx # Form input with validation UI
│       ├── Modal.tsx      # Accessible modal with focus trap
│       ├── Tabs.tsx       # Keyboard-navigable tabs
│       └── Card.tsx       # Compound component pattern
├── lib/
│   ├── api/              # API client with JWT interceptor
│   ├── contexts/         # Auth context provider
│   ├── types/            # TypeScript interfaces
│   ├── validations/      # Zod schemas
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

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
# Install dependencies
yarn install
```

## Configuration

Create a `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development

```bash
# Start development server
yarn dev

# Open http://localhost:3001
```

## Build & Production

```bash
# Build for production
yarn build

# Start production server
yarn start
```

## Code Quality

```bash
# Run linter
yarn lint

# Type checking
yarn build
```

## Pages

### Home (/)
- Landing page with navigation cards
- Links to register, login, and users pages

### Login (/login)
- User authentication with JWT
- Client-side validation with Zod
- Auto-redirect if already authenticated
- Error handling with user feedback
- Secure token storage

### Register (/register)
- User registration form
- Client-side validation with Zod
- Auto-login after successful registration
- JWT token management
- Loading states during submission
- Success modal with redirect
- Error handling with user feedback

### Users List (/users) - Protected Route
- Requires JWT authentication
- Auto-redirect to login if not authenticated
- Client-side data fetching with auth headers
- Search functionality
- Refresh functionality
- Logout button
- Loading skeletons
- Empty state handling
- Responsive card grid

## Features Implemented

### Authentication
- ✅ JWT-based authentication flow
- ✅ Login page with credential validation
- ✅ Auto-login after registration
- ✅ Protected routes with auth guards
- ✅ Automatic token refresh on expiry
- ✅ Secure token storage (localStorage)
- ✅ Auth context provider
- ✅ Logout functionality
- ✅ Auto-redirect to login when unauthorized

### UI Components
- ✅ 5 reusable UI components (Button, InputField, Modal, Tabs, Card)
- ✅ Full TypeScript typing with generics
- ✅ Accessibility (ARIA attributes, keyboard navigation, focus management)
- ✅ Loading and error states
- ✅ Responsive design (mobile-first)
- ✅ Modern UI with TailwindCSS

### Core Features
- ✅ Server and Client Component composition
- ✅ Form validation with Zod (login, register)
- ✅ Type-safe API client with JWT interceptor
- ✅ Automatic token attachment to requests
- ✅ Token refresh on 401 responses
- ✅ ESLint configured

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

### API Client Features
- Type safety with TypeScript
- Error handling with custom ApiClientError
- Automatic JWT token attachment to requests
- Automatic token refresh on 401 responses
- Token storage management
- Request queuing during token refresh
- Automatic redirect to login on auth failure
- Automatic response unwrapping
- Request/response transformation

## Accessibility Features

- Semantic HTML
- ARIA attributes on all interactive elements
- Keyboard navigation support
- Focus management in modals
- Screen reader friendly
- Color contrast compliance

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Authentication Flow

### Registration Flow
1. User fills registration form
2. Form validation (client-side with Zod)
3. POST to `/auth/register`
4. Receive user + JWT tokens
5. Store tokens in localStorage
6. Update auth context
7. Auto-redirect to users page

### Login Flow
1. User fills login form
2. Form validation (client-side with Zod)
3. POST to `/auth/login`
4. Receive user + JWT tokens
5. Store tokens in localStorage
6. Update auth context
7. Redirect to users page

### Protected Route Flow
1. User navigates to `/users`
2. Check auth state (tokens exist)
3. If not authenticated → redirect to `/login`
4. If authenticated → render page
5. Fetch data with JWT in Authorization header
6. If 401 → attempt token refresh
7. If refresh succeeds → retry request
8. If refresh fails → redirect to `/login`

### Logout Flow
1. User clicks logout button
2. Clear tokens from localStorage
3. Clear user from auth context
4. Redirect to `/login`

## Token Management

### Storage
- Tokens stored in localStorage
- Survives page refresh
- Accessible across tabs

### Refresh Strategy
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Automatic refresh on 401 response
- Request queuing during refresh
- Fallback to login if refresh fails

## Testing Authentication

1. **Register**: Navigate to `/register`, create account → auto-login
2. **Logout**: Click logout on users page → redirect to login
3. **Login**: Navigate to `/login`, enter credentials → redirect to users
4. **Protected Route**: Try accessing `/users` without login → redirect to login
5. **Token Refresh**: Wait 15+ mins, click refresh → should work seamlessly

## Documentation

For detailed implementation:
- **JWT Authentication**: See `/JWT_IMPLEMENTATION.md` in project root
- **API Integration**: See `/backend/README.md` for API details

## License

UNLICENSED
