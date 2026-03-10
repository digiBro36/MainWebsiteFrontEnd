/**
 * PROJECTS DATA MANAGEMENT HOOKS
 * 
 * PURPOSE:
 * Custom React hooks for portfolio/project CRUD operations
 * Manage project portfolio items from admin dashboard
 * 
 * LIBRARY: @tanstack/react-query for server state management
 * 
 * DATA FLOW:
 * Components → Hooks (useProjects/useCreateProject/etc)
 *           → React Query (caching, state)
 *           → API Client (axios with auth)
 *           → Backend (REST endpoints)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Project } from '@/types';

/**
 * USE PROJECTS HOOK - useProjects()
 * 
 * PURPOSE: Fetch all portfolio projects
 * 
 * USAGE:
 * const { data: projects, isLoading } = useProjects();
 * projects.map(p => <ProjectCard key={p.id} project={p} />)
 * 
 * DEBUGGING:
 * - Open DevTools > Network > Filter 'projects'
 * - Check request: GET /projects
 * - Check response: Array of Project objects
 * - Verify images load: Check imageUrl paths
 * 
 * PERFORMANCE:
 * staleTime: 5 min = Cache for 5 minutes
 * If multiple components use this hook, all share cached data
 * 
 * FEATURE: Add sorting/filtering
 * export function useProjects(sortBy = 'recent', featured = false) {
 *   return useQuery({
 *     queryKey: ['projects', sortBy, featured],
 *     queryFn: () => api.get('/projects', {
 *       params: {sortBy, featured}
 *     }).then(r => r.data),
 *   })
 * }
 * 
 * FEATURE: Add featured flag
 * const featuredProjects = useProjects(true); // Homepage featured
 * const allProjects = useProjects(false);     // Portfolio page all
 */
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => api.get<Project[]>('/projects').then((res) => res.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * USE CREATE PROJECT HOOK - useCreateProject()
 * 
 * PURPOSE: Add new portfolio project
 * 
 * ALGORITHM:
 * 1. Admin fills project form
 *    - Title (required, min 3 chars)
 *    - Description (optional)
 *    - Client name (optional)
 *    - Image URL (optional, must be valid URL)
 *    - Project URL (optional, must be valid URL)
 * 
 * 2. Form validates with projectSchema
 * 
 * 3. mutate(projectData) sends:
 *    POST /projects
 *    { title, description, clientName, imageUrl, projectUrl }
 * 
 * 4. Backend:
 *    - Validates data
 *    - Generates unique ID
 *    - Stores in database
 *    - Returns Project with ID
 * 
 * 5. React Query:
 *    - Invalidates ['projects'] cache
 *    - Refetches projects list
 *    - Components using useProjects() rerender
 * 
 * 6. Result: New project visible in admin and portfolio
 * 
 * USAGE:
 * const { mutate, isPending, isError } = useCreateProject();
 * <form onSubmit={handleSubmit(data => mutate(data))}>...</form>
 * <button disabled={isPending}>{isPending ? 'Creating...' : 'Create'}</button>
 * 
 * DEBUGGING:
 * - Check form passes validation
 * - Verify image URL is accessible: curl imageUrl
 * - Check backend response status 200/201
 * - Verify new project in admin list
 * 
 * FEATURE IDEAS:
 * - Add image upload (instead of URL)
 * - Add before/after image comparison
 * - Add results/metrics field
 * - Add technology tags
 * - Add case study content
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Omit<Project, 'id'>>({
    mutationFn: (data) => api.post<Project>('/projects', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * USE UPDATE PROJECT HOOK - useUpdateProject()
 * 
 * PURPOSE: Edit existing portfolio project
 * 
 * ALGORITHM:
 * 1. Admin clicks edit on project
 * 2. Form pre-fills with current values
 * 3. Admin modifies fields
 * 4. mutate({id, data}) sends:
 *    PUT /projects/{id}
 *    { title, description, clientName, imageUrl, projectUrl }
 * 
 * 5. Backend updates project, returns new version
 * 6. Cache invalidated, list refetches
 * 7. Changes visible immediately
 * 
 * PARAMS:
 * - id: Project ID (required)
 * - data: Updated fields (Omit<Project, 'id'>)
 * 
 * USAGE:
 * const { mutate: updateProject } = useUpdateProject();
 * const handleUpdate = (id, data) => updateProject({id, data});
 * 
 * DEBUGGING:
 * - Verify project ID is valid: curl GET /projects/{id}
 * - Check request body has all fields
 * - Verify response status 200
 * - Check changes in admin list
 * 
 * FEATURE IDEAS:
 * - Add "promote to featured" button
 * - Add version history/rollback
 * - Add bulk edit multiple projects
 * - Add change log/audit trail
 * - Add A/B testing: Show 2 versions to compare
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    unknown,
    { id: string; data: Omit<Project, 'id'> }
  >({
    mutationFn: ({ id, data }) => api.put<Project>(`/projects/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

/**
 * USE DELETE PROJECT HOOK - useDeleteProject()
 * 
 * PURPOSE: Remove project from portfolio
 * 
 * ALGORITHM:
 * 1. Admin clicks delete on project row
 * 2. Confirmation dialog: "Delete project? This cannot be undone."
 * 3. mutate(id) sends: DELETE /projects/{id}
 * 4. Backend deletes project, returns success
 * 5. Cache invalidated, list refetches
 * 6. Project removed from portfolio
 * 
 * USAGE:
 * const { mutate: deleteProject, isPending } = useDeleteProject();
 * const handleDelete = (id) => {
 *   if (window.confirm('Delete project?')) {
 *     deleteProject(id);
 *   }
 * }
 * 
 * DEBUGGING:
 * - Check project ID exists: curl GET /projects/{id}
 * - Verify request: DELETE /projects/{id}
 * - Check Authorization header present
 * - Verify 404 if already deleted
 * - Check project removed from list
 * 
 * SAFETY FEATURES TO ADD:
 * - Confirmation dialog with project title
 * - Soft delete: Mark deleted but keep data
 * - Recovery bin: 30-day recovery period
 * - Audit log: Who deleted what and when
 * - Backup: Daily database backups
 * 
 * FEATURE IDEAS:
 * - Add bulk delete multiple projects
 * - Add archive instead of delete
 * - Add move to draft/unpublished
 * - Add delete with notification to linked users
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation<unknown, unknown, string>({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
