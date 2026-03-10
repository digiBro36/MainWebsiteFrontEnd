/**
 * STAT CARD COMPONENT
 * 
 * PURPOSE:
 * Display a single metric/statistic on the dashboard
 * Used for: Total Leads, Active Services, Projects, Conversion Rate
 * 
 * FEATURES:
 * - Large number display
 * - Metric title and trend
 * - Icon indicator
 * - Glass morphism styling
 * - Month-over-month comparison
 * 
 * PROPS:
 * - title: What is this metric (e.g., "Total Leads")
 * - value: The number to display (e.g., 42)
 * - trend: Change trend (e.g., "+12%")
 * - icon: Icon type ('users', 'layers', 'briefcase', 'trending-up')
 * 
 * USAGE:
 * <StatCard
 *   title="Total Leads"
 *   value={45}
 *   trend="+12%"
 *   icon="users"
 * />
 * 
 * DEBUGGING:
 * - Check icon renders correctly
 * - Verify value displays large and clear
 * - Ensure trend shows green/positive indicator
 * 
 * FEATURE IDEAS:
 * - Add click to expand for details
 * - Add sparkline chart in background
 * - Add comparison to previous period
 * - Add animated counter animation
 * - Add color coding for positive/negative trends
 */

'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';

/**
 * STAT CARD PROPS INTERFACE
 * 
 * Fields:
 * - title (string): The metric name
 * - value (string | number): The value to display
 * - trend (string): Trend indicator (e.g., "+12%")
 * - icon (icon type): Which icon to show
 */
interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon: 'users' | 'layers' | 'briefcase' | 'trending-up';
}

/**
 * ICON MAP
 * 
 * Purpose: Map icon names to actual icon components
 * 
 * Algorithm:
 * - Record<type, JSX.Element> = lookup table
 * - icon prop used as key to get correct icon
 * - Currently all use ArrowUp
 * 
 * FEATURE: Add different icons per metric
 * const iconMap: Record<StatCardProps['icon'], JSX.Element> = {
 *   users: <Users className="h-5 w-5" />,
 *   layers: <Layers className="h-5 w-5" />,
 *   briefcase: <Briefcase className="h-5 w-5" />,
 *   'trending-up': <TrendingUp className="h-5 w-5" />,
 * };
 */
const iconMap: Record<StatCardProps['icon'], JSX.Element> = {
  users: <ArrowUp className="h-5 w-5" />,
  layers: <ArrowUp className="h-5 w-5" />,
  briefcase: <ArrowUp className="h-5 w-5" />,
  'trending-up': <ArrowUp className="h-5 w-5" />,
};

/**
 * STAT CARD COMPONENT
 * 
 * Props: StatCardProps (title, value, trend, icon)
 * 
 * Renders:
 * - Card container with glass effect
 * - Left: Title + Value display
 * - Right: Icon in rounded box
 * - Bottom: Trend badge + period comparison
 */
export function StatCard({ title, value, trend, icon }: StatCardProps) {
  return (
    /* CARD CONTAINER */
    <div className="glass rounded-3xl p-6 shadow-glow">
      {/* FLEX LAYOUT: Content left, Icon right */}
      <div className="flex items-center justify-between">
        {/* LEFT SIDE: Metric info */}
        <div>
          {/* METRIC TITLE */}
          <p className="text-sm font-medium text-neutral-text_muted">{title}</p>
          
          {/* LARGE VALUE DISPLAY */}
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
        
        {/* RIGHT SIDE: Icon */}
        {/* Rounded box with icon inside */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
          {/* Get icon from map based on icon prop */}
          {iconMap[icon]}
        </div>
      </div>
      
      {/* BOTTOM SECTION: Trend badge + period */}
      <div className="mt-4 flex items-center gap-2 text-sm text-neutral-text_muted">
        {/* TREND BADGE */}
        {/* 
          Shows trend with arrow icon
          Green styling indicates positive growth
        */}
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
          {/* Arrow icon with accent color */}
          <ArrowUp className="h-3 w-3 text-secondary-accent" />
          {/* Trend percentage */}
          {trend}
        </span>
        
        {/* PERIOD LABEL */}
        <span>vs last month</span>
      </div>
    </div>
  );
}
