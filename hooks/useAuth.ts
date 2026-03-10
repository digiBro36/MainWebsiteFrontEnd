/**
 * AUTHENTICATION HOOKS
 * 
 * PURPOSE:
 * Custom React hooks for handling admin login and logout.
 * Provides:
 * - Login mutation with API call
 * - Token storage and state management
 * - Automatic redirect to dashboard
 * - Logout functionality
 * 
 * LIBRARY: React Query (for API state) + Zustand (for auth state)
 */

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { AuthResponse } from '@/types';

/**
 * LOGIN CREDENTIALS TYPE
 * 
 * Purpose: Defines shape of login form data
 * Used by: LoginForm component
 * 
 * Fields:
 * - email: Admin email
 * - password: Admin password
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * USE LOGIN HOOK - useLogin()
 * 
 * PURPOSE:
 * Handle admin login process
 * 
 * ALGORITHM:
 * 1. User submits email/password via LoginForm
 * 2. useMutation calls API: POST /auth/login with credentials
 * 3. Backend validates and returns JWT token
 * 4. Token stored in authStore (persists to localStorage)
 * 5. useRouter redirects to /admin/dashboard
 * 6. API interceptor adds token to future requests
 * 
 * RETURN VALUES:
 * - mutate(credentials) - Call to trigger login
 * - isPending - True while login in progress
 * - isError - True if login failed
 * - error - Error object if failed
 * 
 * USAGE IN COMPONENT:
 * const { mutate, isPending, isError } = useLogin();
 * const onSubmit = (data) => mutate(data);
 * 
 * DEBUGGING:
 * - Check API endpoint: POST http://localhost:8080/api/auth/login
 * - Check response has 'token' field
 * - Verify token stored: console.log(getToken()) in browser
 * - Check redirect happens (go to /admin/dashboard)
 * 
 * ERROR HANDLING:
 * - 400: Invalid email/password format
 * - 401: Wrong credentials
 * - 500: Server error
 * 
 * FEATURE IDEAS:
 * - Add 'remember me' checkbox to extend expiry
 * - Add 2FA (two-factor authentication)
 * - Add login attempt rate limiting
 * - Add login history logging
 * - Add password reset flow
 */
export function useLogin() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation<AuthResponse, Error, LoginCredentials>({
    // API call: POST /auth/login
    mutationFn: (body) => api.post<AuthResponse>('/auth/login', body).then((res) => res.data),
    
    // On success: Store token and redirect
    onSuccess: (response) => {
      setToken(response.token); // Save token to store + localStorage
      router.push('/admin/dashboard'); // Redirect to dashboard
    },
    
    // Optional: Add error logging
    // onError: (error) => console.error('Login failed:', error)
  });
}

/**
 * USE LOGOUT HOOK - useLogout()
 * 
 * PURPOSE:
 * Handle admin logout process
 * 
 * ALGORITHM:
 * 1. User clicks logout button
 * 2. logout() is called from authStore
 * 3. Token removed from localStorage
 * 4. Auth state cleared
 * 5. Router redirects to /admin/login
 * 
 * RETURNS:
 * Function that executes logout when called
 * 
 * USAGE IN COMPONENT:
 * const logout = useLogout();
 * <button onClick={logout}>Logout</button>
 * 
 * DEBUGGING:
 * - Check token removed: console.log(getToken()) should return null
 * - Check redirect to login page
 * - Check session cleared (localStorage 'dma-auth' should update)
 * 
 * FEATURE IDEAS:
 * - Add logout confirmation dialog
 * - Add logout reason/audit log
 * - Add "logout from all devices" option
 * - Add session timeout automatic logout
 * - Add clear browser cache on logout
 */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return () => {
    logout(); // Clear token from state and localStorage
    router.push('/admin/login'); // Redirect to login page
  };
}
