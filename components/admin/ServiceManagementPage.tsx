'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceSchema } from '@/lib/validations';
import { useServices, useCreateService, useDeleteService, useUpdateService } from '@/hooks/useServices';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

type FormValues = Omit<Service, 'id'>;

export function ServiceManagementPage() {
  const { data: services = [], isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [editing, setEditing] = useState<Service | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const normalized = search.toLowerCase();
    return services.filter((item) => item.title.toLowerCase().includes(normalized));
  }, [search, services]);

  const form = useForm<FormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { title: '', description: '', price: 0, active: true },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        await updateService.mutateAsync({ id: editing.id, data: values });
        toast.success('Service updated');
      } else {
        await createService.mutateAsync(values);
        toast.success('Service created');
      }
      setEditing(null);
      form.reset();
    } catch {
      toast.error('Unable to save service');
    }
  };

  const startEdit = (service: Service) => {
    setEditing(service);
    form.reset({
      title: service.title,
      description: service.description ?? '',
      price: service.price,
      active: service.active,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await deleteService.mutateAsync(id);
      toast.success('Service deleted');
    } catch {
      toast.error('Failed to delete service');
    }
  };

  return (
    <div className="space-y-8">
      <header className="glass flex flex-col gap-4 rounded-3xl border border-white/10 p-6 shadow-glow sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Service Management</h1>
          <p className="text-sm text-neutral-text_muted">
            Create and manage service offerings available on the marketing site.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Search services"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={() => setEditing(null)}>New service</Button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
          <h2 className="text-lg font-semibold text-white">{editing ? 'Edit service' : 'Create new service'}</h2>
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
            <Input
              label="Price"
              type="number"
              step="0.01"
              {...form.register('price', { valueAsNumber: true })}
              error={form.formState.errors.price?.message as string}
            />
            <label className="flex items-center gap-3 text-sm text-neutral-text_muted">
              <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5" {...form.register('active')} />
              Active
            </label>

            <Button type="submit" className="w-full">
              {editing ? 'Update service' : 'Create service'}
            </Button>
          </form>
        </section>

        <section className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
          <h2 className="text-lg font-semibold text-white">Existing services</h2>
          {isLoading ? (
            <p className="mt-4 text-sm text-neutral-text_muted">Loading services…</p>
          ) : filtered.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-text_muted">No services found.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {filtered.map((service) => (
                <div key={service.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{service.title}</p>
                      <p className="text-xs text-neutral-text_muted">{service.description}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                      {service.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-neutral-text_muted">${service.price.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => startEdit(service)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
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
