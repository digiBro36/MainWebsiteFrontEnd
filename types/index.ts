/**
 * USER ROLE TYPE
 * Purpose: Defines the types of users in the system
 * Currently supports: ADMIN role
 * 
 * Debugging: If you add new roles, update this type and add role-based
 * checks in AdminLayout and auth guards
 * 
 * Feature Expansion: To add EDITOR or VIEWER roles:
 * export type UserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';
 */
export type UserRole = 'ADMIN';

/**
 * USER INTERFACE
 * Purpose: Represents an authenticated admin user
 * 
 * Fields:
 * - id: Unique identifier from backend
 * - name: User display name
 * - email: Admin email (used for login)
 * - role: Permission level (currently ADMIN only)
 * 
 * Debugging: Check this structure matches your backend User model
 * Feature: Add 'phone', 'avatar', 'lastLogin' for more user info
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * LEAD INTERFACE
 * Purpose: Represents a potential customer inquiry from the contact form
 * Used for: Sales tracking, lead management, customer follow-ups
 * 
 * Fields:
 * - id: Unique identifier from backend
 * - name: Prospect name (required)
 * - email: Contact email for follow-up (required)
 * - phone: Contact phone (optional)
 * - serviceInterested: Which service they're interested in (optional)
 * - message: Inquiry details (required, min 10 chars)
 * - createdAt: ISO timestamp when lead was submitted
 * 
 * Debugging: 
 * - Check backend returns these exact field names
 * - createdAt must be ISO string: 2026-03-08T10:30:00Z
 * 
 * Feature Ideas:
 * - Add 'status' field: 'new' | 'contacted' | 'qualified' | 'won'
 * - Add 'assignedTo' for admin assignment
 * - Add 'budget' field for pricing tier
 */
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceInterested?: string;
  message?: string;
  createdAt: string;
}

/**
 * SERVICE INTERFACE
 * Purpose: Represents a service offered by the agency
 * Used for: Portfolio display, admin management, lead service matching
 * 
 * Fields:
 * - id: Unique identifier
 * - title: Service name (e.g., "Web Development", "SEO")
 * - description: Service details and benefits
 * - price: Service cost in USD (stored as number, use formatCurrency() to display)
 * - active: Controls visibility on public site
 * 
 * Debugging:
 * - Use formatCurrency(price) in components to display: $999.00
 * - Check 'active' flag when filtering services for display
 * 
 * Feature Ideas:
 * - Add 'icon' field for visual representation
 * - Add 'category' field to group services
 * - Add 'duration' field for project timeline
 * - Add 'featured' flag for homepage highlighting
 */
export interface Service {
  id: string;
  title: string;
  description?: string;
  price: number;
  active: boolean;
}

/**
 * PROJECT INTERFACE
 * Purpose: Represents a completed client project (portfolio item)
 * Used for: Portfolio showcase, social proof, lead engagement
 * 
 * Fields:
 * - id: Unique identifier
 * - title: Project name
 * - description: Project overview and results
 * - clientName: Client company/person name
 * - imageUrl: Portfolio image for display
 * - projectUrl: Link to live project or case study
 * 
 * Debugging:
 * - Validate imageUrl is HTTPS and accessible
 * - Validate projectUrl is valid URL format
 * 
 * Feature Ideas:
 * - Add 'tags' array for project categories (e.g., ['React', 'E-commerce'])
 * - Add 'results' field (e.g., "increased sales by 30%")
 * - Add 'technologies' array for tech stack display
 * - Add 'featured' boolean for homepage display
 */
export interface Project {
  id: string;
  title: string;
  description?: string;
  clientName?: string;
  imageUrl?: string;
  projectUrl?: string;
}

/**
 * AUTH RESPONSE INTERFACE
 * Purpose: Response from backend login endpoint
 * Used for: Storing auth token after successful login
 * 
 * Fields:
 * - token: JWT token for authenticating subsequent API requests
 *          This is stored in localStorage via authStore
 * 
 * Algorithm:
 * 1. User submits login credentials
 * 2. Backend validates and returns JWT token
 * 3. Token stored in localStorage (key: 'dma_token')
 * 4. Token added to all API requests via axios interceptor
 * 5. If token expires (401 response), user redirected to login
 * 
 * Debugging:
 * - Check token format in browser DevTools > Application > localStorage
 * - Token should be long string starting with 'ey...' (base64)
 * - If login fails, check backend /auth/login endpoint response
 */
export interface AuthResponse {
  token: string;
}
