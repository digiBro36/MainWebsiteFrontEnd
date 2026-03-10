/**
 * HOMEPAGE - /
 * 
 * PURPOSE:
 * Public facing homepage showcasing agency services and portfolio
 * Entry point for potential clients
 * 
 * LAYOUT SECTIONS (in order):
 * 1. Hero - Main headline and CTAs
 * 2. Services - Service offerings
 * 3. Portfolio - Completed projects
 * 4. Stats - Company metrics/achievements
 * 5. Testimonials - Client reviews
 * 6. Contact - Contact form
 * 7. Footer - Links and info
 * 
 * FEATURES:
 * - Animated sections with Framer Motion
 * - Scroll-triggered animations
 * - Responsive design
 * - Multiple call-to-action buttons
 * 
 * ALGORITHM:
 * 1. Render sections in sequence
 * 2. Apply Framer Motion animations to each
 * 3. Sections fade-in and slide up on view
 * 4. Links connect to relevant pages/forms
 * 
 * NAVIGATION:
 * - Links to /services (Services page)
 * - Links to /portfolio (Portfolio page)
 * - Links to /contact (Contact form)
 * - Links to /admin/login (Admin dashboard)
 * 
 * DEBUGGING:
 * - Open browser and scroll through
 * - Check each section loads correctly
 * - Verify links work and navigate properly
 * - Test on mobile for responsive design
 * - Check animations aren't too slow
 * 
 * SEO OPTIMIZATION:
 * - Meta tags in RootLayout
 * - OpenGraph tags for social share
 * - Semantic HTML structure
 * - Image optimization
 * 
 * PERFORMANCE:
 * - Lazy load components if list grows
 * - Optimize images with next/image
 * - Add loading skeletons
 * 
 * FEATURE IDEAS:
 * - Add video background in hero
 * - Add newsletter signup
 * - Add live chat widget
 * - Add animated counter stats
 * - Add trust badges/certifications
 * - Add recent blog posts
 */

'use client';

import { motion } from 'framer-motion';
import { Hero } from '@/components/marketing/Hero';
import { ServicesSection } from '@/components/marketing/ServicesSection';
import { PortfolioSection } from '@/components/marketing/PortfolioSection';
import { StatsSection } from '@/components/marketing/StatsSection';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { ContactSection } from '@/components/marketing/ContactSection';
import { Footer } from '@/components/marketing/Footer';

/**
 * HOME PAGE COMPONENT
 * 
 * Props: None (public page, no parameters)
 * 
 * Returns: Full homepage with all sections
 */
export default function HomePage() {
  return (
    /* MAIN PAGE WRAPPER */
    <main className="space-y-32"> {/* Vertical spacing between sections */}
      
      {/* ═════════════════════════════════════════════════════════
          SECTION 1: HERO
          ═════════════════════════════════════════════════════════ */}
      {/* 
        Hero section with main headline
        Animated on page load
        Duration: 900ms (0.9s) with ease function
      */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}      // Start: invisible, 40px down
        animate={{ opacity: 1, y: 0 }}       // End: visible, normal position
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} // Cubic bezier ease
      >
        <Hero />
      </motion.section>

      {/* ═════════════════════════════════════════════════════════
          SECTION 2: SERVICES
          ═════════════════════════════════════════════════════════ */}
      {/* 
        Services offered by agency
        Animated when scrolled into view
        whileInView: Triggers animation when element visible in viewport
        viewport: { once: true } = Animation plays only once
      */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}   // Animate when visible
        viewport={{ once: true, amount: 0.25 }} // Trigger when 25% visible
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <ServicesSection />
      </motion.section>

      {/* ═════════════════════════════════════════════════════════
          SECTION 3: PORTFOLIO
          ═════════════════════════════════════════════════════════ */}
      {/* Completed projects showcase */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <PortfolioSection />
      </motion.section>

      {/* ═════════════════════════════════════════════════════════
          SECTION 4: STATS
          ═════════════════════════════════════════════════════════ */}
      {/* Company metrics: clients, projects, revenue, etc */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <StatsSection />
      </motion.section>

      {/* ═════════════════════════════════════════════════════════
          SECTION 5: TESTIMONIALS
          ═════════════════════════════════════════════════════════ */}
      {/* Client success stories and reviews */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <TestimonialsSection />
      </motion.section>

      {/* ═════════════════════════════════════════════════════════
          SECTION 6: CONTACT
          ═════════════════════════════════════════════════════════ */}
      {/* Contact form for inquiries */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <ContactSection />
      </motion.section>

      {/* ═════════════════════════════════════════════════════════
          FOOTER
          ═════════════════════════════════════════════════════════ */}
      {/* No animation, just rendered */}
      {/* Contains: Links, copyright, social media */}
      <Footer />
    </main>
  );
}
