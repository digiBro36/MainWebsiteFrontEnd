'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/validations';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

type FormValues = Omit<Project, 'id'>;

export function ProjectManagementPage() {
  const { data: projects = [], isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [editing, setEditing] = useState<Project | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const normalized = search.toLowerCase();
    return projects.filter((project) => project.title.toLowerCase().includes(normalized));
  }, [projects, search]);

  const form = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: '', description: '', clientName: '', imageUrl: '', projectUrl: '' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        await updateProject.mutateAsync({ id: editing.id, data: values });
        toast.success('Project updated');
      } else {
        await createProject.mutateAsync(values);
        toast.success('Project created');
      }
      setEditing(null);
      form.reset();
    } catch {
      toast.error('Failed to save project');
    }
  };

  const startEdit = (project: Project) => {
    setEditing(project);
    form.reset({
      title: project.title,
      description: project.description ?? '',
      clientName: project.clientName ?? '',
      imageUrl: project.imageUrl ?? '',
      projectUrl: project.projectUrl ?? '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="space-y-8">
      <header className="glass flex flex-col gap-4 rounded-3xl border border-white/10 p-6 shadow-glow sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Project Management</h1>
          <p className="text-sm text-neutral-text_muted">
            Manage portfolio projects, client work, and featured case studies.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search projects"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setEditing(null)}>New project</Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
          <h2 className="text-lg font-semibold text-white">{editing ? 'Edit project' : 'Create new project'}</h2>
          <form className="mt-6 grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <Input label="Title" {...form.register('title')} error={form.formState.errors.title?.message as string} />
            <div className="relative">
              <label
                htmlFor="description"
                className="absolute left-3 top-2 text-xs font-medium transition-all text-neutral-text_muted"
              >
                Description
              </label>
              <textarea
                id="description"
                {...form.register('description')}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 h-28 resize-none"
              />
              {form.formState.errors.description ? (
                <p className="mt-1 text-xs text-danger-300">
                  {form.formState.errors.description?.message as string}
                </p>
              ) : null}
            </div>
            <Input label="Client" {...form.register('clientName')} error={form.formState.errors.clientName?.message as string} />
            <Input label="Image URL" {...form.register('imageUrl')} error={form.formState.errors.imageUrl?.message as string} />
            <Input label="Project URL" {...form.register('projectUrl')} error={form.formState.errors.projectUrl?.message as string} />
            <Button type="submit" className="w-full">
              {editing ? 'Update project' : 'Create project'}
            </Button>
          </form>
        </section>

        <section className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
          <h2 className="text-lg font-semibold text-white">Existing projects</h2>
          {isLoading ? (
            <p className="mt-4 text-sm text-neutral-text_muted">Loading projects…</p>
          ) : filtered.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-text_muted">No projects found.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {filtered.map((project) => (
                <div key={project.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{project.title}</p>
                      <p className="text-xs text-neutral-text_muted">{project.clientName || 'Client project'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(project)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
