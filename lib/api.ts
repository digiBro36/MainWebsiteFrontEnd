/**
 * API CLIENT SETUP FILE
 * 
 * PURPOSE:
 * This file creates an Axios instance configured for the entire app.
 * It handles:
 * - API base URL configuration
 * - Authentication token injection
 * - Session timeout handling
 * - Error management
 * 
 * ALGORITHM:
 * 1. Create axios instance with base URL (env var or localhost)
 * 2. Request Interceptor: Add JWT token to every request header
 * 3. Response Interceptor: Catch 401 errors (token expired) and redirect to login
 * 
 * DEBUGGING TIPS:
 * - Open browser DevTools > Network tab to see requests
 * - Check if Authorization header is present: "Bearer <token>"
 * - If getting 401, check if token exists in localStorage
 * - Use: console.log('Token:', getToken()) to verify
 * - Check NEXT_PUBLIC_API_URL env variable in .env.local
 * 
 * FEATURE IDEAS:
 * - Add request logging middleware for debugging
 * - Add retry logic for failed requests
 * - Add request timeout error handling
 * - Add loading state management
 * - Add offline mode detection
 */

import axios, { type AxiosRequestHeaders } from 'axios';
import { getToken, removeToken } from './auth';

/**
 * API Base URL Configuration
 * Priority: Environment variable > Default localhost
 * 
 * In .env.local add:
 * NEXT_PUBLIC_API_URL=http://localhost:8080/api
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://mainwebsitebackend.onrender.com/api';


/**
 * Create Axios instance with default config
 * baseURL: Used for all requests (api.get('/leads') becomes BASE_URL/leads)
 * timeout: 10 seconds - request fails if no response
 */
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * REQUEST INTERCEPTOR
 * 
 * Purpose: Automatically add JWT token to every API request
 * 
 * Algorithm:
 * 1. Get token from localStorage (via getToken())
 * 2. If token exists, add it to request headers
 * 3. Format: Authorization: Bearer <token>
 * 4. Pass request to API
 * 
 * Debugging:
 * - Check browser DevTools > Network > Request Headers
 * - Should see: Authorization: Bearer eyJhbGc...
 * - If missing, check localStorage has 'dma_token'
 */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // AxiosRequestHeaders is the correct type for Axios headers.
    // We use a type-safe cast here to avoid TS errors while still
    // keeping existing headers and adding Authorization.
    const headers = (config.headers ?? {}) as AxiosRequestHeaders;
    headers.Authorization = `Bearer ${token}`;
    config.headers = headers;
  }
  return config;
});


/**
 * RESPONSE INTERCEPTOR
 * 
 * Purpose: Handle authentication errors globally
 * 
 * Algorithm:
 * 1. If response successful (2xx), return normally
 * 2. If 401 Unauthorized error:
 *    - Token is invalid/expired
 *    - Remove token from localStorage
 *    - Redirect user to login page
 * 3. For other errors, reject promise
 * 
 * Common Error Codes:
 * - 401: Unauthorized (expired token, invalid credentials)
 * - 403: Forbidden (no permission)
 * - 404: Not Found (endpoint doesn't exist)
 * - 500: Server Error (backend issue)
 * 
 * Debugging:
 * - Check browser DevTools > Console for error messages
 * - Add console.log(error?.response?.status) to see error code
 * - Check if redirected to /admin/login after 401
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token expired or invalid, redirect to login
    if (error?.response?.status === 401) {
      removeToken();
      window.location.href = '/admin/login'; // Force page reload to login
    }
    return Promise.reject(error);
  }
);
