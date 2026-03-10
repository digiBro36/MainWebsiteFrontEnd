'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const stats = [
  { label: 'Projects Delivered', value: 92 },
  { label: 'Happy Clients', value: 91 },
  { label: 'Revenue Generated', value: 11000 },
  { label: 'Awards Won', value: 12 },
];

export function StatsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-200">Our impact</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Numbers that speak for themselves</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="glass flex flex-col items-start gap-2 rounded-3xl p-8"
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-200">
                {stat.label}
              </span>
              <div className="flex items-end gap-2">
                <AnimatedCounter value={stat.value} />
                <span className="text-sm text-neutral-text_muted">{stat.label === 'Revenue Generated' ? 'RS' : ''}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
