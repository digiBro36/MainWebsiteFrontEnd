'use client';

import { ContactSection } from '@/components/marketing/ContactSection';

export function ContactPage() {
  return (
    <div className="min-h-screen">
      <header className="glass relative overflow-hidden rounded-b-3xl border border-white/10 bg-white/5 p-10 shadow-glow">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold text-white">Contact</h1>
          <p className="mt-2 text-neutral-text_muted">
            Have a project in mind? Send us your brief and we will follow up shortly.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-12">
        <ContactSection />
      </main>
    </div>
  );
}
