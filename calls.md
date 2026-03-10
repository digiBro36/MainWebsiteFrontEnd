# Backend API Integration & Feature Guide

## Overview

This document provides the backend API endpoints, how to add new features, and best practices for calling the backend from the frontend.

---

## 📡 Backend API Base URL

```
http://localhost:8080/api
```

Or set via environment variable: `NEXT_PUBLIC_API_URL`

---

## 🔐 Authentication

All requests (except login) require an Authorization header:

```
Authorization: Bearer <token>
```

The token is automatically added by the API interceptor in `/lib/api.ts`

---

## 📋 Backend Endpoints

### 1. Authentication Endpoints

#### Login

- **Method:** `POST`
- **Endpoint:** `/auth/login`
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Frontend Hook:** `useLogin()` from `hooks/useAuth.ts`

#### Logout

- **Method:** `POST`
- **Endpoint:** `/auth/logout` (optional, handled client-side)
- **Frontend Hook:** `useLogout()` from `hooks/useAuth.ts`

---

### 2. Leads Endpoints

#### Get All Leads

- **Method:** `GET`
- **Endpoint:** `/leads`
- **Query Params:** None
- **Response:**
  ```json
  [
    {
      "id": "lead-1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "serviceInterested": "Web Development",
      "message": "Interested in your services",
      "createdAt": "2026-03-08T10:00:00Z"
    }
  ]
  ```
- **Frontend Hook:** `useLeads()` from `hooks/useLeads.ts`

#### Create Lead

- **Method:** `POST`
- **Endpoint:** `/leads`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "serviceInterested": "Web Development",
    "message": "Interested in your services"
  }
  ```
- **Response:** Created lead object with `id` and `createdAt`
- **Frontend Hook:** `useCreateLead()` from `hooks/useLeads.ts`

#### Delete Lead

- **Method:** `DELETE`
- **Endpoint:** `/leads/{id}`
- **Response:** `{ "success": true }`
- **Frontend Hook:** `useDeleteLead()` from `hooks/useLeads.ts`

---

### 3. Services Endpoints

#### Get All Services

- **Method:** `GET`
- **Endpoint:** `/services`
- **Response:**
  ```json
  [
    {
      "id": "service-1",
      "title": "Web Development",
      "description": "Custom web applications",
      "price": 5000,
      "active": true
    }
  ]
  ```
- **Frontend Hook:** `useServices()` from `hooks/useServices.ts`

#### Create Service

- **Method:** `POST`
- **Endpoint:** `/services`
- **Request Body:**
  ```json
  {
    "title": "Web Development",
    "description": "Custom web applications",
    "price": 5000,
    "active": true
  }
  ```
- **Frontend Hook:** `useCreateService()` from `hooks/useServices.ts`

#### Update Service

- **Method:** `PUT`
- **Endpoint:** `/services/{id}`
- **Request Body:** Same as create
- **Frontend Hook:** `useUpdateService()` from `hooks/useServices.ts`

#### Delete Service

- **Method:** `DELETE`
- **Endpoint:** `/services/{id}`
- **Frontend Hook:** `useDeleteService()` from `hooks/useServices.ts`

---

### 4. Projects Endpoints

#### Get All Projects

- **Method:** `GET`
- **Endpoint:** `/projects`
- **Response:**
  ```json
  [
    {
      "id": "project-1",
      "title": "E-commerce Platform",
      "description": "Online store with payment integration",
      "clientName": "ABC Corp",
      "imageUrl": "https://example.com/image.jpg",
      "projectUrl": "https://project.example.com"
    }
  ]
  ```
- **Frontend Hook:** `useProjects()` from `hooks/useProjects.ts`

#### Create Project

- **Method:** `POST`
- **Endpoint:** `/projects`
- **Request Body:**
  ```json
  {
    "title": "E-commerce Platform",
    "description": "Online store with payment integration",
    "clientName": "ABC Corp",
    "imageUrl": "https://example.com/image.jpg",
    "projectUrl": "https://project.example.com"
  }
  ```
- **Frontend Hook:** `useCreateProject()` from `hooks/useProjects.ts`

#### Update Project

- **Method:** `PUT`
- **Endpoint:** `/projects/{id}`
- **Request Body:** Same as create
- **Frontend Hook:** `useUpdateProject()` from `hooks/useProjects.ts`

#### Delete Project

- **Method:** `DELETE`
- **Endpoint:** `/projects/{id}`
- **Frontend Hook:** `useDeleteProject()` from `hooks/useProjects.ts`

---

## 🚀 How to Add New Features

### Step 1: Define Types

Update `/types/index.ts` with your new data type:

```typescript
export interface NewEntity {
  id: string;
  name: string;
  // ... other fields
}
```

### Step 2: Create a Hook

Create a new file in `/hooks/useNewEntity.ts`:

```typescript
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { NewEntity } from "@/types";

export function useNewEntities() {
  return useQuery<NewEntity[]>({
    queryKey: ["newEntities"],
    queryFn: () =>
      api.get<NewEntity[]>("/new-entities").then((res) => res.data),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateNewEntity() {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Omit<NewEntity, "id">>({
    mutationFn: (data) => api.post<NewEntity>("/new-entities", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newEntities"] });
    },
  });
}

export function useUpdateNewEntity() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    unknown,
    { id: string; data: Omit<NewEntity, "id"> }
  >({
    mutationFn: ({ id, data }) =>
      api.put<NewEntity>(`/new-entities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newEntities"] });
    },
  });
}

export function useDeleteNewEntity() {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, string>({
    mutationFn: (id) => api.delete(`/new-entities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newEntities"] });
    },
  });
}
```

### Step 3: Use the Hook in Components

```typescript
'use client';

import { useNewEntities, useCreateNewEntity } from '@/hooks/useNewEntity';

export function MyComponent() {
  const { data: entities } = useNewEntities();
  const { mutate: createEntity } = useCreateNewEntity();

  const handleCreate = async (name: string) => {
    createEntity({ name });
  };

  return (
    <div>
      {entities?.map((entity) => (
        <div key={entity.id}>{entity.name}</div>
      ))}
    </div>
  );
}
```

---

## 🔄 Hook Usage Patterns

### Query Pattern (Fetching Data)

```typescript
const { data, isLoading, error } = useServices();

if (isLoading) return <div>Loading...</div>;
if (error) return <div>Error: {error.message}</div>;

return data?.map(service => <div key={service.id}>{service.title}</div>);
```

### Mutation Pattern (Creating/Updating/Deleting)

```typescript
const { mutate: createService, isPending } = useCreateService();

const handleCreate = (serviceData) => {
  createService(serviceData, {
    onSuccess: () => {
      console.log('Service created!');
    },
    onError: (error) => {
      console.error('Failed to create service:', error);
    },
  });
};

return (
  <button onClick={() => handleCreate({...})} disabled={isPending}>
    {isPending ? 'Creating...' : 'Create Service'}
  </button>
);
```

### Update Pattern

```typescript
const { mutate: updateService } = useUpdateService();

const handleUpdate = (id: string, data: Omit<Service, "id">) => {
  updateService({ id, data });
};
```

---

## ⚠️ Error Handling

The API interceptor in `/lib/api.ts` automatically:

- Adds authentication token to requests
- Handles 401 Unauthorized responses by redirecting to login
- Rejects with error details

Handle errors in components:

```typescript
const { mutate, error } = useCreateService();

mutate(data, {
  onError: (error: any) => {
    const message = error?.response?.data?.message || error.message;
    showErrorToast(message);
  },
});
```

---

## 🛠️ Debugging

### Check API Configuration

File: `/lib/api.ts`

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
```

### View Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Check request headers for Authorization token
4. Verify response status and data

### Test Endpoints Manually

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test get services (with token)
curl -X GET http://localhost:8080/api/services \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Best Practices

1. **Always use hooks** - Don't call `api` directly in components
2. **Handle loading states** - Show spinners/skeletons during requests
3. **Handle errors** - Display user-friendly error messages
4. **Invalidate queries** - Use `queryClient.invalidateQueries()` after mutations
5. **Use 'use client' directive** - Add `'use client'` at the top of hook files
6. **Type safety** - Always define types in `/types/index.ts`
7. **Stale time** - Set appropriate `staleTime` values (5 minutes default)

---

## 🔗 File References

- API Configuration: `/lib/api.ts`
- Authentication: `/lib/auth.ts`
- Hooks: `/hooks/useXxx.ts`
- Types: `/types/index.ts`
- Auth Store: `/stores/authStore.ts`

---

## 📚 Related Documentation

- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js Documentation](https://nextjs.org/docs)
- [Axios Documentation](https://axios-http.com/)
