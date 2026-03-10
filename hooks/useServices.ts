/**
 * SERVICES DATA MANAGEMENT HOOKS
 * 
 * PURPOSE:
 * Custom React hooks for CRUD operations on services
 * Fetch, create, update, and delete services from admin dashboard
 * 
 * LIBRARY: @tanstack/react-query for server state
 * 
 * ALGORITHM:
 * 1. useServices() - Fetch all services on page load
 * 2. Create/Update/Delete mutations - Modify services
 * 3. After mutation, invalidate cache to refetch
 * 4. UI automatically updates with new data
 * 
 * CACHE STRATEGY:
 * - Query Key: ['services'] - Shared cache for all operations
 * - Stale Time: 5 minutes - Reduce API calls
 * - Invalidation: After any mutation, refetch from server
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Service } from '@/types';

/**
 * USE SERVICES HOOK - useServices()
 * 
 * PURPOSE: Fetch all services from backend
 * 
 * USAGE:
 * const { data: services, isLoading } = useServices();
 * services.map(s => <ServiceCard key={s.id} service={s} />)
 * 
 * DEBUGGING:
 * - Check backend endpoint: GET /services
 * - Verify response is Service[] array
 * - Check active filter: Show only active=true services on public site
 * 
 * FEATURE: Add filtering
 * export function useServices(filters?: {active?: boolean}) {
 *   return useQuery<Service[]>({
 *     queryKey: ['services', filters],
 *     queryFn: () => api.get('/services', {params: filters}).then(r => r.data),
 *     ...
 *   })
 * }
 */
export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => api.get<Service[]>('/services').then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * USE CREATE SERVICE HOOK - useCreateService()
 * 
 * PURPOSE: Create new service in admin panel
 * 
 * ALGORITHM:
 * 1. Admin fills service form (title, description, price, active)
 * 2. Form validates with serviceSchema
 * 3. mutate(serviceData) sends POST /services
 * 4. Backend generates ID and returns Service
 * 5. Cache invalidated, leads query refetches
 * 6. New service appears in admin table immediately
 * 
 * USAGE:
 * const { mutate, isPending } = useCreateService();
 * const handleCreate = (data) => mutate(data);
 * 
 * DEBUGGING:
 * - Check form fields match Service interface (minus id)
 * - Verify API response includes generated ID
 * - Check new service appears in list after creation
 * - Use React Query DevTools to see cache updates
 * 
 * FEATURE IDEAS:
 * - Add toast notification: "Service created successfully"
 * - Add optimistic update: Show new service immediately
 * - Add form auto-reset after success
 * - Add service duplication feature
 */
export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Omit<Service, 'id'>>({
    mutationFn: (data) => api.post<Service>('/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

/**
 * USE UPDATE SERVICE HOOK - useUpdateService()
 * 
 * PURPOSE: Edit existing service in admin panel
 * 
 * ALGORITHM:
 * 1. Admin clicks edit on service
 * 2. Form pre-fills with current data
 * 3. Admin makes changes
 * 4. mutate({id, data}) sends PUT /services/{id}
 * 5. Backend updates service and returns updated version
 * 6. Cache invalidated and refetched
 * 7. Changes visible immediately in table
 * 
 * PARAMS:
 * - id: Service ID to update
 * - data: New service values (Omit<Service, 'id'>)
 * 
 * USAGE:
 * const { mutate: updateService } = useUpdateService();
 * const handleUpdate = (id, data) => updateService({id, data});
 * 
 * DEBUGGING:
 * - Verify service ID exists
 * - Check API: PUT /services/{id}
 * - Verify request body is valid
 * - Check response returns updated service
 * 
 * FEATURE IDEAS:
 * - Add partial updates (only changed fields)
 * - Add version control for service history
 * - Add audit log of who updated what and when
 * - Add compare before/after changes
 */
export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    unknown,
    { id: string; data: Omit<Service, 'id'> }
  >({
    mutationFn: ({ id, data }) => api.put<Service>(`/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

/**
 * USE DELETE SERVICE HOOK - useDeleteService()
 * 
 * PURPOSE: Delete service from admin panel
 * 
 * ALGORITHM:
 * 1. Admin clicks delete on service row
 * 2. Confirmation dialog: "Are you sure?"
 * 3. mutate(id) sends DELETE /services/{id}
 * 4. Backend deletes service permanently
 * 5. Cache invalidated
 * 6. Service removed from table
 * 
 * USAGE:
 * const { mutate: deleteService, isPending } = useDeleteService();
 * const handleDelete = (id) => {
 *   if (confirm("Delete service?")) deleteService(id);
 * }
 * 
 * DEBUGGING:
 * - Verify service ID is correct
 * - Check API: DELETE /services/{id}
 * - Ensure Authorization header present (admin only)
 * - Verify 404 if service already deleted
 * 
 * SAFETY FEATURES:
 * - Add confirmation dialog
 * - Add soft delete (mark deleted, don't remove)
 * - Add recovery bin
 * - Add check: Can't delete if leads linked to service
 * - Add audit log for compliance
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, string>({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
