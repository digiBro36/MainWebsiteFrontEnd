'use client';

import { useMemo, useState } from 'react';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

const statusOptions = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED'];

export function LeadManagementPage() {
  const { data: leads = [], isLoading } = useLeads();
  const deleteLead = useDeleteLead();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredLeads = useMemo(() => {
    const normalized = query.toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch = [lead.name, lead.email, lead.serviceInterested]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalized));

      const matchesStatus = statusFilter === 'All' || statusFilter === 'All';

      return matchesSearch && matchesStatus;
    });
  }, [leads, query, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead permanently?')) return;
    try {
      await deleteLead.mutateAsync(id);
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  return (
    <div className="space-y-8">
      <header className="glass flex flex-col gap-4 rounded-3xl border border-white/10 p-6 shadow-glow sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Lead Management</h1>
          <p className="text-sm text-neutral-text_muted">Track lead interactions and mark outreach status.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30"
            placeholder="Search leads..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option>All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="glass overflow-hidden rounded-3xl border border-white/10 p-6 shadow-glow">
        <table className="w-full min-w-[720px] table-auto">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-neutral-text_muted">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Submitted</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-text_muted">
                  Loading leads...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-neutral-text_muted">
                  No leads found.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-sm text-white">{lead.name}</td>
                  <td className="px-6 py-4 text-sm text-neutral-text_muted">{lead.email}</td>
                  <td className="px-6 py-4 text-sm text-neutral-text_muted">{lead.serviceInterested || '-'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-text_muted">{formatDate(lead.createdAt)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(lead.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
