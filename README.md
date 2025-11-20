# User Management - Full Stack Application

A production-ready full-stack application demonstrating modern web development practices with NestJS microservices backend and Next.js frontend.

## Project Overview

This project consists of two main parts:
- **Backend**: NestJS monorepo with microservices architecture (TCP communication)
- **Frontend**: Next.js 16 with App Router and reusable UI component library

## Features

### Backend (NestJS)
- ✅ **Authentication & Security**
  - JWT-based authentication with access + refresh tokens
  - Password hashing with bcrypt (10 rounds)
  - JWT guards for protected routes
  - Token refresh mechanism
  - Secure token validation
- ✅ **Architecture**
  - Microservices architecture with TCP communication
  - MongoDB with Mongoose ORM
  - Repository pattern for data access
  - MVC pattern per feature
  - Global exception filters and interceptors
- ✅ **Logging & Monitoring**
  - Centralized Winston-based logging
  - Structured JSON logs with context
  - Request/response logging
  - Error tracking with stack traces
  - Environment-based log levels
  - Sensitive data redaction
- ✅ **API & Documentation**
  - RESTful API with Swagger/OpenAPI
  - Email uniqueness validation
  - Request/response transformation
- ✅ **DevOps**
  - Docker and docker-compose setup
  - Production-ready configuration

### Frontend (Next.js)
- ✅ **Authentication**
  - JWT-based authentication flow
  - Login/logout functionality
  - Protected routes with auto-redirect
  - Automatic token refresh on expiry
  - Secure token storage
  - Auth context provider
- ✅ **UI Components**
  - 5 reusable UI components (Button, InputField, Modal, Tabs, Card)
  - Full TypeScript with type-safe API client
  - Form validation with Zod
  - Server and Client Component composition
  - Responsive design (mobile-first)
  - Accessibility (ARIA, keyboard navigation, focus management)
  - Loading and error states
  - Search and filter functionality
  - Modern UI with TailwindCSS

## Architecture

```
user-management/
├── backend/              # NestJS Monorepo
│   ├── apps/
│   │   ├── gateway/     # HTTP API Gateway (Port 3000)
│   │   └── authentication/  # User Service (TCP Port 3001)
│   ├── common/          # Shared DTOs, filters, interceptors
│   ├── core/           # Config, database modules
│   └── docker-compose.yml
│
└── frontend/            # Next.js App
    ├── app/            # Pages (App Router)
    ├── components/ui/  # UI Component Library
    ├── lib/           # API client, types, validations
    └── public/        # Static assets
```

## Tech Stack

### Backend
- **Framework**: NestJS 11
- **Database**: MongoDB 7 with Mongoose
- **Communication**: @nestjs/microservices (TCP)
- **Authentication**: JWT (@nestjs/jwt, passport-jwt)
- **Logging**: Winston with structured logging
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Security**: bcrypt for password hashing
- **Package Manager**: Yarn

### Frontend
- **Framework**: Next.js 16 (App Router)
- **React**: React 18
- **Styling**: TailwindCSS 4
- **Validation**: Zod
- **HTTP Client**: Fetch API with custom wrapper
- **Package Manager**: Yarn

## Prerequisites

- Node.js 20+
- Yarn 1.22+
- MongoDB 7+ (or use Docker Compose)
- Git

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd user-management

# Start backend services (MongoDB, Authentication, Gateway)
cd backend
docker-compose up -d

# Start frontend
cd ../frontend
yarn install
yarn dev
```

Access the application:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

### Manual Setup

#### Backend

```bash
cd backend

# Install dependencies
yarn install

# Start MongoDB (if not using Docker)
# Make sure MongoDB is running on localhost:27017

# Terminal 1: Start authentication service
yarn start:authentication

# Terminal 2: Start gateway service
yarn start:gateway
```

#### Frontend

```bash
cd frontend

# Install dependencies
yarn install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Start development server
yarn dev
```

## API Endpoints

### Gateway Service (http://localhost:3000)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register a new user | No |
| POST | /auth/login | Login with credentials | No |
| POST | /auth/refresh | Refresh access token | No |
| GET | /auth/users | Get all users | Yes |
| GET | /auth/users/:id | Get user by ID | Yes |

### Example Requests

```bash
# Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Response includes JWT tokens
# {
#   "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "createdAt": "..." },
#   "tokens": { "accessToken": "eyJhbG...", "refreshToken": "eyJhbG..." }
# }

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'

# Get all users (requires authentication)
curl http://localhost:3000/auth/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Refresh token
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Project Structure

### Backend Structure

```
backend/
├── apps/
│   ├── gateway/
│   │   └── src/
│   │       ├── modules/auth/     # Auth endpoints
│   │       └── main.ts           # HTTP server setup
│   └── authentication/
│       └── src/
│           ├── entities/         # Mongoose schemas
│           ├── repositories/     # Data access layer
│           ├── authentication.service.ts
│           └── main.ts           # TCP microservice setup
├── common/
│   ├── dto/                      # Data Transfer Objects
│   ├── interfaces/               # TypeScript interfaces
│   ├── filters/                  # Exception filters
│   └── interceptors/             # Request/response interceptors
└── core/
    ├── config/                   # Configuration files
    └── database/                 # Database module
```

### Frontend Structure

```
frontend/
├── app/
│   ├── page.tsx                 # Home page
│   ├── register/                # Registration page
│   └── users/                   # Users list page
├── components/
│   └── ui/                      # UI component library
├── lib/
│   ├── api/                     # API client
│   ├── types/                   # TypeScript types
│   ├── validations/             # Zod schemas
│   └── utils.ts                 # Utility functions
└── public/                      # Static assets
```

## Design Patterns

### Backend
- **Repository Pattern**: Abstracts data access logic
- **DTO Pattern**: Request validation and transformation
- **Microservices Pattern**: Service decomposition via TCP
- **Decorator Pattern**: Interceptors and filters
- **MVC Pattern**: Controller → Service → Repository

### Frontend
- **Compound Components**: Card with composable slots
- **Controlled/Uncontrolled**: Flexible component APIs
- **Server/Client Composition**: Optimal data fetching
- **Custom Hooks**: Reusable stateful logic

## Testing

### Backend
```bash
cd backend
yarn test              # Unit tests
yarn test:e2e         # E2E tests
yarn test:cov         # Coverage report
```

### Frontend
```bash
cd frontend
yarn lint             # ESLint
yarn build            # Type checking
```

## Development Workflow

### Commit Convention

This project follows conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `chore:` Maintenance tasks
- `refactor:` Code refactoring

### Git History

View the incremental development commits:

```bash
git log --oneline
```

Each commit represents a complete, testable unit of work.

## Docker Support

### Backend Services

```bash
cd backend
docker-compose up -d      # Start all services
docker-compose logs -f    # View logs
docker-compose down       # Stop services
```

Services:
- **mongodb**: MongoDB database (port 27017)
- **authentication**: Authentication microservice
- **gateway**: HTTP API Gateway (port 3000)

## Environment Variables

### Backend

Create `.env` file in backend/:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/user-management

# Microservices
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
GATEWAY_PORT=3000

# Security
JWT_SECRET=your-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3001

# Logging
LOG_LEVEL=info
LOG_TO_FILE=false
LOG_DIRECTORY=./logs
```

### Frontend

Create `.env.local` file in frontend/:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Production Deployment

### Backend

```bash
cd backend
yarn build
yarn start:prod
```

### Frontend

```bash
cd frontend
yarn build
yarn start
```

## Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check ports 3000 and 3001 are available
- Verify environment variables are set

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check NEXT_PUBLIC_API_URL in .env.local
- Ensure CORS is configured correctly

### MongoDB connection issues
- Check MongoDB is running: `mongosh`
- Verify connection string in .env
- Ensure MongoDB version is 7+

## Performance Considerations

### Backend
- MongoDB indexes on email field
- TCP for fast inter-service communication
- Response transformation interceptor
- Connection pooling

### Frontend
- Server-side rendering for initial load
- Client-side state management for interactivity
- Lazy loading for tab content
- Optimistic UI updates

## Security Features

### Backend
- **Authentication**
  - JWT-based authentication (access + refresh tokens)
  - Secure token generation and validation
  - Password hashing with bcrypt (10 rounds)
  - Protected routes with JWT guards
  - Token refresh mechanism
- **API Security**
  - Global validation pipes
  - CORS configuration
  - Exception filters for error handling
  - Rate limiting ready
- **Logging**
  - Automatic sensitive data redaction (passwords, tokens)
  - Structured error logging with stack traces
  - Request/response logging

### Frontend
- **Authentication**
  - Secure token storage (localStorage)
  - Automatic token refresh on 401
  - Protected route guards
  - Auto-redirect to login
- **Validation & Safety**
  - Client-side validation before API calls
  - XSS protection via React
  - Type-safe API client
  - Error boundary implementation

## Documentation

For detailed implementation guides:
- **JWT Authentication**: See `JWT_IMPLEMENTATION.md`
- **Centralized Logging**: See `LOGGING_IMPLEMENTATION.md`
- **Backend Details**: See `/backend/README.md`
- **Frontend Details**: See `/frontend/README.md`
- **Setup Guide**: See `SETUP.md`

## Key Implementation Highlights

### JWT Authentication Flow
1. User registers → receives JWT tokens
2. User logs in → receives JWT tokens
3. Frontend stores tokens in localStorage
4. API calls include token in Authorization header
5. Token expires → automatic refresh using refresh token
6. Refresh fails → redirect to login

### Logging System
- **Console Logs** (Development): Colored, structured output
- **File Logs** (Production): JSON format for log aggregation
- **Request Logging**: All HTTP requests with duration
- **Error Logging**: Full stack traces and context
- **Sensitive Data**: Automatically redacted

## License

UNLICENSED

## Support

For issues and questions, please refer to the individual README files in:
- `/backend/README.md`
- `/frontend/README.md`

---


