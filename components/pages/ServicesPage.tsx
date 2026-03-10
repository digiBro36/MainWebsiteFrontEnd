'use client';

import { useMemo } from 'react';
import { useServices } from '@/hooks/useServices';
import { ServiceCard } from '@/components/marketing/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ServicesPage() {
  const { data: services = [], isLoading } = useServices();

  const filtered = useMemo(() => services, [services]);

  return (
    <div className="min-h-screen">
      <header className="glass relative overflow-hidden rounded-b-3xl border border-white/10 bg-white/5 p-10 shadow-glow">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-semibold text-white">Services</h1>
              <p className="mt-2 text-neutral-text_muted">
                Explore our premium service offerings and choose the plan that fits your needs.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input placeholder="Search services" className="max-w-sm" />
              <Button>Get started</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-12">
        {isLoading ? (
          <div className="text-center text-neutral-text_muted">Loading services...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
