/**
 * UTILITY FUNCTIONS
 * 
 * PURPOSE:
 * Collection of helper functions used throughout the application.
 * Includes CSS utilities, number formatting, and date formatting.
 * 
 * These are commonly used in:
 * - Component styling
 * - Data display formatting
 * - Admin dashboard tables
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * CLASSNAME MERGER UTILITY - cn()
 * 
 * PURPOSE:
 * Merge Tailwind CSS classes without conflicts.
 * Prevents Tailwind class duplication and specificity issues.
 * 
 * ALGORITHM:
 * 1. clsx() - Combines class strings, removes falsy values
 * 2. twMerge() - Removes duplicate Tailwind classes (keeps rightmost)
 * 
 * EXAMPLE:
 * cn('px-4 py-2', 'px-8') // Result: 'py-2 px-8' (px-8 wins)
 * cn('text-red-500', isActive && 'text-blue-500') // Correctly merges
 * 
 * USE CASE:
 * Combine default styles with conditional/variant styles:
 * className={cn('base-class', isHighlighted && 'bg-yellow-100')}
 * 
 * DEBUGGING:
 * - Check DevTools > Elements to verify final class names
 * - Use console.log to see merged output during development
 * 
 * FEATURE: Add error logging for conflicting classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * FORMAT CURRENCY UTILITY - formatCurrency()
 * 
 * PURPOSE:
 * Convert numbers to formatted currency strings (USD).
 * Used in: Price displays, service costs, project budgets
 * 
 * ALGORITHM:
 * Uses Intl.NumberFormat for:
 * - Locale-aware formatting
 * - Currency symbol ($)
 * - Thousands separator (,)
 * - Decimal places (2)
 * 
 * EXAMPLES:
 * formatCurrency(1000) => "$1,000.00"
 * formatCurrency(999.99) => "$999.99"
 * formatCurrency(0) => "$0.00"
 * 
 * USAGE:
 * <p>{formatCurrency(service.price)}</p>
 * 
 * DEBUGGING:
 * - Test edge cases: 0, negative numbers, very large numbers
 * - Check browser locale if formatting looks wrong
 * 
 * FEATURE IDEAS:
 * - Add parameter for currency type (EUR, GBP, etc)
 * - Add parameter to customize decimal places
 * - Example: formatCurrency(value, 'EUR', 2)
 */
export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * FORMAT DATE UTILITY - formatDate()
 * 
 * PURPOSE:
 * Convert ISO date strings or Date objects to readable format.
 * Used in: Lead timestamps, project dates, activity logs
 * 
 * ALGORITHM:
 * 1. If string, convert to Date object: new Date(dateString)
 * 2. Use Intl.DateTimeFormat for locale-aware formatting
 * 3. Format: dateStyle='medium' (Mar 8, 2026)
 *           timeStyle='short' (10:30 AM)
 * 
 * EXAMPLES:
 * formatDate('2026-03-08T10:30:00Z') => "Mar 8, 2026, 10:30 AM"
 * formatDate(new Date()) => "Mar 8, 2026, 2:45 PM"
 * 
 * USAGE:
 * <p>{formatDate(lead.createdAt)}</p>
 * <td>{formatDate(project.createdAt)}</td>
 * 
 * DEBUGGING:
 * - Check timezone: formatDate includes browser's local time
 * - Verify date string is ISO format (YYYY-MM-DDTHH:mm:ssZ)
 * - Use new Date(dateString).toISOString() to debug
 * 
 * FEATURE IDEAS:
 * - Add parameter for different date formats (short, long, full)
 * - Add parameter for timezone conversion
 * - Add relative time: "2 hours ago" using date-fns
 * - Example: formatDate(date, 'short', 'EST')
 */
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', { 
    dateStyle: 'medium', // Mar 8, 2026
    timeStyle: 'short'   // 10:30 AM
  }).format(
    typeof date === 'string' ? new Date(date) : date
  );
}
