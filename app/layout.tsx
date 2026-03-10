/**
 * ROOT LAYOUT COMPONENT
 * 
 * PURPOSE:
 * Main layout wrapper for entire application
 * This is the topmost layout in Next.js App Router hierarchy
 * 
 * RESPONSIBILITIES:
 * - Set up global HTML structure (html, head, body tags)
 * - Define metadata (SEO, title, description, OG tags)
 * - Wrap app with providers (React Query, context, etc)
 * - Import global styles (Tailwind CSS)
 * 
 * HIERARCHY:
 * RootLayout (this file)
 *   ├─ Providers (React Query, Zustand, Toaster)
 *   │   └─ Page layouts/routes
 *   │       ├─ app/page.tsx (home)
 *   │       ├─ app/admin/layout.tsx (admin)
 *   │       └─ etc.
 * 
 * ALGORITHM:
 * 1. Define metadata for SEO
 * 2. Create HTML structure
 * 3. Wrap children with Providers component
 * 4. Providers sets up: React Query, Zustand, Toast notifications
 * 5. All child routes inherit this layout
 * 
 * METADATA:
 * - Used for: Search engines, social media, browser tab
 * - Supports: OpenGraph (Facebook), Twitter Card
 * - Dynamic: generateMetadata() for page-specific metadata
 * 
 * DEBUGGING:
 * - Check metadata in browser: View Page Source
 * - Check OG tags: Use https://www.opengraph.xyz/
 * - Verify styles load: Check for Tailwind CSS in DevTools
 * - Test providers: Check React Query DevTools if available
 * 
 * FEATURE IDEAS:
 * - Add Analytics (Google, Mixpanel, Segment)
 * - Add Error Boundary for fallback UI
 * - Add Custom Font loading (Google Fonts, local)
 * - Add Global Error Handler
 * - Add Service Worker (PWA)
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import '@/app/globals.css';

/**
 * METADATA EXPORT
 * 
 * PURPOSE:
 * Define SEO metadata for the entire site
 * Next.js automatically uses this for:
 * - Meta tags in <head>
 * - Open Graph tags (social media preview)
 * - Twitter Card tags
 * 
 * FIELDS:
 * - title: Page title in browser tab and search results
 * - description: Short description (shown in search results)
 * - metadataBase: Base URL (used for absolute URLs)
 * - openGraph: Facebook/social media preview settings
 * - twitter: Twitter Card settings
 * 
 * SEO TIPS:
 * - Title should be 50-60 characters
 * - Description should be 150-160 characters
 * - Use keywords naturally
 * - Include brand name for recognition
 * 
 * DEBUGGING:
 * - View Page Source (right-click > View Page Source)
 * - Look for <meta> tags
 * - Check title, description, og:image, og:url
 * 
 * FEATURE: Add per-page metadata
 * Each page can override with export const metadata = {...}
 * Example: app/contact/page.tsx
 * export const metadata = { title: 'Contact Us' }
 */
export const metadata: Metadata = {
  title: 'Digital Marketing Agency',
  description: 'Premium full-stack digital marketing agency template.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Digital Marketing Agency',
    description: 'Premium templates, modern design, and full admin dashboard.',
    url: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
    siteName: 'Digital Marketing Agency',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marketing Agency',
    description: 'Premium templates, modern design, and full admin dashboard.',
  },
};

/**
 * ROOT LAYOUT COMPONENT
 * 
 * Props:
 * - children: React.ReactNode - All page content/child routes
 * 
 * Returns: HTML document structure
 * 
 * NEXT.JS REQUIREMENTS:
 * - Server component (no 'use client' directive)
 * - Must render <html> and <body> tags
 * - Can contain providers/context
 * - Metadata must be exported constant
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* ═════════════════════════════════════════════════════════
        HTML DOCUMENT ROOT
        ═════════════════════════════════════════════════════════ */
    <html lang="en" suppressHydrationWarning>
      {/* 
        suppressHydrationWarning: Ignore hydration mismatches for html attributes
        (useful if client-side code modifies html attributes like dark mode)
      */}
      
      {/* BODY TAG WITH BASE STYLES */}
      <body className="min-h-screen bg-neutral-bg text-neutral-text">
        {/* ═════════════════════════════════════════════════════════
            PROVIDERS WRAPPER
            ═════════════════════════════════════════════════════════ */}
        {/* 
          Providers component sets up:
          1. React Query - For server state management
             - Handles caching, fetching, mutations
             - DevTools for debugging
          
          2. Zustand - For client state management
             - Auth store (token persistence)
             - Can be extended with other stores
          
          3. Toast Component - For notifications
             - Success messages
             - Error messages
             - Info alerts
          
          All providers work together:
          - Auth store provides token
          - API client (in lib/api.ts) uses token
          - React Query manages data fetching
        */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
