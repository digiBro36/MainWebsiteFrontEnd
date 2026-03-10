'use client';

import { motion } from 'framer-motion';
import { useServices } from '@/hooks/useServices';
import { ServiceCard } from '@/components/marketing/ServiceCard';

export function ServicesSection() {
  const { data: services = [] } = useServices();

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-200">Our Services</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Designed to scale your business
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
