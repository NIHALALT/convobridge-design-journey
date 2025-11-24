# ConvoBridge Developer Quick Reference

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment (copy template)
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Run everything
npm run dev:all

# 4. Open in browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001/api
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/lib/apiClient.ts` | Frontend API client - use this for all API calls |
| `api/config/db.ts` | MongoDB connection setup |
| `api/middleware/auth.ts` | JWT authentication middleware |
| `.env.local` | Your local secrets (never commit!) |
| `.env.example` | Template for environment variables |

## 🔌 Using the API Client

```tsx
import { apiClient } from "@/lib/apiClient";

// Auth
await apiClient.login(email, password);
await apiClient.signup(email, password, name, company);
await apiClient.getCurrentUser();
apiClient.logout();

// Agents
await apiClient.createAgent(agentData);
await apiClient.getAgents();
await apiClient.getAgent(id);
await apiClient.updateAgent(id, agentData);
await apiClient.deleteAgent(id);

// Calls
await apiClient.createCall(callData);
await apiClient.getCalls({ page: 1, limit: 20, status: "completed" });
await apiClient.getCall(id);
await apiClient.getCallStats();

// Contacts
await apiClient.submitContact(contactData);
await apiClient.getContacts();
await apiClient.updateContactStatus(id, "contacted");

// Check auth
if (apiClient.isAuthenticated()) {
  // User is logged in
}
```

## 🏗️ Adding a New API Endpoint

### 1. Create Controller
```typescript
// api/controllers/myFeatureController.ts
export const myAction = async (req, res, next) => {
  try {
    // Do something
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
```

### 2. Create Route
```typescript
// api/routes/myfeature.ts
import express from 'express';
import { myAction } from '../controllers/myFeatureController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();
router.post('/', authenticateJWT, myAction);

export default router;
```

### 3. Register in App
```typescript
// api/index.ts - add to imports and app.use
import myFeatureRoutes from './routes/myfeature';
app.use('/api/myfeature', myFeatureRoutes);
```

### 4. Add to API Client
```typescript
// src/lib/apiClient.ts - add method
async myAction(params: any) {
  const response = await this.client.post('/myfeature', params);
  return response.data;
}
```

### 5. Use in React
```tsx
try {
  const result = await apiClient.myAction(data);
  toast.success("Success!");
} catch (err) {
  toast.error(err.response?.data?.error);
}
```

## 🗄️ Database Schema Reference

### User
```javascript
{
  email: String,           // unique, lowercase
  password: String,        // hashed
  name: String,
  company: String,
  avatar: String,
  role: "user" | "admin",
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Agent
```javascript
{
  userId: String,          // index
  name: String,
  type: "sales" | "support" | "scheduling" | "custom",
  systemPrompt: String,
  voice: String,
  languages: [String],
  personality: Number,     // 0-100
  integrations: {
    salesforce: Boolean,
    hubspot: Boolean,
    stripe: Boolean,
    zapier: Boolean
  },
  stats: {
    totalCalls: Number,
    successRate: Number,
    avgDuration: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Call
```javascript
{
  userId: String,          // index
  agentId: String,         // index
  agentName: String,
  phoneNumber: String,
  duration: Number,        // seconds
  status: "completed" | "missed" | "in-progress" | "failed",
  outcome: String,
  transcript: String,
  recordingUrl: String,
  transcriptSnippet: String,
  metadata: {
    caller_name: String,
    caller_email: String,
    sentiment: String,
    callType: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Contact
```javascript
{
  name: String,
  email: String,           // lowercase
  company: String,
  message: String,
  status: "new" | "contacted" | "replied",
  createdAt: Date,
  updatedAt: Date
}
```

## ⚙️ Environment Variables

**Frontend (exposed to browser):**
```env
VITE_GEMINI_API_KEY=your_key          # Google Gemini API key
VITE_API_BASE_URL=http://localhost:3001/api
```

**Backend (server-only):**
```env
MONGODB_URI=mongodb+srv://...         # MongoDB Atlas connection
JWT_SECRET=your_super_secret_32_chars # JWT signing key
NODE_ENV=development                   # development | production
PORT=3001                              # Server port
FRONTEND_URL=http://localhost:5173    # CORS origin
```

## 🧪 Testing API Endpoints

```bash
# Health check
curl http://localhost:3001/api/health

# Signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ex.com","password":"pass","name":"User"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ex.com","password":"pass"}' | jq -r '.token')

# Authenticated request
curl http://localhost:3001/api/agents \
  -H "Authorization: Bearer $TOKEN"

# Create agent
curl -X POST http://localhost:3001/api/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Sales Agent",
    "type":"sales",
    "template":"Sales Agent",
    "systemPrompt":"You are a sales specialist..."
  }'

# Get calls with filtering
curl "http://localhost:3001/api/calls?page=1&limit=20&status=completed" \
  -H "Authorization: Bearer $TOKEN"
```

## 🐛 Debugging

```javascript
// In browser console:

// Check API base URL
console.log(import.meta.env.VITE_API_BASE_URL)

// Check auth token
console.log(localStorage.getItem('authToken'))

// Test API call
fetch('/api/health').then(r => r.json()).then(console.log)

// Test with auth
fetch('/api/agents', {
  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
}).then(r => r.json()).then(console.log)
```

## 📦 npm Scripts

```bash
npm run dev              # Frontend dev server
npm run dev:api         # Backend dev server
npm run dev:all         # Frontend + Backend together
npm run build           # Production build
npm run preview         # Test production build locally
npm run lint            # Check for errors
npm run start           # Run backend (production)
```

## 🚢 Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] MongoDB connection string working
- [ ] JWT_SECRET is strong and secret
- [ ] Frontend builds without errors: `npm run build`
- [ ] API endpoints tested with real data
- [ ] CORS origin set to Vercel domain
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Authentication flow works end-to-end
- [ ] Token expires and refreshes correctly
- [ ] Error messages are user-friendly

## 💾 Git Workflow

```bash
# New feature branch
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature

# Merge when ready
git checkout main
git merge feature/my-feature
git push origin main
# Vercel auto-deploys
```

## 📞 Getting Help

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| MongoDB connection error | Check `MONGODB_URI` in `.env.local` |
| JWT token invalid | Clear localStorage, re-login |
| CORS error | Check `FRONTEND_URL` environment variable |
| API returns 404 | Check route in `api/routes/` and `api/index.ts` |
| Button disabled during request | Add `disabled={loading}` to button |

## 🔗 Useful Links

- [Express Docs](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Mongoose Docs](https://mongoosejs.com)
- [JWT Info](https://jwt.io)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)

## ⚡ Performance Tips

- Use pagination: `GET /api/calls?page=1&limit=20`
- Limit fields returned when possible
- Cache responses in React Query
- Use indexes for frequently queried fields (already set)
- Monitor API response times in Vercel

## 🔐 Security Checklist

- [ ] Never commit `.env.local` (in `.gitignore`)
- [ ] API keys stored only in environment variables
- [ ] Passwords hashed with bcryptjs
- [ ] Tokens validated on every protected route
- [ ] CORS origin restricted to frontend domain
- [ ] Error messages don't leak sensitive info
- [ ] No credentials in logs or localStorage (except token)
- [ ] JWT_SECRET is random and strong

---

**Pro Tips:**
- Use `npm run dev:all` to see both frontend and backend logs
- Check browser Network tab to debug API calls
- Use Postman for complex API testing
- Read error messages in browser console and terminal
- Keep `.env.local` out of version control!

---

**Last Updated:** November 24, 2025
