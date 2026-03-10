/**
 * LEADS DATA MANAGEMENT HOOKS
 * 
 * PURPOSE:
 * Custom React hooks for CRUD operations on leads (contact form submissions)
 * Uses React Query for server state management
 * 
 * LIBRARY: @tanstack/react-query (formerly React Query)
 * - useQuery: Fetch data from server
 * - useMutation: Modify data on server
 * - useQueryClient: Trigger cache updates
 * 
 * ALGORITHM:
 * 1. useLeads() fetches leads list and caches for 5 minutes
 * 2. Create/Delete mutations trigger API calls
 * 3. After mutation succeeds, invalidate cache
 * 4. Query client refetches leads, UI updates automatically
 * 
 * DEBUGGING:
 * - Check React Query DevTools (browser extension)
 * - Set breakpoints in mutationFn
 * - Check API responses in Network tab
 * - Verify cache: queryClient.getQueryData(['leads'])
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Lead } from '@/types';

/**
 * USE LEADS HOOK - useLeads()
 * 
 * PURPOSE: Fetch all leads from backend
 * 
 * ALGORITHM:
 * 1. Query key: ['leads'] - unique cache key
 * 2. queryFn: GET /api/leads - API endpoint
 * 3. staleTime: 5 minutes - Cache validity duration
 * 4. enabled: true - Always fetch on mount
 * 
 * RETURNS:
 * - data: Lead[] - Array of leads
 * - isLoading: Boolean - First load in progress
 * - isFetching: Boolean - Background refetch in progress
 * - error: Error | null - Fetch error if any
 * 
 * USAGE:
 * const { data: leads, isLoading } = useLeads();
 * 
 * DEBUGGING:
 * - Check backend returns Lead[] array
 * - Verify API endpoint: GET http://localhost:8080/api/leads
 * - Test: curl http://localhost:8080/api/leads -H "Authorization: Bearer token"
 * - Check browser Network tab for request/response
 * 
 * PERFORMANCE:
 * staleTime: 5 min = Reduces API calls
 * If user visits Leads page again within 5 min, uses cached data
 * 
 * FEATURE IDEAS:
 * - Add pagination: useLeads(page = 1, limit = 20)
 * - Add filtering: useLeads(filters = {status: 'new'})
 * - Add sorting: useLeads(sortBy = 'createdAt', order = 'desc')
 * - Add search: useLeads(search = 'John')
 */
export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: () => api.get<Lead[]>('/leads').then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true, // Can set to false conditionally
  });
}

/**
 * USE CREATE LEAD HOOK - useCreateLead()
 * 
 * PURPOSE: Create new lead from contact form submission
 * 
 * ALGORITHM:
 * 1. User submits contact form
 * 2. mutate(leadData) calls API: POST /leads
 * 3. Backend creates lead and returns confirmation
 * 4. On success: Invalidate 'leads' cache
 * 5. React Query automatically refetches leads
 * 6. UI updates with new lead
 * 
 * PARAMS:
 * - Omit<Lead, 'id' | 'createdAt'> - Don't send id/timestamp
 * - Backend generates these
 * 
 * RETURNS:
 * - mutate(data) - Trigger lead creation
 * - isPending - Creation in progress
 * - isError - Failed to create
 * - error - Error details
 * 
 * USAGE:
 * const { mutate } = useCreateLead();
 * const onSubmit = (data) => mutate(data);
 * 
 * DEBUGGING:
 * - Check form validation passes
 * - Verify API: POST http://localhost:8080/api/leads
 * - Check request body has required fields
 * - Verify response status 200/201
 * 
 * FEATURE IDEAS:
 * - Add success toast: "Lead created!"
 * - Add error handling: show error message
 * - Add optimistic update: Show new lead before response
 * - Add auto-notification: Email admin when new lead arrives
 * - Add lead scoring/qualification
 */
export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Omit<Lead, 'id' | 'createdAt'>>({
    mutationFn: (data) => api.post('/leads', data),
    onSuccess: () => {
      // Invalidate cache so leads list refetches
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

/**
 * USE DELETE LEAD HOOK - useDeleteLead()
 * 
 * PURPOSE: Delete lead from admin dashboard
 * 
 * ALGORITHM:
 * 1. Admin clicks delete on a lead row
 * 2. mutate(leadId) calls API: DELETE /leads/{id}
 * 3. Backend deletes lead from database
 * 4. On success: Invalidate cache
 * 5. UI automatically updates with deleted lead removed
 * 
 * PARAMS:
 * - id (string): Lead ID to delete
 * 
 * RETURNS:
 * - mutate(id) - Trigger deletion
 * - isPending - Deletion in progress
 * - isError - Failed to delete
 * 
 * USAGE:
 * const { mutate: deleteLead } = useDeleteLead();
 * const handleDelete = (id) => deleteLead(id);
 * 
 * DEBUGGING:
 * - Verify lead ID is correct
 * - Check API: DELETE http://localhost:8080/api/leads/{id}
 * - Check Authorization header (needs token)
 * - Verify response status 200/204
 * 
 * SAFETY TIPS:
 * - Add confirmation dialog: "Are you sure?"
 * - Add undo functionality with recovery
 * - Add soft delete (mark as deleted, don't remove)
 * - Add deletion audit log for compliance
 * 
 * FEATURE IDEAS:
 * - Add bulk delete multiple leads
 * - Add archive instead of delete
 * - Add 30-day recovery bin
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, string>({
    mutationFn: (id) => api.delete(`/leads/${id}`),
    onSuccess: () => {
      // Invalidate cache so leads list refetches without deleted item
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}
