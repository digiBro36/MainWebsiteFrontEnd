'use client';

import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/marketing/TestimonialCard';

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Founder • Bloom Digital India',
    quote: 'The team turned our vision into a conversion machine. Their design is gorgeous and the experience is flawless.',
    rating: 5,
  },
  {
    name: 'Rohan Sharma',
    role: 'CMO • Nectar Marketing',
    quote: 'Modern, fast, and attention-grabbing. Our leads doubled within the first week.',
    rating: 5,
  },
  {
    name: 'Priya Kapoor',
    role: 'CEO • PixelWave Labs',
    quote: 'We saw a 40% increase in qualified demos after launching with their strategy.',
    rating: 5,
  },
  {
    name: 'Kunal Verma',
    role: 'Founder • GrowthHive',
    quote: 'Their approach to branding and performance marketing helped us scale faster than expected.',
    rating: 5,
  },
  {
    name: 'Sneha Iyer',
    role: 'Marketing Head • ElevateTech',
    quote: 'Clean design, lightning fast performance, and a team that truly understands user experience.',
    rating: 5,
  },
];
export function TestimonialsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-200">What clients say</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Trusted by teams around the world</h2>
        </div>

        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
