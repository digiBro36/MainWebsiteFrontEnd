# Integration Guide - Backend Setup & Configuration

This guide walks you through everything needed to make your frontend work with your backend. Perfect for first-time projects! 🚀

---

## 📋 Table of Contents

1. [Pre-Integration Checklist](#pre-integration-checklist)
2. [Backend Requirements](#backend-requirements)
3. [Frontend Configuration](#frontend-configuration)
4. [What to Keep & What to Remove](#what-to-keep--what-to-remove)
5. [Step-by-Step Integration](#step-by-step-integration)
6. [Testing](#testing)
7. [Going Live Checklist](#going-live-checklist)

---

## ✅ Pre-Integration Checklist

Before starting, ensure you have:

- [ ] Backend API running and tested
- [ ] Backend endpoints documented (HTTP method, URL, request/response)
- [ ] Database connected to backend
- [ ] JWT authentication implemented on backend
- [ ] CORS enabled on backend (for localhost testing)
- [ ] Node.js 18+ installed
- [ ] Frontend dependencies installed (`npm install`)

---

## 🔌 Backend Requirements

Your backend must provide these endpoints:

### Authentication
```
POST /api/auth/login
  Request: { email: string, password: string }
  Response: { token: string }
  Status: 200 (success) or 401 (invalid credentials)
```

### Leads Management
```
GET    /api/leads
  Response: [ { id, name, email, phone, serviceInterested, message, createdAt } ]

POST   /api/leads
  Request: { name, email, phone?, serviceInterested?, message? }
  Response: { id, name, email, ... createdAt }

DELETE /api/leads/{id}
  Response: { success: true } or 204 No Content
```

### Services Management
```
GET    /api/services
  Response: [ { id, title, description, price, active } ]

POST   /api/services
  Request: { title, description?, price, active }
  Response: { id, title, description, price, active }

PUT    /api/services/{id}
  Request: { title, description?, price, active }
  Response: { id, title, description, price, active }

DELETE /api/services/{id}
  Response: { success: true } or 204 No Content
```

### Projects Management
```
GET    /api/projects
  Response: [ { id, title, description, clientName, imageUrl, projectUrl } ]

POST   /api/projects
  Request: { title, description?, clientName?, imageUrl?, projectUrl? }
  Response: { id, title, ... }

PUT    /api/projects/{id}
  Request: { title, description?, clientName?, imageUrl?, projectUrl? }
  Response: { id, title, ... }

DELETE /api/projects/{id}
  Response: { success: true } or 204 No Content
```

---

## ⚙️ Frontend Configuration

### Step 1: Set Environment Variables

Create `.env.local` file in project root:

```bash
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Or if backend is deployed
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**Important:** Only use `NEXT_PUBLIC_*` prefix for variables you want to expose to browser.

### Step 2: Verify API Configuration

Check `/lib/api.ts` (already configured):

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';

// This creates axios instance with baseURL
export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Requests automatically add Authorization header with token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handles 401 errors - redirects to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      removeToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

✅ **This is already done! No changes needed.**

### Step 3: Enable CORS on Backend

Your backend needs CORS enabled for localhost:

**Node.js/Express example:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
}));
```

**Python/Flask example:**
```python
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
```

---

## 🎯 What to Keep & What to Remove

### ✅ KEEP (Essential Files)

```
✓ /app                      - All pages, don't remove
✓ /components              - All components, don't remove
✓ /hooks                   - All hooks, don't remove
✓ /lib/api.ts             - API configuration, don't modify
✓ /lib/auth.ts            - Token management, don't remove
✓ /types/index.ts         - Type definitions, keep updating
✓ /stores/authStore.ts    - Auth state, don't remove
✓ tailwind.config.ts      - Styling config, keep
✓ tsconfig.json           - TypeScript config, keep
✓ next.config.js          - Next.js config, keep
✓ package.json            - Dependencies, keep
```

### ❌ REMOVE (Demo/Placeholder Data)

**Remove placeholder data if exists:**
- Any hardcoded mock data in components
- Mock API responses
- Test data in `hooks/`
- Demo components that are not used

**Check these files:**
1. `/hooks/useLeads.ts` - Should fetch from API, not mock data
2. `/hooks/useServices.ts` - Should fetch from API, not mock data
3. `/hooks/useProjects.ts` - Should fetch from API, not mock data
4. Any component with `useMemo` or hardcoded arrays

### 📝 UPDATE (Adapt to Your Needs)

```
/types/index.ts            - Update types to match backend response
/components/admin/*        - Update UI to match your brand
/app/globals.css           - Update colors/fonts
tailwind.config.ts         - Customize theme
```

---

## 🚀 Step-by-Step Integration

### Phase 1: Local Testing (Your Computer)

#### 1.1 Start Backend
```bash
# In backend directory
npm start
# or
python app.py
# Backend should run on http://localhost:8080
```

#### 1.2 Configure Frontend
```bash
# In frontend directory, create .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

#### 1.3 Start Frontend
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

#### 1.4 Test Login
1. Open http://localhost:3000/admin/login
2. Enter test credentials
3. Check DevTools (F12) → Network tab
4. You should see POST request to `/auth/login`
5. Response should have `{ "token": "..." }`

**If login fails:**
- Check backend is running: `curl http://localhost:8080/api/services`
- Check credentials are correct in backend
- Check backend returns JWT token
- Check browser console for errors

#### 1.5 Test Data Loading
1. After successful login, go to http://localhost:3000/admin/dashboard
2. Check if data loads from backend
3. Open DevTools → Network tab
4. You should see GET requests to `/leads`, `/services`, `/projects`

**If data doesn't load:**
- Check network requests for errors (red)
- Check response status (should be 200)
- Check backend has data to return
- Check token is valid (not expired)

### Phase 2: Frontend Adjustments

#### 2.1 Update Types (if backend differs)

If your backend returns different field names:

```typescript
// /types/index.ts
export interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  active: boolean;
  // Add or remove fields based on backend
}
```

#### 2.2 Update Components (if needed)

If backend response structure differs, update component code:

```typescript
// Before
{service.description}

// After (if backend uses "desc")
{service.desc}
```

#### 2.3 Update Hooks (if endpoints differ)

If your backend endpoints are different:

```typescript
// /hooks/useServices.ts - Update endpoint names
queryFn: () => api.get('/your-endpoint-name').then(res => res.data)
```

### Phase 3: Production Setup

#### 3.1 Update API URL
```bash
# .env.local for production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

#### 3.2 Build & Test
```bash
npm run build
npm run start
```

#### 3.3 Deploy Frontend
- Deploy to Vercel, Netlify, or your server
- Set environment variables on deployment platform

#### 3.4 Deploy Backend
- Deploy to your server
- Update `NEXT_PUBLIC_API_URL` to production backend

---

## 🧪 Testing Checklist

### Authentication
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Logged-in state persists on page refresh
- [ ] Logout clears token and redirects to login
- [ ] Accessing `/admin/*` without login redirects to login

### Data Management (Leads)
- [ ] Load all leads on `/admin/leads`
- [ ] Create new lead from public contact form
- [ ] Delete lead from admin dashboard
- [ ] Deleted lead disappears from list

### Data Management (Services)
- [ ] Load all services on `/admin/services`
- [ ] Create new service
- [ ] Edit existing service
- [ ] Delete service
- [ ] Services appear on public `/services` page

### Data Management (Projects)
- [ ] Load all projects on `/admin/projects`
- [ ] Create new project
- [ ] Edit existing project
- [ ] Delete project
- [ ] Projects appear on public `/portfolio` page

### Error Handling
- [ ] Network error shows error message
- [ ] Invalid form shows validation error
- [ ] Expired token redirects to login
- [ ] 500 error shows user-friendly message

---

## 🔍 Debugging

### Check Backend Connection
```bash
# Test if backend is running
curl http://localhost:8080/api/services

# Should return service list or []
# If error: backend not running or wrong URL
```

### Check Network Requests
1. Open DevTools: F12
2. Go to Network tab
3. Perform action (login, load data, etc)
4. Look for requests
5. Click request to see details:
   - **Request** tab: method, URL, headers
   - **Response** tab: what backend returned
   - **Status** column: HTTP status code (200=success, 401=auth error, 404=not found)

### Common Issues

**Issue: 404 Not Found**
```
Solution: Check endpoint URL is correct
curl http://localhost:8080/api/services
```

**Issue: 401 Unauthorized**
```
Solution: Token missing or invalid
- Check browser localStorage has token
- Check token is being sent in Authorization header
- Check backend validates token correctly
```

**Issue: 500 Server Error**
```
Solution: Backend crashed or has error
- Check backend console for error messages
- Check backend logs
- Restart backend
```

**Issue: CORS Error**
```
Solution: Backend CORS not configured
- Add CORS headers to backend responses
- Check browser console for full error message
- Verify backend origin matches frontend
```

---

## ✅ Going Live Checklist

### Before Deploying

- [ ] All tests pass locally
- [ ] No console errors in DevTools
- [ ] All endpoints tested
- [ ] Environment variables set correctly
- [ ] Backend running on production URL
- [ ] Backend CORS allows production domain
- [ ] Authentication working end-to-end
- [ ] All CRUD operations tested (Create, Read, Update, Delete)

### Deployment Steps

**Frontend (Vercel/Netlify):**
1. Push code to GitHub
2. Connect to deployment platform
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy
5. Test on deployed URL

**Backend:**
1. Deploy to your server
2. Update database connection
3. Update any API URLs if needed
4. Run migrations
5. Verify API is accessible

### Post-Deployment

- [ ] Visit live URL and test login
- [ ] Test all main features
- [ ] Check DevTools for errors
- [ ] Monitor backend logs for issues
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Backup database

---

## 🛠️ Customization Examples

### Change API Endpoint

If your service endpoint is `/api/v2/services`:

```typescript
// /hooks/useServices.ts - Line 8
queryFn: () => api.get('/v2/services').then(res => res.data),
```

### Handle Different Response Format

If backend returns:
```json
{
  "data": [ { ... } ],
  "status": "success"
}
```

Update hook:
```typescript
queryFn: () => api.get('/services').then(res => res.data.data),
```

### Add New Field to Service

If backend adds `category` field:

```typescript
// /types/index.ts
export interface Service {
  id: string;
  title: string;
  category: string;        // New field
  description?: string;
  price: number;
  active: boolean;
}

// Component now can use: service.category
```

### Add Pagination

If backend supports `?page=1&limit=10`:

```typescript
// /hooks/useServices.ts
export function useServices(page = 1, limit = 10) {
  return useQuery<Service[]>({
    queryKey: ['services', { page, limit }],
    queryFn: () => api.get(`/services?page=${page}&limit=${limit}`).then(res => res.data),
  });
}

// Usage: useServices(2, 20) for page 2 with 20 items
```

---

## 📚 Quick Reference

### File Locations

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables (API URL) |
| `/lib/api.ts` | Axios HTTP client setup |
| `/lib/auth.ts` | Token storage/retrieval |
| `/hooks/useXxx.ts` | Data fetching hooks |
| `/types/index.ts` | TypeScript type definitions |
| `/stores/authStore.ts` | Authentication state |
| `/app/admin/login/page.tsx` | Login page |
| `/components/admin/AdminLayout.tsx` | Admin page layout |

### Important Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Check code quality
```

### Key Technologies

| Tech | Purpose |
|------|---------|
| Next.js | Routing & page framework |
| React Query | Data fetching & caching |
| Axios | HTTP requests |
| Zustand | Authentication state |
| TypeScript | Type safety |
| Tailwind CSS | Styling |

---

## 🎓 Learning Path

If this is your first project, follow this path:

1. **Read this file completely** (you are here)
2. **Read [concepts.md](concepts.md)** - Understand the technologies
3. **Read [calls.md](calls.md)** - Understand backend integration
4. **Read [README.md](README.md)** - Reference guide
5. **Start debugging locally** - Get it working on your computer
6. **Deploy to production** - Follow deployment steps
7. **Monitor and maintain** - Keep it running smoothly

---

## 💡 Pro Tips

1. **Use DevTools Network tab** - Most issues visible in browser
2. **Check backend logs** - Errors often logged on backend
3. **Test with curl first** - Verify backend before debugging frontend
4. **Clear browser cache** - Sometimes old cached data causes issues
5. **Restart dev server** - After env changes, restart with `Ctrl+C` then `npm run dev`
6. **Read error messages carefully** - They usually explain the problem
7. **Google the error** - Stack Overflow usually has answers

---

## 🆘 Getting Help

1. **Check [README.md](README.md) Troubleshooting** section
2. **Check browser console** (F12) for error messages
3. **Check backend logs** for server errors
4. **Search error on Google** - Copy exact error message
5. **Ask on Stack Overflow** - Include error message and code
6. **Check backend API is working** with `curl` command

---

## ✨ You're Ready!

Follow the steps in this guide and your frontend will work with your backend. Start with Phase 1 (Local Testing) and work your way up to deployment.

**Good luck with your first project! 🚀**

If you get stuck, come back to this guide - it has answers!
