/**
 * ADMIN LAYOUT COMPONENT
 * 
 * PURPOSE:
 * Main layout wrapper for all admin pages
 * Provides:
 * - Sidebar navigation
 * - Header with user info
 * - Authentication protection (redirect if not logged in)
 * - Responsive design (mobile hamburger menu)
 * 
 * ALGORITHM:
 * 1. Check if token exists in authStore
 * 2. If no token, redirect to login page
 * 3. Render sidebar with navigation links
 * 4. Render main content area
 * 5. Highlight current page in nav
 * 
 * STRUCTURE:
 * - Sidebar (desktop only): Logo + Navigation + User info + Logout
 * - Header (mobile): Menu icon + Title + Logout
 * - Main content: Children from page
 * 
 * DEBUGGING:
 * - Check token in authStore: console.log(useAuthStore((s) => s.token))
 * - Verify redirect to /admin/login if not logged in
 * - Check current page highlighted in nav
 * - Test responsive: Open DevTools, set mobile view
 * 
 * FEATURE IDEAS:
 * - Add notification bell
 * - Add user profile dropdown menu
 * - Add dark/light mode toggle
 * - Add mobile sidebar toggle (currently hamburger only)
 * - Add breadcrumb navigation
 * - Add recent items quick access
 */

'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

/**
 * NAVIGATION ITEMS
 * 
 * Purpose: Define sidebar navigation links
 * Format: {label, href}
 * Used by: Navigation rendering loop
 * 
 * FEATURE: Add icons
 * const navItems = [
 *   { label: 'Dashboard', href: '/admin/dashboard', icon: Dashboard },
 *   { label: 'Leads', href: '/admin/leads', icon: Users },
 *   ...
 * ]
 * Then render: <item.icon className="w-5 h-5 mr-2" />
 */
const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Leads', href: '/admin/leads' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Settings', href: '/admin/settings' },
];

/**
 * ADMIN LAYOUT COMPONENT
 * 
 * Props:
 * - children: React.ReactNode - Page content to render
 * 
 * LAYOUT STRUCTURE:
 * ┌─────────────────────────────────────┐
 * │     HEADER (mobile)                 │
 * ├──────────────┬──────────────────────┤
 * │              │                      │
 * │  SIDEBAR     │    MAIN CONTENT      │
 * │ (desktop)    │    (children)        │
 * │              │                      │
 * └──────────────┴──────────────────────┘
 */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  // Get current URL path for active link highlighting
  const pathname = usePathname();
  const router = useRouter();
  
  // Get logout function and token from auth store
  const logout = useLogout();
  const token = useAuthStore((state) => state.token);

  // Memoize active path to prevent unnecessary recalculations
  const activePath = useMemo(() => pathname ?? '/admin/dashboard', [pathname]);

  /**
   * AUTHENTICATION CHECK
   * 
   * Effect: Runs when component mounts or token changes
   * 
   * Algorithm:
   * 1. Check if token exists in authStore
   * 2. If no token (logged out or no session):
   *    - Redirect to /admin/login
   *    - User must login to access admin pages
   * 
   * Debugging:
   * - If stuck in redirect loop, check token storage
   * - Use: localStorage.getItem('dma-auth') to verify state
   */
  useEffect(() => {
    if (!token) {
      router.push('/admin/login'); // Redirect to login if no auth
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex h-full">
        {/* ═════════════════════════════════════════════════════════
            SIDEBAR - Desktop Only (hidden on mobile)
            ═════════════════════════════════════════════════════════ */}
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-neutral-950/70 p-6 lg:flex">
          {/* LOGO AND BRANDING */}
          <Link href="/admin/dashboard" className="mb-8 flex items-center gap-3">
            {/* Logo circle - could be image or SVG */}
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-accent" />
            <div>
              <p className="text-lg font-semibold">Agency Admin</p>
              <p className="text-xs text-neutral-text_muted">Control panel</p>
            </div>
          </Link>

          {/* NAVIGATION MENU */}
          {/* 
            Maps through navItems array
            Highlights current page using activePath
          */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  // Base styles applied to all nav links
                  'block rounded-xl px-4 py-3 text-sm transition hover:bg-white/10',
                  // Conditional styling for active link
                  activePath === item.href 
                    ? 'bg-primary-500/20 text-white' // Active: highlight background
                    : 'text-neutral-text_muted' // Inactive: muted text
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* USER INFO AND LOGOUT - Bottom of sidebar */}
          <div className="mt-auto space-y-3">
            {/* USER INFO CARD */}
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-xs text-neutral-text_muted">Logged in as</p>
              <p className="text-sm font-semibold">{token ? 'Admin' : 'Guest'}</p>
            </div>
            {/* LOGOUT BUTTON */}
            <Button 
              variant="secondary" 
              className="w-full" 
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </aside>

        {/* ═════════════════════════════════════════════════════════
            MAIN CONTENT AREA
            ═════════════════════════════════════════════════════════ */}
        <main className="flex-1">
          {/* HEADER - Sticky at top */}
          {/* Shows on all screen sizes but layout changes */}
          <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-neutral-950/70 px-6 py-4 backdrop-blur-xl">
            {/* LEFT SIDE: Menu icon (mobile) + Title */}
            <div className="flex items-center gap-3">
              <Menu className="h-6 w-6 text-white lg:hidden" /> {/* Mobile menu icon */}
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            
            {/* RIGHT SIDE: Logout button */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
              >
                Sign out
              </Button>
            </div>
          </header>

          {/* PAGE CONTENT */}
          {/* Renders the specific page component (children) */}
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
