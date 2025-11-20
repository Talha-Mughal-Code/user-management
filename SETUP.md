# Quick Setup Guide

This guide will help you get the application running in 5 minutes.

## Prerequisites

- Node.js 20+
- Yarn 1.22+
- MongoDB 7+ OR Docker Desktop

## Option 1: Using Docker (Recommended)

### Step 1: Start Backend Services

```bash
cd backend
docker-compose up -d
```

This starts:
- MongoDB (port 27017)
- Authentication Service (TCP port 3001)
- Gateway API (HTTP port 3000)

### Step 2: Start Frontend

```bash
cd ../frontend
yarn install
yarn dev
```

### Step 3: Access Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api

### Stop Services

```bash
cd backend
docker-compose down
```

---

## Option 2: Manual Setup

### Step 1: Install Dependencies

```bash
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install
```

### Step 2: Start MongoDB

Ensure MongoDB is running on localhost:27017.

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Step 3: Start Backend Services

Open **two terminal windows**:

```bash
# Terminal 1: Authentication Service
cd backend
yarn start:authentication

# Terminal 2: Gateway Service
cd backend
yarn start:gateway
```

Wait for both services to log "running on..."

### Step 4: Start Frontend

Open a **third terminal window**:

```bash
cd frontend
yarn dev
```

### Step 5: Access Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api

---

## Test the Application

### 1. Register a New User

Visit http://localhost:3001/register

Fill in the form:
- Name: John Doe
- Email: john@example.com
- Password: SecurePass123

Click "Create Account"

### 2. View Users

After successful registration, you'll be redirected to the users list at http://localhost:3001/users

You should see your newly registered user in a card.

### 3. Test the API

```bash
# Register via API
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "SecurePass456"
  }'

# Get all users
curl http://localhost:3000/auth/users
```

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Check what's using port 3000
lsof -ti:3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Same for port 3001
lsof -ti:3001
kill -9 <PID>
```

### Backend Can't Connect to MongoDB

```bash
# Check MongoDB status
mongosh

# If connection fails, start MongoDB:
# macOS
brew services restart mongodb-community

# Linux
sudo systemctl restart mongod
```

### Frontend Shows Connection Error

1. Verify backend is running: http://localhost:3000/api
2. Check browser console for errors
3. Ensure CORS is enabled in backend

### Docker Issues

```bash
# View logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload during development:

- **Backend**: Changes to `.ts` files auto-restart services
- **Frontend**: Changes to components/pages auto-refresh browser

### View Swagger Documentation

Visit http://localhost:3000/api for interactive API documentation where you can test endpoints directly.

### MongoDB GUI

For easier database management, use:
- MongoDB Compass: https://www.mongodb.com/products/compass
- Connection string: `mongodb://localhost:27017/user-management`

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Docker (if using Docker)

---

## Next Steps

1. **Explore the Code**: Start with:
   - Backend: `backend/apps/gateway/src/modules/auth/`
   - Frontend: `frontend/app/register/page.tsx`

2. **Read Documentation**:
   - Project README: `/README.md`
   - Backend README: `/backend/README.md`
   - Frontend README: `/frontend/README.md`

3. **View Git History**:
   ```bash
   git log --oneline
   ```

4. **Make Changes**: Try modifying components or adding new endpoints!

---

## Quick Command Reference

```bash
# Backend
yarn start:gateway          # Start gateway in watch mode
yarn start:authentication   # Start auth service in watch mode
yarn build                  # Build all apps
yarn lint                   # Run ESLint

# Frontend
yarn dev                    # Start dev server
yarn build                  # Build for production
yarn lint                   # Run ESLint

# Docker
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs -f      # View logs
```

---

## Support

If you encounter any issues not covered here, please check:
1. The main README.md
2. Individual service READMEs
3. Git commit history for implementation details

Happy coding! 🚀

