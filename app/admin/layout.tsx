import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Digital Marketing Agency',
  description: 'Admin panel for managing leads, services, and projects.',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
