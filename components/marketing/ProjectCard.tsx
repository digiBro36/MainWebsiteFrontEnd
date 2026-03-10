'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glow"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={project.imageUrl ?? '/images/project-placeholder.jpg'}
          alt={project.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
        <p className="mt-2 text-sm text-neutral-text_muted line-clamp-2">{project.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs font-medium text-white/70">{project.clientName || 'Client Project'}</span>
          <Button variant="ghost" size="sm" className="border border-white/10">
            View case study
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
