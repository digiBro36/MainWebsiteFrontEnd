'use client';

import { Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="glass min-w-[320px] shrink-0 rounded-3xl p-6 shadow-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white">{testimonial.name}</p>
          <p className="text-xs text-neutral-text_muted">{testimonial.role}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`h-4 w-4 ${idx < testimonial.rating ? 'text-secondary-accent' : 'text-neutral-text_muted'}`}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-neutral-text_muted">“{testimonial.quote}”</p>
    </div>
  );
}
