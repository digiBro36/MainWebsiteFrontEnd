'use client';

import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/marketing/ProjectCard';

export function PortfolioSection() {
  const { data: projects = [] } = useProjects();

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-200">Our Portfolio</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Featured work & case studies</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.slice(0, 4).map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
