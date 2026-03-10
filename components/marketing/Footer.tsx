'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-neutral-950/70 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-4">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">DigiBro Marketing Agency</h3>
          <p className="text-sm text-neutral-text_muted">
            Premium marketing solutions for ambitious businesses. Modern design, performance-driven strategy, and
            conversion-first thinking.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Twitter
            </Button>
            <Button variant="ghost" size="sm">
              LinkedIn
            </Button>
            <Button variant="ghost" size="sm">
              Instagram
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-primary-200">Sitemap</h4>
          <ul className="mt-4 space-y-2 text-sm text-neutral-text_muted">
            <li>Home</li>
            <li>Services</li>
            <li>Portfolio</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-primary-200">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-neutral-text_muted">
            <li>About</li>
            <li>Careers</li>
            <li>Pricing</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-primary-200">Newsletter</h4>
          <p className="text-sm text-neutral-text_muted">Get the latest updates delivered to your inbox.</p>
          <div className="flex flex-col gap-3">
            <Input placeholder="Your email" />
            <Button className="w-full" size="md">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-neutral-text_muted">
        © {new Date().getFullYear()} Digital Marketing Agency. All rights reserved.
      </div>
    </footer>
  );
}
