/**
 * AUTH STORE EXPORTS
 * 
 * PURPOSE:
 * Central export file for all authentication-related functions
 * Re-exports from lib/auth.ts for convenience
 * 
 * USAGE:
 * Instead of: import { getToken, storeToken, useAuthStore } from '@/lib/auth'
 * Use: import { getToken, storeToken, useAuthStore } from '@/stores/authStore'
 * 
 * BENEFITS:
 * - Cleaner imports (stores/ vs lib/)
 * - Easier to refactor later
 * - Single entry point for auth
 * 
 * FUNCTIONS AVAILABLE:
 * - storeToken(token) - Save token to localStorage
 * - getToken() - Retrieve token from localStorage
 * - removeToken() - Clear token from localStorage
 * - useAuthStore() - Zustand hook for auth state
 * 
 * DEBUGGING:
 * - Check imports: Import from stores/authStore, not lib/auth
 * - Re-export check: console.log(useAuthStore)
 * - Should be a function that returns state
 */

export * from '@/lib/auth';
