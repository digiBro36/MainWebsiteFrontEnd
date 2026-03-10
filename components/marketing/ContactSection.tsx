'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema } from '@/lib/validations';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toaster } from '@/components/ui/toast';

type FormValues = {
  name: string;
  email: string;
  phone?: string;
  serviceInterested?: string;
  message: string;
};

export function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      await api.post('/leads', values);
      toaster.success('Lead submitted! We will reach out shortly.');
      reset();
    } catch (error) {
      toaster.error('Something went wrong; please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldErrors = useMemo(() => formState.errors, [formState.errors]);

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Let’s talk about your next project</h2>
            <p className="text-lg text-neutral-text_muted">
              Send us the details and we’ll craft a tailored proposal that turns visitors into customers.
            </p>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-lg font-semibold text-white">Contact information</h3>
              <p className="mt-3 text-sm text-neutral-text_muted">
                Prefer email? Reach out at <span className="text-primary-200">contact.digibromarketing@gmail.com</span>
              </p>
              <div className="mt-6 space-y-3 text-sm text-neutral-text_muted">
                <p>📍 Matwari Hazaribagh 825301</p>
                <p>+91 6203456825</p>
                <p>🕒 Mon - Mon, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-10">
            <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Name" {...register('name')} error={fieldErrors.name?.message as string} />
                <Input label="Email" type="email" {...register('email')} error={fieldErrors.email?.message as string} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Phone" {...register('phone')} error={fieldErrors.phone?.message as string} />
                <Input
                  label="Service Interested"
                  {...register('serviceInterested')}
                  error={fieldErrors.serviceInterested?.message as string}
                />
              </div>

              <div className="relative">
                <label
                  htmlFor="message"
                  className="absolute left-3 top-2 text-xs font-medium transition-all text-neutral-text_muted"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 h-32 resize-none"
                />
                {fieldErrors.message ? (
                  <p className="mt-1 text-xs text-danger-300">
                    {fieldErrors.message?.message as string}
                  </p>
                ) : null}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
