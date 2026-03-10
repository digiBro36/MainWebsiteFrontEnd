/**
 * PROVIDERS COMPONENT
 * 
 * PURPOSE:
 * Wraps entire app with required context providers and global components
 * Initializes:
 * - React Query (server state management)
 * - Toast notifications (global notifications)
 * - Zustand store (client state, auto-loaded by hooks)
 * 
 * LOCATION: Used in RootLayout, wraps all pages/routes
 * 
 * STATE MANAGEMENT ARCHITECTURE:
 * 
 * Server State (React Query):
 * - Leads, Services, Projects (API data)
 * - Caching, refetching, mutations
 * - Shared across components automatically
 * 
 * Client State (Zustand):
 * - Auth token (persistent in localStorage)
 * - Future: Can add theme, sidebar state, etc
 * 
 * Notifications:
 * - Toast component shows success/error messages
 * - Used by useLeads, useServices mutations
 * 
 * ALGORITHM:
 * 1. Create React Query client with default configs
 * 2. Wrap children with QueryClientProvider
 * 3. Add global Toaster component for notifications
 * 4. Zustand stores auto-init when hooks called
 * 
 * DEBUGGING:
 * - Install React Query DevTools: npm install @tanstack/react-query-devtools
 * - Check cache hits/misses
 * - Monitor pending requests
 * - Inspect stored state
 * 
 * FEATURE IDEAS:
 * - Add React Query DevTools (production disabled)
 * - Add theme provider (dark/light mode)
 * - Add custom error boundary
 * - Add analytics provider
 */

'use client';

import { ReactNode, useState } from 'react';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toast';

/**
 * PROVIDERS COMPONENT
 * 
 * Props:
 * - children: React.ReactNode - All pages/components
 * 
 * Returns: All children wrapped with providers
 * 
 * MUST BE 'use client' because:
 * - useState for React Query client
 * - Children components may use hooks (useQuery, useLeads, etc)
 * - Toast notifications require client rendering
 */
export function Providers({ children }: { children: ReactNode }) {
  /**
   * REACT QUERY CLIENT INITIALIZATION
   * 
   * Purpose: Create singleton React Query client
   * 
   * Strategy: useState(() => new QueryClient())
   * Why useState?
   * - Ensures single client instance for entire app
   * - Not recreated on re-renders
   * - Client persists across page navigation
   * 
   * DEFAULT CONFIG:
   * - staleTime: 1000 * 60 * 5 = 5 minutes (set per hook)
   * - cacheTime: 10 minutes (auto cleanup)
   * - retry: 3 attempts on failed requests
   * - Can be customized per hook via queryKey
   * 
   * CONFIG EXAMPLES:
   * - Increase cache: { cacheTime: 1000 * 60 * 30 } (30 min)
   * - Disable retry: { retry: 0 }
   * - Custom error handling: { onError: (error) => {...} }
   */
  const [queryClient] = useState(() => new QueryClient());

  return (
    /**
     * QUERY CLIENT PROVIDER
     * 
     * Purpose: Provide React Query client to all children
     * 
     * Enables:
     * - useQuery() hooks in components
     * - useMutation() for API calls
     * - Query invalidation and refetching
     * - Automatic cache management
     * 
     * Without this provider, useQuery throws error:
     * "No QueryClient set, use QueryClientProvider to set one"
     */
    <QueryClientProvider client={queryClient}>
      {children}
      
      {/* ═════════════════════════════════════════════════════════
          TOAST NOTIFICATION COMPONENT
          ═════════════════════════════════════════════════════════ */}
      {/* 
        Global toast container
        Displays notifications (success, error, info)
        
        USAGE:
        import { showToast } from '@/components/ui/toast';
        
        showToast({
          type: 'success',
          message: 'Lead created successfully!'
        });
        
        showToast({
          type: 'error',
          message: 'Failed to delete lead'
        });
        
        Can be triggered by:
        - Form submissions
        - API mutations
        - User actions
        
        FEATURE IDEAS:
        - Add toast auto-dismiss after 3 seconds
        - Add toast action buttons (Undo, Retry)
        - Add toast progress bar
        - Add toast animations (slide, fade)
      */}
      <Toaster />
    </QueryClientProvider>
  );
}
