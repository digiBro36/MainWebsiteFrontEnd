# Frontend Codebase Documentation

## Overview
This is a complete Next.js full-stack digital agency template with admin dashboard, authentication, and portfolio management.

## Project Structure

### Core Architecture
```
Frontend (Next.js + React)
    ├── Authentication (JWT tokens, Zustand store)
    ├── API Client (Axios with interceptors)
    ├── Data Management (React Query)
    ├── UI Components (Tailwind CSS + CVA)
    └── Pages (App Router)
```

## Key Files Documentation

### 1. **Authentication System** 
- **Location**: `lib/auth.ts` & `stores/authStore.ts`
- **Purpose**: Handles JWT token storage and Zustand state management
- **Key Functions**:
  - `storeToken()` - Save JWT to localStorage
  - `getToken()` - Retrieve JWT from localStorage  
  - `removeToken()` - Clear JWT on logout
  - `useAuthStore()` - Zustand hook for auth state
- **Algorithm**: 
  1. User logs in → JWT received from backend
  2. Token stored in localStorage (key: 'dma_token')
  3. Zustand store keeps in-memory copy for React
  4. API interceptor adds token to all requests
  5. On 401 response → Token cleared → User redirected to login

### 2. **API Client**
- **Location**: `lib/api.ts`
- **Purpose**: Axios instance with authentication and error handling
- **Features**:
  - Request interceptor: Adds Bearer token to headers
  - Response interceptor: Handles 401 (expired tokens)
  - 10-second timeout
  - Base URL from env variable
- **Usage**: `api.get('/leads')`, `api.post('/services', data)`, etc.

### 3. **Type Definitions**
- **Location**: `types/index.ts`
- **Interfaces**:
  - `User` - Admin user info
  - `Lead` - Contact form submissions
  - `Service` - Agency service offerings
  - `Project` - Portfolio projects
  - `AuthResponse` - Login response with JWT

### 4. **Validation Schemas**
- **Location**: `lib/validations.ts`
- **Uses**: Zod for runtime validation
- **Schemas**:
  - `loginSchema` - Email + 6+ char password
  - `leadSchema` - Contact form (2+ name, valid email, 10+ message)
  - `serviceSchema` - Service details (3+ title, non-negative price)
  - `projectSchema` - Portfolio item (3+ title, valid URLs)

### 5. **Hooks - Authentication**
- **Location**: `hooks/useAuth.ts`
- **Hooks**:
  - `useLogin()` - Handles login mutation + token storage + redirect
  - `useLogout()` - Clears token and redirects to login

### 6. **Hooks - Data Management**
- **Location**: `hooks/useLeads.ts`, `useServices.ts`, `useProjects.ts`
- **Pattern**: React Query hooks for CRUD operations
- **Uses**:
  - `useXX()` - Fetch data (GET)
  - `useCreateXX()` - Create data (POST)
  - `useUpdateXX()` - Update data (PUT)
  - `useDeleteXX()` - Delete data (DELETE)
- **Features**:
  - 5-minute cache (staleTime)
  - Automatic refetch on mutations
  - Error handling via React Query

### 7. **Components - Admin**
- **LoginForm**: Email/password form with Zod validation
- **AdminLayout**: Sidebar nav + header + auth protection
- **RecentLeadsTable**: Display latest 5 leads with delete action
- **StatCard**: KPI display card (leads, services, projects, conversion)
- **Dashboard**: Main admin page with stats + charts + timeline

### 8. **Components - Marketing**
- **Hero**: Landing page hero with animations
- **ServicesSection**: Display agency services
- **PortfolioSection**: Showcase completed projects
- **StatsSection**: Company metrics
- **TestimonialsSection**: Client testimonials
- **ContactSection**: Contact form
- **Footer**: Footer links and info

### 9. **Pages**
- **app/page.tsx** - Homepage (main landing page)
- **app/admin/login/page.tsx** - Admin login page
- **app/admin/dashboard/page.tsx** - Admin dashboard with KPIs
- **app/layout.tsx** - Root layout with metadata and providers
- **app/admin/layout.tsx** - Admin layout wrapper

### 10. **UI Components**
- **Button**: CVA-based button with variants and sizes
- **Input**: Form input with error display
- **Card**: Reusable card component
- **Toast**: Notification system (react-hot-toast)

## Data Flow Diagram

```
User Actions
    ↓
React Component
    ↓
Hook (useQuery/useMutation)
    ↓
React Query
    ↓
API Client (axios)
    ↓
Request Interceptor (add auth)
    ↓
Backend API
    ↓
Response Interceptor (handle 401)
    ↓
Cache + Component Update
```

## Authentication Flow

```
1. User visits /admin/login
2. Enters email/password
3. LoginForm validates with Zod
4. useLogin() calls API: POST /auth/login
5. Backend returns { token: "..." }
6. Token stored: localStorage + Zustand
7. API interceptor adds to all requests
8. Redirect to /admin/dashboard
9. AdminLayout checks token, renders dashboard
10. useLeads, useServices, useProjects fetch data
11. On logout: removeToken() + Zustand update + redirect to login
```

## State Management

### React Query (Server State)
- Manages API data: Leads, Services, Projects
- Caching with 5-minute stale time
- Automatic refetch on mutations
- Prevents redundant API calls

### Zustand (Client State)
- Auth store: Token + setToken() + logout()
- Persists to localStorage automatically
- Available in any component via hook

## Debugging Tips

### Check Authentication
```javascript
// In browser console
import { useAuthStore } from '@/stores/authStore'
console.log(useAuthStore((s) => s.token))  // Should show JWT or null
```

### Check API Requests
```javascript
// Open DevTools > Network tab
// Look for API calls to /leads, /services, /projects
// Check Authorization header present
// Verify response status is 200, not 401
```

### Check React Query Cache
```javascript
// Install React Query DevTools
// Or check: queryClient.getQueryData(['leads'])
```

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `"No QueryClient set"` | Providers wrapper missing | Check RootLayout has Providers |
| `401 Unauthorized` | Invalid/expired token | Token not in localStorage, check login |
| `API returns 404` | Wrong endpoint URL | Check backend routes and API_BASE_URL |
| `Cannot read property 'map' of undefined` | No default value for data | Use `{ data: leads = [] }` destructuring |
| `Toast not showing` | Toaster not rendered | Check Providers includes `<Toaster />` |

## Adding New Features

### Add New Data Type (e.g., Testimonials)

1. **Define Type** (`types/index.ts`):
```typescript
export interface Testimonial {
  id: string;
  clientName: string;
  content: string;
  rating: number;
}
```

2. **Create Validation** (`lib/validations.ts`):
```typescript
export const testimonialSchema = z.object({
  clientName: z.string().min(2),
  content: z.string().min(10),
  rating: z.number().min(1).max(5),
});
```

3. **Create Hooks** (`hooks/useTestimonials.ts`):
```typescript
export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: () => api.get('/testimonials').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/testimonials', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
}
```

4. **Create Components**:
- `components/marketing/TestimonialCard.tsx` - Display single
- `components/admin/TestimonialManagementPage.tsx` - Admin CRUD

5. **Add Routes**:
- `app/admin/testimonials/page.tsx` - Admin page

### Add New Authentication Method (Google OAuth)

1. Install package: `npm install @react-oauth/google`
2. Wrap app with GoogleOAuthProvider
3. Create Google login button component
4. Update useLogin() to handle OAuth flow
5. Backend exchanges OAuth token for JWT

## Performance Optimization

### Already Implemented
- React Query caching (5 minutes)
- Memoization in dashboards (useMemo)
- Image optimization (next/image)
- Code splitting (App Router)
- SSR for SEO

### Further Improvements
- Add request debouncing for search
- Implement pagination instead of showing all data
- Lazy load components with next/dynamic
- Add service worker for offline support
- Implement virtual scrolling for large lists

## Deployment Checklist

- [ ] Set `NEXT_PUBLIC_API_URL` environment variable
- [ ] Verify backend API is accessible
- [ ] Test login flow works
- [ ] Check CORS headers configured on backend
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags for tokens (httpOnly)
- [ ] Update metadata title/description
- [ ] Add proper error logging (Sentry, etc)
- [ ] Configure analytics (Google Analytics, Mixpanel)
- [ ] Set up monitoring and alerts

## Common Customizations

### Change Primary Color
- Tailwind config: `tailwind.config.ts`
- Update `primary-500`, `primary-600` colors

### Update Hero Section
- Edit: `components/marketing/Hero.tsx`
- Change headline, description, buttons

### Add Admin Role Restrictions
- Update `types/index.ts` UserRole type
- Add permission checks in `AdminLayout.tsx`
- Add role-based endpoint authorization

### Customize Authentication
- Add 2FA: Modify `useLogin()` flow
- Add social login: Update LoginForm
- Add password reset: New page + hooks

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Query Docs**: https://tanstack.com/query/latest
- **Zustand Docs**: https://github.com/pmndrs/zustand
- **Tailwind CSS**: https://tailwindcss.com
- **Framer Motion**: https://www.framer.com/motion
- **Zod**: https://zod.dev

---

**Last Updated**: March 8, 2026

All files have been documented with comprehensive comments explaining:
- Purpose of each module/component
- Algorithm/data flow
- How to debug issues
- Feature expansion ideas
