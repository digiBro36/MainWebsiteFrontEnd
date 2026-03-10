/**
 * HERO SECTION COMPONENT
 * 
 * PURPOSE:
 * Landing page hero section with:
 * - Animated gradient background
 * - Main heading with gradient text
 * - Call-to-action buttons
 * - Scroll indicator animation
 * 
 * LOCATION: First section on homepage
 * 
 * FEATURES:
 * - Framer Motion animations (fade-in, slide-up)
 * - Gradient backgrounds for visual impact
 * - Three CTA buttons: Services, Portfolio, Admin Login
 * - Responsive design (mobile-first)
 * - Animated scroll indicator
 * 
 * ALGORITHM:
 * 1. Render gradient backgrounds (CSS + SVG gradients)
 * 2. Animate text content (opacity + y-position)
 * 3. Stagger animations with delays
 * 4. Add scroll indicator animation
 * 5. Buttons link to relevant pages
 * 
 * DEBUGGING:
 * - Check animations in DevTools > Animations panel
 * - Test on mobile: Ensure responsive layout
 * - Verify links work: /services, /portfolio, /admin/login
 * - Check colors: Tailwind gradient classes
 * 
 * FEATURE IDEAS:
 * - Add video background instead of gradients
 * - Add parallax effect with mouse movement
 * - Add animated counter: "10+ projects completed"
 * - Add customer testimonial slide
 * - Add chat widget for immediate contact
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';

/**
 * HERO COMPONENT
 * 
 * Props: None
 * 
 * RENDERS:
 * - Background gradients (decorative)
 * - Main content (title + description + buttons)
 * - Scroll indicator animation
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ═════════════════════════════════════════════════════════
          BACKGROUND GRADIENTS - Decorative (z-index -10)
          ═════════════════════════════════════════════════════════ */}
      
      {/* Radial gradient at top center - Blue/primary color */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_55%)]" />
      
      {/* Radial gradient at top-left - Pink/secondary color */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,_rgba(236,72,153,0.18),_transparent_45%)]" />
      
      {/* Base gradient: Dark to darker (white to black) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />

      {/* ═════════════════════════════════════════════════════════
          MAIN CONTENT - Hero section
          ═════════════════════════════════════════════════════════ */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 py-32 text-center">
        {/* ANIMATED CONTENT BLOCK */}
        {/* 
          motion.div from Framer Motion
          initial: Starting state (before animation)
          animate: Target state (animate to this)
          transition: Animation timing
        */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} // Start: invisible, moved down 24px
          animate={{ opacity: 1, y: 0 }}   // End: visible, normal position
          transition={{ duration: 0.8 }}   // 800ms duration
          className="space-y-6"
        >
          {/* TAGLINE */}
          <p className="text-sm font-medium uppercase tracking-widest text-primary-200">
          DigiBro Marketing Agency
          </p>

          {/* MAIN HEADING */}
          {/* 
            Split into 3 parts:
            1. "Transform Your" - white text
            2. "Digital Presence" - gradient text (blue to pink)
            3. Rest of text
          */}
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Transform Your{' '}
            <GradientText className="text-transparent">Digital Presence</GradientText>
          </h1>

          {/* DESCRIPTION */}
          <p className="mx-auto max-w-2xl text-base text-neutral-text_muted sm:text-lg">
            Build trust, increase conversions, and grow your business with a modern agency template built for
            performance.
          </p>

          {/* CTA BUTTONS */}
          {/* 
            Three buttons for different user intents:
            1. Primary: Explore services (main CTA)
            2. Secondary: View portfolio (secondary CTA)
            3. Ghost: Admin login (tertiary CTA)
            
            Responsive: Full width on mobile, auto width on desktop
          */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {/* PRIMARY BUTTON - Explore Services */}
            <Button className="w-full sm:w-auto" size="lg">
              Explore services
            </Button>

            {/* SECONDARY BUTTON - View Portfolio */}
            <Button variant="secondary" className="w-full sm:w-auto" size="lg">
              View portfolio
            </Button>

            {/* TERTIARY BUTTON - Admin Login */}
            {/* 
              Wrapped in Link for navigation
              Note: Could add auth check to hide this button if admin logged in
            */}
            <Link href="/admin/login" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full" size="lg">
                Admin login
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ═════════════════════════════════════════════════════════
            SCROLL INDICATOR - Animated chevron down
            ═════════════════════════════════════════════════════════ */}
        {/* 
          Shows user there's more content below
          Animated with: fade-in + slide-up, delayed
        */}
        <div className="mt-16 flex w-full justify-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}        // Start: invisible, moved down
            animate={{ opacity: 1, y: 0 }}         // End: visible, normal
            transition={{ duration: 0.8, delay: 0.2 }} // 800ms, starts after 200ms
            className="flex h-24 w-6 items-end justify-center"
          >
            {/* Thin vertical line representing scroll indicator */}
            <span className="h-16 w-1 rounded-full bg-primary-500/80" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
