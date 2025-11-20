# User Management Backend - NestJS Monorepo

A NestJS monorepo implementing microservices architecture with TCP communication for user management.

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
yarn install

MONGODB_URI=mongodb://localhost:27017/user-management

AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001
GATEWAY_PORT=3000

JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

CORS_ORIGIN=http://localhost:3001

LOG_LEVEL=info
LOG_TO_FILE=false
LOG_DIRECTORY=./logs
```

## Development

### Local Development (without Docker)

Make sure MongoDB is running locally on port 27017.

```bash
yarn start:authentication

yarn start:gateway
```

### Using Docker Compose

```bash
docker-compose up -d

docker-compose logs -f

docker-compose down
```

## Available Scripts

```bash
yarn start:gateway           # Start gateway in watch mode
yarn start:authentication    # Start auth service in watch mode

yarn build                   # Build all apps
yarn build:gateway          # Build gateway only
yarn build:authentication   # Build auth service only

yarn lint                   # Run ESLint
yarn format                 # Format code with Prettier

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

## Microservices Communication

Services communicate via TCP using message patterns:

- `user.register` - Register new user (returns user + tokens)
- `user.login` - Authenticate user (returns user + tokens)
- `user.refresh` - Refresh JWT tokens (returns new tokens)
- `user.findAll` - Get all users
- `user.findById` - Get user by ID