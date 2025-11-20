# User Management Frontend - Next.js

A modern, responsive frontend application built with Next.js 16, featuring a comprehensive UI component library and seamless integration with the backend API.

## Architecture

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page with navigation
│   ├── register/          # Registration page
│   └── users/             # Users list page (SSR + Client)
├── components/
│   └── ui/                # Reusable UI component library
│       ├── Button.tsx     # Button with variants and loading state
│       ├── InputField.tsx # Form input with validation UI
│       ├── Modal.tsx      # Accessible modal with focus trap
│       ├── Tabs.tsx       # Keyboard-navigable tabs
│       └── Card.tsx       # Compound component pattern
├── lib/
│   ├── api/              # API client and endpoints
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
- Links to register and users pages

### Register (/register)
- User registration form
- Client-side validation with Zod
- Loading states during submission
- Success modal with redirect
- Error handling with user feedback

### Users List (/users)
- Server-side rendering for initial data
- Client-side interactivity for filtering and refresh
- Search functionality
- Loading skeletons
- Empty state handling
- Responsive card grid

## Features Implemented

- ✅ 5 reusable UI components (Button, InputField, Modal, Tabs, Card)
- ✅ Full TypeScript typing with generics
- ✅ Accessibility (ARIA attributes, keyboard navigation, focus management)
- ✅ Server and Client Component composition
- ✅ Form validation with Zod
- ✅ Type-safe API client
- ✅ Loading and error states
- ✅ Responsive design (mobile-first)
- ✅ Modern UI with TailwindCSS
- ✅ ESLint configured

## Design Patterns

- **Compound Components**: Card with composable slots
- **Controlled/Uncontrolled**: Tabs and Modal support both patterns
- **Render Props**: Component flexibility through children
- **Custom Hooks**: State management patterns
- **Server/Client Composition**: Optimal data fetching strategy

## API Integration

The frontend communicates with the backend gateway service:

- **POST /auth/register**: Register new user
- **GET /auth/users**: Fetch all users
- **GET /auth/users/:id**: Fetch user by ID

All API calls include:
- Type safety with TypeScript
- Error handling with custom ApiClientError
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

## License

UNLICENSED
