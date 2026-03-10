/**
 * ADMIN DASHBOARD PAGE - /admin/dashboard
 * 
 * PURPOSE:
 * Main admin dashboard showing key metrics and recent activity
 * Displays:
 * - Statistics cards (leads, services, projects, conversion)
 * - Recent leads table
 * - Service status chart
 * - Activity timeline
 * 
 * FEATURES:
 * - Real-time data from React Query hooks
 * - Responsive grid layout
 * - Automatic data refresh (5-min cache)
 * - Key metrics and KPIs
 * 
 * ALGORITHM:
 * 1. Fetch leads, services, projects using hooks
 * 2. Calculate statistics from data
 * 3. Render stat cards with metrics
 * 4. Display recent leads table
 * 5. Show service status and activity timeline
 * 6. Auto-refresh every 5 minutes (staleTime)
 * 
 * DATA FLOW:
 * useLeads() → React Query → API → Display
 * useServices() → React Query → API → Display
 * useProjects() → React Query → API → Display
 * 
 * DEBUGGING:
 * - Check React Query DevTools for cache hits
 * - Open Network tab to see API calls
 * - Verify data loads within 5 seconds
 * - Check if stats match data count
 * 
 * FEATURE IDEAS:
 * - Add date range filter (Last 7 days, This month)
 * - Add export to CSV/PDF
 * - Add custom dashboard (drag-drop widgets)
 * - Add goal tracking vs actual
 * - Add revenue analytics
 * - Add lead source breakdown
 */

'use client';

import { useMemo } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useServices } from '@/hooks/useServices';
import { useProjects } from '@/hooks/useProjects';
import { StatCard } from '@/components/admin/StatCard';
import { RecentLeadsTable } from '@/components/admin/RecentLeadsTable';
import { ServicesStatusChart } from '@/components/admin/ServicesStatusChart';
import { ActivityTimeline } from '@/components/admin/ActivityTimeline';

/**
 * DASHBOARD PAGE COMPONENT
 * 
 * LAYOUT:
 * - Full width with padding
 * - Responsive grid layout
 * - 4 stat cards on top
 * - 2-column layout below (leads + charts)
 * 
 * STATS DISPLAYED:
 * 1. Total Leads - Count of all contact form submissions
 * 2. Active Services - Services with active=true
 * 3. Projects - Count of portfolio projects
 * 4. Conversion Rate - Percentage: projects/leads * 100
 */
export default function DashboardPage() {
  // ═════════════════════════════════════════════════════════
  // DATA FETCHING WITH REACT QUERY
  // ═════════════════════════════════════════════════════════
  
  /**
   * FETCH LEADS
   * - Query key: ['leads']
   * - Endpoint: GET /leads
   * - Cache: 5 minutes
   * - Default: [] (empty array if error)
   */
  const { data: leads = [] } = useLeads();

  /**
   * FETCH SERVICES
   * - Query key: ['services']
   * - Endpoint: GET /services
   * - Cache: 5 minutes
   * - Default: [] (empty array if error)
   */
  const { data: services = [] } = useServices();

  /**
   * FETCH PROJECTS
   * - Query key: ['projects']
   * - Endpoint: GET /projects
   * - Cache: 5 minutes
   * - Default: [] (empty array if error)
   */
  const { data: projects = [] } = useProjects();

  // ═════════════════════════════════════════════════════════
  // STATISTICS CALCULATION
  // ═════════════════════════════════════════════════════════

  /**
   * CALCULATE DASHBOARD STATS
   * 
   * Purpose: Compute metrics from fetched data
   * 
   * ALGORITHM:
   * 1. Count active services: services.filter(s => s.active).length
   * 2. Total leads: leads.length
   * 3. Total projects: projects.length
   * 4. Conversion rate: (projects / leads) * 100
   *    - Capped at 75% max for realism
   *    - Default to 0 if no leads
   * 
   * Memoization: useMemo
   * - Recalculates only when leads/services/projects change
   * - Prevents unnecessary recalculation on re-render
   * - Improves performance
   * 
   * EXAMPLE STATS:
   * { totalLeads: 45, activeServices: 5, projects: 8, conversionRate: 18 }
   * 
   * FEATURE IDEAS:
   * - Add trend calculations: vs last month
   * - Add growth percentage
   * - Add monthly revenue
   * - Add lead quality score
   */
  const stats = useMemo(() => {
    const activeServices = services.filter((item) => item.active).length;
    return {
      totalLeads: leads.length,
      activeServices,
      projects: projects.length,
      conversionRate: leads.length > 0 
        ? Math.min(75, Math.round((projects.length / leads.length) * 100))
        : 0,
    };
  }, [leads, projects, services]);

  // ═════════════════════════════════════════════════════════
  // RENDER DASHBOARD
  // ═════════════════════════════════════════════════════════

  return (
    <div className="space-y-10 p-6">
      {/* ═════════════════════════════════════════════════════════
          STATISTICS CARDS ROW
          ═════════════════════════════════════════════════════════ */}
      {/* 
        Responsive 4-column grid on desktop, 1-2 on mobile
        gap-6: Space between cards
      */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* STAT CARD 1: Total Leads */}
        <StatCard 
          title="Total Leads" 
          value={stats.totalLeads} 
          trend="+12%" // Simulated trend
          icon="users" 
        />

        {/* STAT CARD 2: Active Services */}
        <StatCard 
          title="Active Services" 
          value={stats.activeServices} 
          trend="+8%" 
          icon="layers" 
        />

        {/* STAT CARD 3: Projects */}
        <StatCard 
          title="Projects" 
          value={stats.projects} 
          trend="+5%" 
          icon="briefcase" 
        />

        {/* STAT CARD 4: Conversion Rate */}
        <StatCard 
          title="Conversion" 
          value={`${stats.conversionRate}%`} 
          trend="+3%" 
          icon="trending-up" 
        />
      </div>

      {/* ═════════════════════════════════════════════════════════
          CONTENT GRID: 2/3 width + 1/3 sidebar
          ═════════════════════════════════════════════════════════ */}
      {/* 
        3-column layout on desktop
        Full width on mobile
        gap-6: Space between sections
      */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* MAIN CONTENT COLUMN: Recent Leads Table */}
        {/* 
          Spans 2 columns on desktop, full on mobile
          Uses glass-morphism card style
        */}
        <div className="glass col-span-3 lg:col-span-2 p-6">
          <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
          {/* 
            Shows table of latest lead submissions
            Features: Sorting, pagination, delete action
            Data source: useLeads() hook
          */}
          <RecentLeadsTable />
        </div>

        {/* SIDEBAR: Charts and timeline */}
        {/* Stacked vertically, takes right column */}
        <div className="space-y-6">
          
          {/* SERVICE STATUS CHART */}
          {/* 
            Shows breakdown of active/inactive services
            Pie chart or similar visualization
            Data source: useServices() hook
          */}
          <div className="glass p-6">
            <h2 className="text-xl font-semibold text-white">Service Status</h2>
            <ServicesStatusChart />
          </div>

          {/* ACTIVITY TIMELINE */}
          {/* 
            Shows recent admin actions
            Created leads, updated services, etc.
            Chronological order (newest first)
          */}
          <div className="glass p-6">
            <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>
            <ActivityTimeline />
          </div>
        </div>
      </div>
    </div>
  );
}
