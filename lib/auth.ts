/**
 * AUTHENTICATION & TOKEN MANAGEMENT
 * 
 * PURPOSE:
 * This module handles JWT token storage and retrieval.
 * It provides functions to:
 * - Store token in localStorage after login
 * - Retrieve token for API requests
 * - Remove token on logout
 * - Persist authentication state across page reloads
 * 
 * ALGORITHM - Authentication Flow:
 * 1. User logs in with email/password via LoginForm
 * 2. Backend returns JWT token in AuthResponse
 * 3. Token is stored in localStorage by storeToken()
 * 4. On next page load, getToken() retrieves it
 * 5. API interceptor adds token to all requests
 * 6. On logout/401, token is removed and user redirected to login
 * 
 * Security Notes:
 * - Tokens stored in localStorage are accessible to JavaScript
 * - For highly sensitive apps, use httpOnly cookies instead
 * - Always use HTTPS in production to prevent token theft
 * 
 * Debugging:
 * - Check token: Open DevTools > Application > LocalStorage > dma_token
 * - Token should be long string starting with 'ey' (base64 encoded)
 * - If token is missing, user needs to login again
 * - Test: console.log(getToken()) in any component
 */

import { persist } from 'zustand/middleware';
import create from 'zustand';

/**
 * TOKEN STORAGE KEY
 * Where the JWT token is stored in browser localStorage
 * Key: 'dma_token' (DMA = Digital Marketing Agency)
 */
const TOKEN_KEY = 'dma_token';

/**
 * STORE TOKEN IN LOCALSTORAGE
 * 
 * Purpose: Save JWT token after successful login
 * 
 * Parameters: token - JWT string from backend
 * 
 * Safety: Wrapped in try-catch for browsers with localStorage disabled
 * 
 * Feature Addition:
 * - Add token expiry time: localStorage.setItem('token_expires', Date.now() + 24*60*60*1000)
 * - Add validation: Check token format before storing
 */
export function storeToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Silently fail if localStorage is unavailable (private browsing, etc)
  }
}

/**
 * GET TOKEN FROM LOCALSTORAGE
 * 
 * Purpose: Retrieve stored JWT token for API requests
 * 
 * Returns: Token string or null if not found
 * 
 * Safety Check: if (typeof window === 'undefined') 
 * - Prevents errors on server-side rendering
 * - Returns null on server, token on client
 * 
 * Debugging:
 * - If returns null, user must login
 * - If returns old token, localStorage may not have cleared
 */
export function getToken() {
  // Only access localStorage on client-side (not during SSR)
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * REMOVE TOKEN FROM LOCALSTORAGE
 * 
 * Purpose: Clear token on logout or session expiration
 * 
 * Called by:
 * - useLogout() hook when user clicks logout
 * - API response interceptor on 401 errors
 * - authStore.logout()
 * 
 * Effect: User must login again to use admin features
 */
export function removeToken() {
  // Only access localStorage on client-side
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * AUTH STORE STATE INTERFACE
 * 
 * Purpose: Define the shape of auth state in Zustand
 * 
 * State Properties:
 * - token: Current JWT token (null if not logged in)
 * - setToken: Function to update token
 * - logout: Function to clear token and state
 * 
 * Feature Addition:
 * - Add: user: User | null - store user info
 * - Add: isLoading: boolean - track login progress
 * - Add: error: string | null - store error messages
 */
export interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

/**
 * ZUSTAND AUTH STORE
 * 
 * PURPOSE:
 * Global state management for authentication.
 * Accessible from any component: useAuthStore((state) => state.token)
 * 
 * ALGORITHM - State Persistence:
 * 1. Initialize token from localStorage via getToken()
 * 2. When token changes, call setToken() which:
 *    - Saves to localStorage if token exists
 *    - Removes from localStorage if token is null
 *    - Updates Zustand store
 * 3. State persisted with 'dma-auth' key in localStorage
 * 
 * DEBUGGING:
 * - Check store: Open DevTools console
 * - Run: import { useAuthStore } from '@/stores/authStore'
 *        useAuthStore((state) => state.token) // returns current token
 * - Subscribe to changes: 
 *   useAuthStore.subscribe(state => console.log('Auth changed:', state.token))
 * 
 * USAGE IN COMPONENTS:
 * const token = useAuthStore((state) => state.token);
 * const setToken = useAuthStore((state) => state.setToken);
 * const logout = useAuthStore((state) => state.logout);
 * 
 * FEATURE IDEAS:
 * - Add user profile to store: token + user info
 * - Add loading state for async operations
 * - Add error tracking for failed login attempts
 * - Add remember-me functionality with expiry
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state: get token from localStorage
      token: getToken(),
      
      // Action: Update token in state and localStorage
      setToken: (token) => {
        if (token) {
          storeToken(token); // Save to localStorage
        } else {
          removeToken(); // Clear from localStorage
        }
        set({ token });
      },
      
      // Action: Clear everything and return to logged-out state
      logout: () => {
        removeToken();
        set({ token: null });
      },
    }),
    {
      name: 'dma-auth', // Key used in localStorage
      // Only persist 'token' field (not the functions)
      partialize: (state) => ({ token: state.token }),
    }
  )
);
