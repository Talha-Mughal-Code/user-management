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

# Copy environment variables (create .env file manually)
# MONGODB_URI=mongodb://localhost:27017/user-management
# AUTH_SERVICE_HOST=localhost
# AUTH_SERVICE_PORT=3001
# GATEWAY_PORT=3000
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
yarn test:e2e              # Run e2e tests
yarn test:cov              # Generate coverage report
```

## API Endpoints

The Gateway service exposes the following endpoints on `http://localhost:3000`:

### Authentication

- **POST /auth/register** - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```

- **GET /auth/users** - Get all users
- **GET /auth/users/:id** - Get user by ID

### Swagger Documentation

Once the gateway is running, visit:
- `http://localhost:3000/api` - Interactive API documentation with live testing

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

- `user.register` - Register new user
- `user.findAll` - Get all users

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/user-management |
| AUTH_SERVICE_HOST | Authentication service host | localhost |
| AUTH_SERVICE_PORT | Authentication service TCP port | 3001 |
| GATEWAY_PORT | Gateway HTTP port | 3000 |

## Development Workflow

1. Make changes to the code
2. Services will auto-reload in watch mode
3. Test endpoints via Swagger UI or HTTP client
4. Run linter before committing: `yarn lint`

## Features Implemented

- ✅ NestJS monorepo with gateway and authentication apps
- ✅ TCP microservices communication
- ✅ MongoDB integration with Mongoose
- ✅ User registration with password hashing (bcrypt)
- ✅ Email uniqueness validation
- ✅ Repository pattern for data access
- ✅ Global exception filters (HTTP and RPC)
- ✅ Logging and transform interceptors
- ✅ Global validation pipes
- ✅ Swagger/OpenAPI documentation
- ✅ Docker and docker-compose setup
- ✅ CORS configuration for frontend

## Design Patterns Used

- **Repository Pattern**: Abstracts data access logic
- **DTO Pattern**: Request validation and transformation
- **Microservices Pattern**: Service decomposition via TCP
- **Decorator Pattern**: Interceptors and filters
- **Dependency Injection**: NestJS IoC container

## License

UNLICENSED
