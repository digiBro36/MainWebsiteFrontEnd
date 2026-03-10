/**
 * ADMIN LOGIN PAGE - /admin/login
 * 
 * PURPOSE:
 * Authentication page for admin dashboard access
 * Only unauthenticated users see this page
 * 
 * FEATURES:
 * - Auth protection: Redirects to dashboard if already logged in
 * - Login form with email/password validation
 * - Beautiful gradient background
 * - Responsive design
 * - Error message display
 * 
 * ALGORITHM:
 * 1. Component mounts
 * 2. Check if token exists in authStore
 * 3. If logged in, redirect to dashboard
 * 4. If not logged in, show login form
 * 5. User submits credentials
 * 6. API authenticates and returns token
 * 7. Token stored, user redirected to dashboard
 * 
 * DEBUGGING:
 * - Try accessing /admin/login when logged in
 * - Should redirect to /admin/dashboard
 * - If stuck on login, check localStorage 'dma-auth'
 * - Check network tab for /auth/login POST request
 * - Verify response includes 'token' field
 * 
 * FEATURE IDEAS:
 * - Add "Remember me" checkbox
 * - Add "Forgot password" link
 * - Add social login (Google OAuth, etc)
 * - Add 2FA (two-factor authentication)
 * - Add login history audit log
 * - Add rate limiting for failed attempts
 */

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { LoginForm } from '@/components/admin/LoginForm';

/**
 * ADMIN LOGIN PAGE COMPONENT
 * 
 * LAYOUT:
 * - Two-column layout on desktop (left text, right form)
 * - Single column on mobile
 * - Gradient background
 * - Form in glass-morphism card
 * 
 * RESPONSIVE BREAKPOINTS:
 * - Mobile: Full width, stacked
 * - Tablet: 2 columns with gap
 * - Desktop: 2 columns with gap
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  /**
   * AUTH REDIRECT EFFECT
   * 
   * Purpose: Prevent logged-in users from seeing login page
   * 
   * Algorithm:
   * 1. Check if token exists
   * 2. If yes, redirect to dashboard immediately
   * 3. If no, stay on login page
   * 
   * Dependency: [token, router]
   * Re-runs when token changes (login/logout)
   * 
   * SECURITY: Protects admin from viewing login after auth
   */
  useEffect(() => {
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [token, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 px-6 py-12">
      {/* CONTAINER WITH MAX WIDTH AND CENTERED */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
        
        {/* LEFT COLUMN - Branding and copy */}
        {/* Hidden on mobile, visible on desktop */}
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white">
            Admin access
          </h1>
          <p className="max-w-md text-neutral-text_muted">
            Sign in to manage leads, services, and portfolio projects. Keep your token safe.
          </p>
        </div>

        {/* RIGHT COLUMN - Login form */}
        {/* Glass morphism card for form */}
        <div className="glass rounded-3xl p-10 shadow-glow">
          {/* LOGIN FORM COMPONENT */}
          {/* Handles all form logic, validation, and submission */}
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
