# ConvoBridge - Full Stack App (Frontend + Backend)

A premium AI calling agent platform with React frontend and Node.js/Express backend powered by MongoDB.

## 🎯 Features

- **AI Calling Agents**: Create and manage multiple AI agents with different personalities and capabilities
- **Live Audio Demo**: Real-time interaction using Google Gemini 2.5 Flash
- **Dashboard**: Monitor calls, agents, and performance metrics
- **Agent Builder**: Step-by-step guided process to create custom agents
- **Contact Management**: Track and manage leads from contact form
- **Authentication**: JWT-based user authentication with secure password hashing
- **Call Logging**: Full transcript and metadata storage for all calls

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Vite
- React Router
- TanStack Query
- Web Audio API + Google Gemini

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)
- Google Gemini API key
- Vercel account (for deployment)

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd convobridge-design-journey
npm install
```

### 2. Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
# Frontend
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_BASE_URL=http://localhost:3001/api

# Backend
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/convobridge
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

#### Getting API Keys

**Google Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into `.env.local`

**MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/convobridge`
4. Add `MONGODB_URI=` prefix

**JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Run Locally

**Development (Frontend Only):**
```bash
npm run dev
# Opens http://localhost:5173
```

**Development (Frontend + Backend):**
```bash
npm run dev:all
# Frontend: http://localhost:5173
# Backend: http://localhost:3001/api
```

**Backend Only:**
```bash
npm run dev:api
```

### 4. Test Endpoints

Once backend is running, test with curl:

```bash
# Health check
curl http://localhost:3001/api/health

# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "company": "Test Company"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Current User (with token)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create new account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "company": "My Company"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`
Sign in to existing account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as signup

#### GET `/api/auth/me`
Get current authenticated user

**Headers:** `Authorization: Bearer {token}`

### Agent Endpoints

#### POST `/api/agents`
Create new agent

**Request:**
```json
{
  "name": "Sales Agent",
  "type": "sales",
  "template": "Sales Agent",
  "systemPrompt": "You are a sales specialist...",
  "voice": "aria",
  "languages": ["English", "Spanish"],
  "personality": 75,
  "integrations": {
    "hubspot": false,
    "salesforce": true
  }
}
```

#### GET `/api/agents`
List all user's agents

#### GET `/api/agents/{id}`
Get specific agent

#### PUT `/api/agents/{id}`
Update agent configuration

#### DELETE `/api/agents/{id}`
Delete agent

### Call Endpoints

#### POST `/api/calls`
Log a completed call

**Request:**
```json
{
  "agentId": "agent_uuid",
  "agentName": "Sales Agent - Emma",
  "phoneNumber": "+1-555-123-4567",
  "duration": 180,
  "outcome": "Lead Qualified",
  "transcript": "Full conversation...",
  "transcriptSnippet": "Agent: Thank you for calling..."
}
```

#### GET `/api/calls`
Get call history with pagination and filters

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `agentId` (filter by agent)
- `status` (completed, missed, in-progress, failed)

#### GET `/api/calls/stats`
Get aggregated call statistics

```json
{
  "success": true,
  "stats": {
    "totalCalls": 42,
    "completedCalls": 39,
    "completionRate": "92.9",
    "totalDuration": 7200,
    "avgDuration": "171.4"
  }
}
```

### Contact Endpoints

#### POST `/api/contacts`
Submit contact form (public endpoint)

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Tech Corp",
  "message": "I'm interested in your platform..."
}
```

#### GET `/api/contacts`
Get all contact submissions (admin)

**Query Parameters:**
- `status` (new, contacted, replied)
- `page`, `limit`

#### PUT `/api/contacts/{id}`
Update contact status (admin)

**Request:**
```json
{
  "status": "contacted"
}
```

## 🏗️ Project Structure

```
convobridge-design-journey/
├── src/                          # React frontend
│   ├── pages/                    # Page components
│   ├── components/               # React components
│   ├── lib/
│   │   └── apiClient.ts          # API client utility
│   └── ...
├── api/                          # Express backend
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── models/                   # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Agent.ts
│   │   ├── Call.ts
│   │   └── Contact.ts
│   ├── controllers/              # Route handlers
│   │   ├── authController.ts
│   │   ├── agentController.ts
│   │   ├── callController.ts
│   │   └── contactController.ts
│   ├── routes/                   # API routes
│   ├── middleware/               # Auth, error handling
│   ├── index.ts                  # Express app setup
│   └── server.ts                 # Server entry point
├── .env.local                    # Local environment variables
├── .env.example                  # Example environment variables
├── package.json                  # Dependencies
└── vercel.json                   # Vercel configuration
```

## 🔐 Authentication Flow

1. User signs up/logs in → `/api/auth/signup` or `/api/auth/login`
2. Server validates credentials and returns JWT token
3. Frontend stores token in `localStorage` as `authToken`
4. Frontend includes token in all authenticated requests: `Authorization: Bearer {token}`
5. Backend validates token in `authenticateJWT` middleware
6. Protected routes return 403 if no valid token

## 🗄️ Database Schema

### User Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  company: String,
  avatar: String,
  role: 'user' | 'admin',
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Agent Collection
```javascript
{
  userId: String (index),
  name: String,
  type: 'sales' | 'support' | 'scheduling' | 'custom',
  systemPrompt: String,
  voice: String,
  languages: [String],
  personality: Number (0-100),
  integrations: { hubspot, salesforce, stripe, zapier },
  stats: { totalCalls, successRate, avgDuration },
  createdAt: Date,
  updatedAt: Date
}
```

### Call Collection
```javascript
{
  userId: String (index),
  agentId: String (index),
  agentName: String,
  phoneNumber: String,
  duration: Number,
  status: 'completed' | 'missed' | 'in-progress' | 'failed',
  outcome: String,
  transcript: String,
  recordingUrl: String,
  transcriptSnippet: String,
  metadata: { caller_name, caller_email, sentiment, callType },
  createdAt: Date,
  updatedAt: Date
}
```

## 🚢 Deployment to Vercel

### Prerequisites
- MongoDB Atlas account with connection string
- Vercel account
- GitHub repository

### Setup Steps

1. **Push to GitHub:**
```bash
git add .
git commit -m "Add backend with MongoDB"
git push origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the project

3. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add the following:
     ```
     VITE_GEMINI_API_KEY=your_key
     VITE_API_BASE_URL=https://your-vercel-url/api
     MONGODB_URI=mongodb+srv://...
     JWT_SECRET=your_secret
     FRONTEND_URL=https://your-vercel-url
     NODE_ENV=production
     ```

4. **Deployment:**
   - Vercel automatically detects `vite.json` configuration
   - Builds frontend with `npm run build`
   - Backend APIs handled by serverless functions
   - Click "Deploy"

### Vercel-Specific Configuration

- **Serverless Functions**: API routes automatically become Vercel Functions
- **Database**: Connection pooling configured for serverless (max pool size: 1)
- **Build Time**: ~2-3 minutes for first deployment
- **Environment**: Automatically uses `NODE_ENV=production`

## 🔍 Monitoring & Debugging

### Local Debugging

**Enable debug logs:**
```bash
DEBUG=* npm run dev:all
```

**Check MongoDB connection:**
```bash
# In browser console after login
fetch('http://localhost:3001/api/health').then(r => r.json()).then(console.log)
```

### Production Debugging

**Vercel Logs:**
- Go to Vercel Project → Deployments
- Click on deployment → "View Function Logs"

**Check API Health:**
```bash
curl https://your-vercel-url/api/health
```

## 🆘 Troubleshooting

### MongoDB Connection Error
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas whitelist includes your IP
- Ensure credentials are correct
- Add `?retryWrites=true` to connection string

### JWT Token Expired
- Frontend automatically refreshes on new login
- Clear `localStorage` and re-login if needed
- Token expiry is set to 7 days

### CORS Error
- Ensure `FRONTEND_URL` and `VITE_API_BASE_URL` match expected domains
- Check that `cors` middleware has correct origin configured

### Vercel Build Fails
- Check "Build Logs" in Vercel dashboard
- Ensure all environment variables are set
- Verify TypeScript compilation: `npm run build`

## 📞 Support & Contact

For issues, questions, or feature requests:
- Email: hello@convobridge.ai
- Website: https://convobridge.dev
- Contact form: https://convobridge.dev/contact-us

## 📄 License

Private - ConvoBridge Inc.

## 🎓 Development Tips

### Adding New API Endpoints

1. Create controller in `api/controllers/`
2. Add routes in `api/routes/`
3. Import routes in `api/index.ts`
4. Add API method to `src/lib/apiClient.ts`
5. Use in React component: `const data = await apiClient.yourNewMethod()`

### Database Migrations

MongoDB doesn't require schema migrations, but changes to Mongoose schemas:

1. Update schema in `api/models/`
2. Mongoose handles schema versioning automatically
3. Deploy to production

### Performance Tips

- Use MongoDB indexes for frequently queried fields (already set)
- Implement pagination for large datasets (implemented)
- Cache agent configs in frontend with React Query
- Monitor API response times in Vercel analytics

---

**Last Updated**: November 24, 2025
**Version**: 1.0.0
