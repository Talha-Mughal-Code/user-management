# User Management Backend - NestJS Monorepo

A production-ready NestJS monorepo implementing microservices architecture with TCP communication for user management.

## Architecture

```
backend/
├── apps/
│   ├── gateway/          # HTTP API Gateway (Port 3000)
│   └── authentication/   # User Authentication Service (TCP Port 3001)
├── common/              # Shared DTOs, interfaces
├── core/               # Core modules (config, database)
└── docker-compose.yml  # Docker orchestration
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

- `POST /auth/register` - Register a new user
- `GET /auth/users` - Get all users

### Swagger Documentation

Once the gateway is running, visit:
- `http://localhost:3000/api` - Interactive API documentation

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

## Next Steps

- [ ] Implement authentication service business logic
- [ ] Implement gateway endpoints
- [ ] Add comprehensive error handling
- [ ] Add request/response interceptors
- [ ] Configure global validation pipes
- [ ] Add unit and e2e tests

## License

UNLICENSED
