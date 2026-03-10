'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SettingsPage() {
  const [name, setName] = useState('Admin');
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');

  return (
    <div className="space-y-8">
      <header className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="mt-2 text-sm text-neutral-text_muted">Control your account settings and preferences.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <section className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
          <h2 className="text-lg font-semibold text-white">Profile</h2>
          <div className="mt-6 space-y-4">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button className="w-full">Save profile</Button>
          </div>
        </section>

        <section className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
          <h2 className="text-lg font-semibold text-white">Security</h2>
          <div className="mt-6 space-y-4">
            <Input
              label="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="w-full">Update password</Button>
          </div>
        </section>

        <section className="glass rounded-3xl border border-white/10 p-6 shadow-glow">
          <h2 className="text-lg font-semibold text-white">Appearance</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Dark mode</p>
                <p className="text-xs text-neutral-text_muted">Toggle theme preference.</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-white/10 transition peer-checked:bg-primary-500" />
                <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
              </label>
            </div>
            <Button className="w-full">Save preferences</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
