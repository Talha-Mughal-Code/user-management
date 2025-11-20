# User Management - Full Stack Application

A full-stack application demonstrating modern web development practices with NestJS microservices backend and Next.js frontend.

## Project Overview

This project consists of two main parts:
- **Backend**: NestJS monorepo with microservices architecture (TCP communication)
- **Frontend**: Next.js 16 with App Router and reusable UI component library

## Features

### Backend (NestJS)
- **Authentication & Security**
  - JWT-based authentication with access + refresh tokens
  - Password hashing with bcrypt (10 rounds)
  - JWT guards for protected routes
  - Token refresh mechanism
  - Secure token validation
- **Architecture**
  - Microservices architecture with TCP communication
  - MongoDB with Mongoose ORM
  - Repository pattern for data access
  - MVC pattern per feature
  - Global exception filters and interceptors
- **Logging & Monitoring**
  - Centralized Winston-based logging
  - Structured JSON logs with context
  - Request/response logging
  - Error tracking with stack traces
  - Environment-based log levels
  - Sensitive data redaction
- **Testing**
  - E2E tests for complete auth flows
  - Integration tests for protected routes
  - Comprehensive error scenario coverage
  - Test coverage reporting
- **API & Documentation**
  - RESTful API with Swagger/OpenAPI
  - Email uniqueness validation
  - Request/response transformation
- **DevOps**
  - Docker and docker-compose setup
  - Production-ready configuration

### Frontend (Next.js)
- **Authentication**
  - JWT-based authentication flow
  - Login/logout functionality
  - Protected routes with auto-redirect
  - Automatic token refresh on expiry
  - Secure token storage
  - Auth context provider
- **UI Components**
  - 5 reusable UI components (Button, InputField, Modal, Tabs, Card)
  - Full TypeScript with type-safe API client
  - Form validation with Zod
  - Server and Client Component composition
  - Responsive design (mobile-first)
  - Accessibility (ARIA, keyboard navigation, focus management)
  - Loading and error states
  - Search and filter functionality
  - Modern UI with TailwindCSS


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

## Testing

### Backend Tests

#### Unit Tests
```bash
cd backend

yarn test

```

**Unit Test Coverage**:
- ✅ AuthenticationService (register, login, refresh, user operations)
- ✅ JwtAuthService (token generation, verification)
- ✅ Comprehensive error handling tests

#### E2E Tests
```bash
cd backend

yarn test:e2e

```

**E2E Test Coverage**:
- ✅ Complete authentication flow (register → login → users)
- ✅ Token refresh mechanism
- ✅ Protected routes with JWT guards
- ✅ Error handling (validation, unauthorized, not found)
- ✅ Integration with microservices


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
JWT_SECRET=your-secret-key
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


## Support

For issues and questions, please refer to the individual README files in:
- `/backend/README.md`
- `/frontend/README.md`

---


