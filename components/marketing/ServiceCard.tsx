'use client';

import { motion } from 'framer-motion';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass group relative overflow-hidden rounded-3xl border border-white/10 p-6 shadow-glow transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{service.title}</h3>
          <p className="mt-2 text-sm text-neutral-text_muted line-clamp-2">{service.description}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
          {service.active ? 'Active' : 'Inactive'}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-2xl font-bold text-white">{formatCurrency(service.price)}</span>
        <Button variant="secondary" size="sm">
          Learn more
        </Button>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-white/5 opacity-0 transition group-hover:opacity-100" />
    </motion.div>
  );
}
