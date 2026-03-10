'use client';

import { useMemo, useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/marketing/ProjectCard';
import { Button } from '@/components/ui/button';

const categories = ['All', 'Web Design', 'SEO', 'Marketing'];

export function PortfolioPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((project) => project.title.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [activeCategory, projects]);

  return (
    <div className="min-h-screen">
      <header className="glass relative overflow-hidden rounded-b-3xl border border-white/10 bg-white/5 p-10 shadow-glow">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold text-white">Portfolio</h1>
          <p className="mt-2 text-neutral-text_muted">
            Explore recent work across web design, marketing campaigns, and SEO success stories.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl py-12">
        {isLoading ? (
          <div className="text-center text-neutral-text_muted">Loading projects...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
