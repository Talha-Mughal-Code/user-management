# User Management Backend - NestJS Monorepo

A production-ready NestJS monorepo implementing microservices architecture with TCP communication for user management.

## Architecture

```
backend/
├── apps/
│   ├── gateway/              # HTTP API Gateway (Port 3000)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   └── auth/    # Auth endpoints and TCP client
│   │   │   └── main.ts      # Gateway bootstrap with Swagger
│   │   └── ...
│   └── authentication/       # User Authentication Service (TCP Port 3001)
│       ├── src/
│       │   ├── entities/    # Mongoose schemas
│       │   ├── repositories/ # Data access layer
│       │   └── main.ts      # Microservice bootstrap
│       └── ...
├── common/                   # Shared across services
│   ├── dto/                 # Data Transfer Objects
│   ├── interfaces/          # TypeScript interfaces
│   ├── filters/             # Exception filters
│   └── interceptors/        # Request/response interceptors
├── core/                     # Core infrastructure
│   ├── config/              # Configuration files
│   └── database/            # Database module
└── docker-compose.yml        # Docker orchestration
```

## Tech Stack

- **Framework**: NestJS 11
- **Database**: MongoDB with Mongoose
- **Communication**: TCP Microservices (@nestjs/microservices)
- **Authentication**: JWT (@nestjs/jwt, passport-jwt)
- **Logging**: Winston with structured logging
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Package Manager**: Yarn

## Prerequisites

- Node.js 20+
- Yarn 1.22+
- MongoDB 7+ (or use Docker Compose)

## Installation

```bash
# Install dependencies
yarn install

# Create .env file with these variables:
# Database
MONGODB_URI=mongodb://localhost:27017/user-management

# Microservices
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
GATEWAY_PORT=3000

# JWT Authentication
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

## Development

### Local Development (without Docker)

Make sure MongoDB is running locally on port 27017.

```bash
# Terminal 1: Start authentication service
yarn start:authentication

# Terminal 2: Start gateway service
yarn start:gateway
```

### Using Docker Compose

```bash
# Start all services (MongoDB, Authentication, Gateway)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Available Scripts

```bash
# Development
yarn start:gateway           # Start gateway in watch mode
yarn start:authentication    # Start auth service in watch mode

# Build
yarn build                   # Build all apps
yarn build:gateway          # Build gateway only
yarn build:authentication   # Build auth service only

# Production
yarn start:prod             # Start gateway in production mode

# Code Quality
yarn lint                   # Run ESLint
yarn format                 # Format code with Prettier

# Testing
yarn test                   # Run unit tests
yarn test:watch            # Run tests in watch mode
yarn test:cov              # Generate coverage report
yarn test:e2e              # Run e2e tests
```

## API Endpoints

The Gateway service exposes the following endpoints on `http://localhost:3000`:

### Authentication

- **POST /auth/register** - Register a new user (returns JWT tokens)
  ```json
  // Request
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  
  // Response
  {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-11-20T..."
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
  ```

- **POST /auth/login** - Login with credentials
  ```json
  // Request
  {
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  
  // Response (same as register)
  {
    "user": {...},
    "tokens": {...}
  }
  ```

- **POST /auth/refresh** - Refresh access token
  ```json
  // Request
  {
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
  
  // Response
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```

- **GET /auth/users** - Get all users (requires authentication)
  ```bash
  # Requires Authorization header
  Authorization: Bearer <access_token>
  ```

- **GET /auth/users/:id** - Get user by ID (requires authentication)
  ```bash
  # Requires Authorization header
  Authorization: Bearer <access_token>
  ```

### Swagger Documentation

Once the gateway is running, visit:
- `http://localhost:3000/api` - Interactive API documentation with live testing
- Includes JWT Bearer authentication testing

## Project Structure Details

### Gateway App (`apps/gateway`)
- HTTP entry point for all client requests
- Communicates with authentication service via TCP
- Handles request/response transformation
- Provides Swagger documentation

### Authentication App (`apps/authentication`)
- Handles user business logic
- Direct MongoDB access via Mongoose
- Exposes TCP message patterns
- Implements Repository pattern

### Common (`common/`)
- Shared DTOs for request validation
- Response DTOs (RTOs) for API responses
- TypeScript interfaces

### Core (`core/`)
- Configuration modules (database, microservices)
- Database connection setup
- Shared abstractions

## Microservices Communication

Services communicate via TCP using message patterns:

- `user.register` - Register new user (returns user + tokens)
- `user.login` - Authenticate user (returns user + tokens)
- `user.refresh` - Refresh JWT tokens (returns new tokens)
- `user.findAll` - Get all users
- `user.findById` - Get user by ID

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| **Database** | | |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/user-management |
| **Microservices** | | |
| AUTH_SERVICE_HOST | Authentication service host | localhost |
| AUTH_SERVICE_PORT | Authentication service TCP port | 3001 |
| GATEWAY_PORT | Gateway HTTP port | 3000 |
| **JWT Authentication** | | |
| JWT_SECRET | Secret key for JWT signing | your-secret-key |
| JWT_ACCESS_EXPIRY | Access token expiration | 15m |
| JWT_REFRESH_EXPIRY | Refresh token expiration | 7d |
| **CORS** | | |
| CORS_ORIGIN | Allowed frontend origins | http://localhost:3001 |
| **Logging** | | |
| LOG_LEVEL | Log level (error\|warn\|info\|debug\|verbose) | info |
| LOG_TO_FILE | Enable file logging | false |
| LOG_DIRECTORY | Directory for log files | ./logs |

## Development Workflow

1. Make changes to the code
2. Services will auto-reload in watch mode
3. Test endpoints via Swagger UI or HTTP client
4. Run linter before committing: `yarn lint`

## Features Implemented

### Architecture
- ✅ NestJS monorepo with gateway and authentication apps
- ✅ TCP microservices communication
- ✅ MongoDB integration with Mongoose
- ✅ Repository pattern for data access
- ✅ Docker and docker-compose setup

### Authentication & Security
- ✅ JWT-based authentication with access + refresh tokens
- ✅ User registration with password hashing (bcrypt)
- ✅ Login with credential validation
- ✅ Token refresh mechanism
- ✅ JWT guards for protected routes
- ✅ Email uniqueness validation
- ✅ CORS configuration for frontend

### Logging & Monitoring
- ✅ Centralized Winston-based logging
- ✅ Structured JSON logs with context
- ✅ Request/response logging interceptor
- ✅ Error tracking with stack traces
- ✅ Environment-based log levels
- ✅ Sensitive data redaction (passwords, tokens)
- ✅ File logging support (production)

### Testing
- ✅ Unit tests for AuthenticationService
- ✅ Unit tests for JwtAuthService
- ✅ E2E tests for complete auth flow
- ✅ E2E tests for protected routes
- ✅ Comprehensive error scenario coverage
- ✅ Test coverage reporting

### API & Documentation
- ✅ Global exception filters (HTTP and RPC)
- ✅ Transform interceptors
- ✅ Global validation pipes
- ✅ Swagger/OpenAPI documentation with JWT auth
- ✅ RESTful API design

## Design Patterns Used

- **Repository Pattern**: Abstracts data access logic
- **DTO Pattern**: Request validation and transformation
- **Microservices Pattern**: Service decomposition via TCP
- **Decorator Pattern**: Interceptors and filters
- **Dependency Injection**: NestJS IoC container

## Testing Authentication

### Using cURL

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'

# 2. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# 3. Access protected route (use access token from above)
curl http://localhost:3000/auth/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# 4. Refresh token (use refresh token from above)
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## Logging Examples

The application logs structured information for debugging and monitoring:

### Console Output (Development)
```
2024-11-20 17:30:45 info [AuthenticationService] User logged in { userId: '123', email: 'user@example.com' }
2024-11-20 17:30:46 error [AuthenticationService] Login failed { email: 'user@example.com', error: 'Invalid credentials' }
```

### File Output (Production)
When `LOG_TO_FILE=true`, logs are written to:
- `logs/combined.log` - All logs in JSON format
- `logs/error.log` - Only errors with stack traces

## Testing

### Unit Tests

Unit tests test individual services and components in isolation:

```bash
yarn test

yarn test:watch

yarn test:cov
```

**Test Coverage**:
- ✅ **AuthenticationService**: Registration, login, token refresh, user operations
- ✅ **JwtAuthService**: Token generation, verification, configuration
- ✅ **Error Handling**: Conflict, unauthorized, not found scenarios

**Test Files**:
- `apps/authentication/src/authentication.service.spec.ts` - Service unit tests
- `apps/authentication/src/jwt/jwt.service.spec.ts` - JWT service tests

### E2E Tests

End-to-end tests test complete flows including database and microservice communication:

```bash
# Run E2E tests (requires services running)
yarn test:e2e

# Run specific E2E test
yarn test:e2e auth.e2e-spec.ts
```

**Prerequisites**:
1. MongoDB running (or Docker Compose)
2. Authentication service running: `yarn start:authentication`
3. Optional: Create `.env.test` for test-specific configuration

**E2E Test Coverage**:
- ✅ User registration flow
- ✅ User login flow
- ✅ Token refresh flow
- ✅ Protected routes with JWT guards
- ✅ Complete integration flow (register → login → users → refresh)
- ✅ Error handling (validation, unauthorized, not found)

**Test Files**:
- `apps/gateway/test/auth.e2e-spec.ts` - Complete auth flow tests
- `apps/gateway/test/app.e2e-spec.ts` - Basic gateway tests

### Test Configuration

**Unit Tests** (`package.json`):
- Uses Jest with TypeScript support
- Path mappings for `@common` and `@core` imports
- Coverage collection enabled

**E2E Tests** (`apps/gateway/test/jest-e2e.json`):
- Separate Jest configuration for E2E
- Path mappings configured
- Setup file for environment variables

### Test Environment Setup

Create optional `.env.test` in backend root:

```env
MONGODB_URI=mongodb://localhost:27017/user-management-test
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
GATEWAY_PORT=3000
JWT_SECRET=test-secret-key
LOG_LEVEL=error
```

### Example Test Run

```bash
$ yarn test

PASS  apps/authentication/src/authentication.service.spec.ts
  AuthenticationService
    register
      ✓ should register a new user successfully
      ✓ should throw ConflictException if user already exists
    login
      ✓ should login user successfully
      ✓ should throw UnauthorizedException if user not found
    refreshToken
      ✓ should refresh token successfully
      ...

Test Suites: 2 passed, 2 total
Tests:       16 passed, 16 total
```

For comprehensive testing documentation, see `/backend/TESTING.md`

## License

UNLICENSED
