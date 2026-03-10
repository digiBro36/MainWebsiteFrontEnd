# Project Concepts & Architecture Guide

This document explains all the key concepts and technologies used in this Next.js frontend project.

---

## 🏗️ Core Technologies

### 1. **Next.js 14** (React Framework)
Next.js is a React framework for production that provides:
- **File-based routing** - Pages are created by files in `/app` folder
- **App Router** - Modern routing system using `/app` directory
- **SSR/SSG** - Server-side rendering and static generation
- **API routes** - Backend endpoints (not used here, we use external API)
- **Built-in optimization** - Image optimization, code splitting

**In this project:**
```
app/
├── page.tsx (Home page)
├── admin/
│   ├── dashboard/page.tsx
│   ├── leads/page.tsx
│   └── login/page.tsx
├── portfolio/page.tsx
├── services/page.tsx
└── contact/page.tsx
```

Each folder represents a route. `/admin/dashboard/page.tsx` = `/admin/dashboard` URL

---

### 2. **TypeScript** (Type Safety)
TypeScript adds static type checking to JavaScript. It catches errors before runtime.

**In this project:**
```typescript
// Define types in /types/index.ts
export interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  active: boolean;
}

// Use types in components
function ServiceCard(props: Service) {
  return <div>{props.title}</div>;
}
```

**Benefits:**
- Autocomplete in IDE
- Catches bugs early
- Self-documenting code
- Refactoring safety

---

### 3. **React** (UI Library)
React is a JavaScript library for building user interfaces with components.

**Component Types Used:**
- **Functional Components** - Functions that return JSX
- **Hook-based** - Using `useState`, `useEffect`, etc.
- **Client Components** - Interactive components with `'use client'`
- **Server Components** - Data fetching components (default in Next.js)

```typescript
'use client'; // Mark as client component

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## 🔄 State Management & Data Fetching

### 4. **React Query (TanStack Query)** 
React Query handles server state management - fetching, caching, and synchronization.

**Core Concepts:**

#### a) **Queries** - Fetching data
```typescript
export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],           // Unique identifier for cache
    queryFn: () => api.get('/services'), // How to fetch
    staleTime: 1000 * 60 * 5,         // How long data is fresh (5 min)
  });
}

// Usage
const { data, isLoading, error } = useServices();
```

**Query Lifecycle:**
1. **Fresh** - Data recently fetched, won't refetch
2. **Stale** - Data old, will refetch on focus
3. **Inactive** - Not used, kept in cache for 5 minutes
4. **Deleted** - Removed from cache

#### b) **Mutations** - Creating/Updating/Deleting data
```typescript
export function useCreateService() {
  const queryClient = useQueryClient();
  
  return useMutation<unknown, unknown, Omit<Service, 'id'>>({
    mutationFn: (data) => api.post('/services', data), // What to do
    onSuccess: () => {
      // Called after success
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// Usage
const { mutate: createService, isPending } = useCreateService();
createService({ title: 'New Service', price: 100, active: true });
```

**Benefits:**
- Automatic request deduplication
- Caching & automatic refetching
- Offline support
- Optimistic updates
- Background refetching

---

### 5. **Zustand** (Client State Management)
Zustand is a lightweight state management library for client-side state (like auth token).

```typescript
// Store definition in /stores/authStore.ts
export interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: getToken(),
      setToken: (token) => {
        if (token) storeToken(token);
        else removeToken();
        set({ token });
      },
      logout: () => {
        removeToken();
        set({ token: null });
      },
    }),
    {
      name: 'dma-auth', // localStorage key
    }
  )
);

// Usage in component
const token = useAuthStore((state) => state.token);
const setToken = useAuthStore((state) => state.setToken);
```

**Use Cases:**
- Authentication state
- UI preferences
- Global notifications
- Not for server data (use React Query)

---

## 🌐 API Integration

### 6. **Axios** (HTTP Client)
Axios is a promise-based HTTP client for making API requests.

```typescript
// Configuration in /lib/api.ts
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Usage
const response = await api.get('/services');
const data = response.data;

// POST request
api.post('/services', { title: 'New' });

// PUT request (update)
api.put(`/services/123`, { title: 'Updated' });

// DELETE request
api.delete(`/services/123`);
```

---

### 7. **Interceptors** (Request/Response Middleware)
Interceptors modify requests before sending and responses before returning.

```typescript
// Request Interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token expired, redirect to login
      removeToken();
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

**Use Cases:**
- Adding auth token to every request
- Handling 401 unauthorized errors
- Logging requests/responses
- Retry logic
- Error transformation

---

### 8. **Authentication (JWT/Bearer Token)**
JWT (JSON Web Token) is a secure way to authenticate requests.

```typescript
// Login flow
1. User submits credentials to /auth/login
2. Backend returns JWT token
3. Token stored in localStorage via Zustand
4. Token sent in Authorization header: "Bearer TOKEN"
5. On 401 error, token cleared and user redirected to login
```

**In this project:**
```typescript
// Login hook in /hooks/useAuth.ts
export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);
  
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: (body) => api.post('/auth/login', body),
    onSuccess: (response) => {
      setToken(response.token); // Store token
      router.push('/admin/dashboard'); // Redirect
    },
  });
}

// Logout
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  return () => {
    logout(); // Clear token
    router.push('/admin/login');
  };
}
```

---

## 🎨 Styling

### 9. **Tailwind CSS** (Utility-First CSS)
Tailwind provides utility classes to build designs without writing CSS.

```typescript
// Instead of writing CSS, use class names
<div className="flex items-center justify-between p-4 bg-blue-500 rounded-lg">
  <h1 className="text-2xl font-bold text-white">Title</h1>
  <button className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
    Click me
  </button>
</div>
```

**Common Classes:**
- `flex`, `grid` - Layout
- `p-4`, `m-2` - Padding/Margin
- `bg-blue-500`, `text-white` - Colors
- `rounded`, `shadow-lg` - Effects
- `hover:`, `focus:` - States
- `md:`, `lg:` - Responsive

**Config:** `tailwind.config.ts`

---

### 10. **PostCSS** (CSS Processing)
PostCSS processes CSS with plugins. Tailwind CSS uses PostCSS.

**Config:** `postcss.config.js`

---

## 📁 Project Structure

### 11. **Folder Organization**

```
app/                 - Next.js pages/routes
├── globals.css      - Global styles
├── layout.tsx       - Root layout (wraps all pages)
├── page.tsx         - Home page (/)
└── admin/           - Admin section (/admin/*)

components/          - Reusable React components
├── admin/           - Admin-specific components
├── marketing/       - Marketing/public components
├── pages/           - Page layout components
└── ui/              - Basic UI components (button, card, etc)

hooks/               - Custom React hooks
├── useAuth.ts       - Authentication hooks
├── useLeads.ts      - Lead management hooks
├── useProjects.ts   - Project management hooks
└── useServices.ts   - Service management hooks

lib/                 - Utility functions & configuration
├── api.ts           - Axios instance & interceptors
├── auth.ts          - Token management
├── utils.ts         - Helper functions
└── validations.ts   - Form validation functions

stores/              - Global state (Zustand)
└── authStore.ts     - Authentication state

types/               - TypeScript type definitions
└── index.ts         - All exported types
```

---

## 🔌 Custom Hooks Pattern

### 12. **Custom Hooks** (React Logic Reuse)
Custom hooks are JavaScript functions that use React hooks and encapsulate logic.

```typescript
// Pattern used in this project
export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => api.get<Service[]>('/services').then(res => res.data),
    staleTime: 1000 * 60 * 5,
  });
}

// Usage in multiple components
function ServiceList() {
  const { data: services, isLoading } = useServices();
  // Component logic
}

function ServiceSelector() {
  const { data: services } = useServices(); // Same data, no extra request
  // Component logic
}
```

**Benefits:**
- Reusable logic across components
- Separation of concerns
- Easier testing
- React Query caching across instances

---

## 🎯 Component Architecture

### 13. **Page Components** (Page-level routes)
Located in `/app` folder, rendered as full pages.

```typescript
// /app/admin/dashboard/page.tsx
export default function DashboardPage() {
  return <AdminLayout><Dashboard /></AdminLayout>;
}
```

### 14. **Layout Components** (Shared layouts)
Wrap multiple pages with common structure.

```typescript
// /app/admin/layout.tsx - wraps all /admin/* pages
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### 15. **Feature Components** (Business logic)
Components that handle specific features.

```typescript
// Components in /components/admin/
- LeadManagementPage.tsx
- ProjectManagementPage.tsx
- ServiceManagementPage.tsx
```

### 16. **UI Components** (Reusable primitives)
Basic building blocks in `/components/ui/`.

```typescript
- button.tsx - Styled button
- card.tsx - Card container
- input.tsx - Form input
- toast.tsx - Notifications
```

---

## 🔄 Data Flow Architecture

### 17. **Unidirectional Data Flow**

```
User Action (click button)
       ↓
Component calls hook (mutate)
       ↓
Hook calls API (mutationFn)
       ↓
Backend processes request
       ↓
Backend returns response
       ↓
Hook invalidates cache (onSuccess)
       ↓
React Query refetches data (queryFn)
       ↓
Components re-render with new data
       ↓
UI updates
```

**Example Flow:**
```typescript
// User deletes a lead
function LeadsTable() {
  const { mutate: deleteLead } = useDeleteLead(); // Hook
  
  const handleDelete = (id: string) => {
    deleteLead(id, {
      onSuccess: () => {
        // Called when API returns 200
        // Query automatically invalidated
        // useLeads() will refetch
        showToast('Lead deleted!');
      },
    });
  };
  
  return <button onClick={() => handleDelete('123')}>Delete</button>;
}
```

---

## 🔐 Security Concepts

### 18. **Authentication Flow**

```
1. User logs in with email/password
   ↓
2. Backend validates and returns JWT token
   ↓
3. Frontend stores token in localStorage
   ↓
4. All subsequent requests include token in Authorization header
   ↓
5. Backend validates token in middleware
   ↓
6. If token invalid/expired (401 error), frontend clears token and redirects to login
```

### 19. **Protected Routes**
Routes that require authentication (handled by backend, not frontend).

---

## 🌍 Environment Variables

### 20. **Configuration Management**

```bash
# .env.local (not committed to git)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Public variables (accessible in browser) prefixed with NEXT_PUBLIC_
# Private variables (only on server) without prefix
```

**Usage in code:**
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api';
```

---

## 🎬 Server vs Client Components

### 21. **Client Components** (`'use client'`)
Run in the browser, can use React hooks.

```typescript
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Used for:**
- Interactive UI (buttons, forms, dropdowns)
- React hooks (useState, useEffect, custom hooks)
- Browser APIs (localStorage, window, etc)

### 22. **Server Components** (default in Next.js 14)
Run on server, can access databases directly.

```typescript
// No 'use client' directive

export default async function Page() {
  const data = await fetch('...'); // Server-only
  return <div>{data}</div>;
}
```

**Used for:**
- Fetching data from database
- Sensitive operations
- Large dependencies
- Access control

---

## 📊 Data Fetching Strategies

### 23. **React Query Query Key Pattern**

Query keys are arrays used for caching and invalidation.

```typescript
// Single resource
queryKey: ['services']

// Collection with filter
queryKey: ['services', { status: 'active' }]

// Specific item
queryKey: ['services', { id: '123' }]

// Nested resources
queryKey: ['projects', { id: '123' }, 'tasks']

// Invalidate all
queryClient.invalidateQueries({ queryKey: ['services'] })

// Invalidate specific
queryClient.invalidateQueries({ queryKey: ['services', { id: '123' }] })
```

---

## 🛠️ Development Patterns

### 24. **Error Handling Pattern**

```typescript
try {
  const response = await api.post('/services', data);
  return response.data;
} catch (error) {
  // Handled by interceptor or component
  throw error;
}
```

### 25. **Loading States Pattern**

```typescript
const { data, isLoading, error } = useServices();

if (isLoading) return <Skeleton />;
if (error) return <ErrorMessage error={error} />;
return <ServiceList services={data} />;
```

### 26. **Optimistic Updates Pattern**

```typescript
useMutation({
  mutationFn: (data) => api.post('/services', data),
  onMutate: (newData) => {
    // Update UI immediately
    queryClient.setQueryData(['services'], (old) => [...old, newData]);
  },
  onError: (error, newData, rollback) => {
    // Rollback on error
    rollback?.();
  },
});
```

---

## 🔗 Integration Points

### 27. **Hook → Component Integration**

```typescript
// 1. Define hook (reusable logic)
export function useServices() { ... }

// 2. Use in component
function ServiceList() {
  const { data: services } = useServices();
  return services?.map(...);
}

// 3. Multiple components use same hook
// → Automatic cache sharing via React Query
// → Single API request, multiple components updated
```

---

## 📦 Package Dependencies

Key packages used:

```json
{
  "react": "18+",                      // UI library
  "next": "14+",                       // React framework
  "typescript": "5+",                  // Type checking
  "@tanstack/react-query": "5+",       // Data fetching
  "zustand": "4+",                     // State management
  "axios": "1.6+",                     // HTTP client
  "tailwindcss": "3+",                 // Styling
  "next-navigation": "built-in"        // Routing
}
```

---

## 🚀 Workflow Summary

```
1. User interacts with component (click, submit)
   ↓
2. Component calls custom hook (useXxx)
   ↓
3. Hook uses React Query mutation/query
   ↓
4. React Query calls Axios API function
   ↓
5. Axios interceptor adds auth token
   ↓
6. Request sent to backend
   ↓
7. Response received, processed by React Query
   ↓
8. Component re-renders with new data
   ↓
9. UI updates (Tailwind styling applied)
```

---

## 📚 Related Files Reference

- **Main config:** `next.config.js`, `tsconfig.json`, `tailwind.config.ts`
- **API layer:** `/lib/api.ts`, `/lib/auth.ts`
- **Hooks:** `/hooks/useXxx.ts`
- **Global state:** `/stores/authStore.ts`
- **Types:** `/types/index.ts`
- **Styling:** `/app/globals.css`, `tailwind.config.ts`

---

## 💡 Key Takeaways

1. **Next.js** - Framework for routing and SSR
2. **TypeScript** - Type safety for development
3. **React** - Component-based UI
4. **React Query** - Server state management and caching
5. **Zustand** - Client state (auth, UI)
6. **Axios** - HTTP requests with interceptors
7. **Tailwind** - Utility-first styling
8. **Hooks** - Reusable logic encapsulation
9. **Custom hooks** - Combine hooks for feature logic
10. **Unidirectional data flow** - Predictable state management
