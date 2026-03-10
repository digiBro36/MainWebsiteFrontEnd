/**
 * RECENT LEADS TABLE COMPONENT
 * 
 * PURPOSE:
 * Display latest 5 leads (contact form submissions) in admin dashboard
 * Shows: Name, Email, Service interested, Date, Delete action
 * 
 * FEATURES:
 * - Real-time data from React Query
 * - Delete functionality with confirmation
 * - Loading and empty states
 * - Responsive table (horizontal scroll on mobile)
 * - Formatted dates using utility function
 * 
 * DATA SOURCE:
 * useLeads() - Fetches from GET /leads
 * useDeleteLead() - Deletes via DELETE /leads/{id}
 * 
 * ALGORITHM:
 * 1. Fetch all leads using useLeads()
 * 2. Memoize first 5 items: leads.slice(0, 5)
 * 3. Render table with columns
 * 4. On delete click:
 *    - Show confirmation dialog
 *    - If confirmed, call deleteLead.mutateAsync(id)
 *    - Show success/error toast
 * 
 * DEBUGGING:
 * - Check leads loading: isLoading state
 * - Verify data: console.log(leads)
 * - Check delete works: Click delete, confirm, check if removed
 * - Check toast messages appear
 * 
 * FEATURE IDEAS:
 * - Add pagination: Show 10/25/50 per page
 * - Add search/filter by name or email
 * - Add sorting: Click column headers
 * - Add bulk actions: Select multiple, bulk delete
 * - Add lead details modal: Click row to view full message
 * - Add export to CSV
 * - Add mark as "contacted" status
 */

'use client';

import { useMemo } from 'react';
import { useLeads, useDeleteLead } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

/**
 * RECENT LEADS TABLE COMPONENT
 * 
 * Props: None (uses hooks for data)
 * 
 * Returns: Table component showing leads
 */
export function RecentLeadsTable() {
  // ═════════════════════════════════════════════════════════
  // DATA FETCHING
  // ═════════════════════════════════════════════════════════
  
  /**
   * FETCH LEADS
   * - isLoading: True while fetching
   * - data: Array of Lead objects
   * - error: Error if request failed
   */
  const { data: leads = [], isLoading } = useLeads();

  /**
   * DELETE LEAD MUTATION
   * - mutateAsync(id): Delete lead and wait for response
   * - isPending: True while deleting
   */
  const deleteLead = useDeleteLead();

  // ═════════════════════════════════════════════════════════
  // DATA PROCESSING
  // ═════════════════════════════════════════════════════════

  /**
   * GET RECENT LEADS (First 5)
   * 
   * Algorithm:
   * - leads.slice(0, 5) - Get first 5 items
   * - Memoized - Only recalculate when leads changes
   * - Prevents unnecessary table re-renders
   * 
   * FEATURE: Make configurable
   * const PAGE_SIZE = 10;
   * const recentLeads = useMemo(() => leads.slice(0, PAGE_SIZE), [leads]);
   */
  const recentLeads = useMemo(() => leads.slice(0, 5), [leads]);

  // ═════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═════════════════════════════════════════════════════════

  /**
   * HANDLE DELETE LEAD
   * 
   * Algorithm:
   * 1. Show confirmation dialog
   * 2. If user cancels, do nothing
   * 3. If confirmed:
   *    - Call deleteLead.mutateAsync(id)
   *    - On success: Show success toast
   *    - On error: Show error toast
   * 
   * FEATURE IDEAS:
   * - Add optimistic delete (show removed before API responds)
   * - Add undo functionality
   * - Add soft delete (mark as deleted)
   * - Add recovery bin for 30 days
   */
  const handleDelete = async (id: string) => {
    // Confirmation dialog
    const shouldDelete = confirm('Delete this lead? This cannot be undone.');
    if (!shouldDelete) return;

    try {
      // Call delete mutation
      await deleteLead.mutateAsync(id);
      // Show success message
      toast.success('Lead deleted');
    } catch {
      // Show error message
      toast.error('Unable to delete lead');
    }
  };

  // ═════════════════════════════════════════════════════════
  // RENDER TABLE
  // ═════════════════════════════════════════════════════════

  return (
    <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <table className="w-full min-w-[520px] table-auto">
        {/* TABLE HEADER */}
        <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-neutral-text_muted">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Service</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        
        {/* TABLE BODY */}
        <tbody>
          {/* LOADING STATE */}
          {isLoading ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-neutral-text_muted">
                Loading leads...
              </td>
            </tr>
          ) 
          
          /* EMPTY STATE */
          : recentLeads.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-neutral-text_muted">
                No leads yet.
              </td>
            </tr>
          ) 
          
          /* TABLE ROWS */
          : (
            recentLeads.map((lead) => (
              <tr key={lead.id} className="border-t border-white/10 hover:bg-white/5">
                {/* LEAD NAME */}
                <td className="px-6 py-4 text-sm text-white">{lead.name}</td>
                
                {/* LEAD EMAIL */}
                <td className="px-6 py-4 text-sm text-neutral-text_muted">{lead.email}</td>
                
                {/* SERVICE INTERESTED */}
                {/* Shows "-" if not provided */}
                <td className="px-6 py-4 text-sm text-neutral-text_muted">
                  {lead.serviceInterested || '-'}
                </td>
                
                {/* CREATED DATE */}
                {/* Uses formatDate utility to display readable date/time */}
                <td className="px-6 py-4 text-sm text-neutral-text_muted">
                  {formatDate(lead.createdAt)}
                </td>
                
                {/* DELETE ACTION */}
                <td className="px-6 py-4 text-sm">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(lead.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
