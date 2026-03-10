/**
 * FORM VALIDATION SCHEMAS
 * 
 * PURPOSE:
 * Define Zod validation schemas for all forms in the app.
 * Provides:
 * - Type-safe form data
 * - Runtime validation
 * - Error messages for users
 * - Backend-frontend consistency
 * 
 * LIBRARY: Zod (TypeScript-first schema validation)
 * 
 * ALGORITHM:
 * 1. Define schema with validation rules
 * 2. Attach custom error messages
 * 3. Use with react-hook-form via zodResolver
 * 4. Validates on submit or field blur
 * 5. Shows error messages to user
 * 
 * DEBUGGING:
 * - Test validation: schema.parse(data) throws on error
 * - Test in console: import { loginSchema } from '@/lib/validations'
 *                    loginSchema.parse({email: 'test@test.com', password: '123456'})
 * - Check error messages match your business rules
 * 
 * FEATURE ADDITION:
 * - Add custom validation rules: .refine(custom logic)
 * - Add async validation: .refine(async rule)
 * - Add conditional fields: .superRefine() for complex logic
 */

import { z } from 'zod';

/**
 * LOGIN FORM SCHEMA
 * 
 * PURPOSE: Validate admin login credentials
 * 
 * Fields:
 * - email: Must be valid email format (from backend)
 * - password: Minimum 6 characters (from backend)
 * 
 * RULES:
 * Email: Standard email validation via z.string().email()
 * Password: At least 6 chars to prevent weak passwords
 * 
 * USAGE:
 * const loginSchema = z.object({
 *   email: z.string().email(),
 *   password: z.string().min(6)
 * })
 * 
 * IN COMPONENT:
 * const form = useForm({ resolver: zodResolver(loginSchema) })
 * 
 * DEBUGGING:
 * - Test: loginSchema.parse({email: 'bad', password: '123'})
 * - Will throw validation errors
 * 
 * FEATURE IDEAS:
 * - Add reCAPTCHA for brute force protection
 * - Add remember-me checkbox
 * - Add password strength meter
 * - Add rate limiting (max 5 login attempts)
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

/**
 * LEAD FORM SCHEMA
 * 
 * PURPOSE: Validate contact form submission from leads
 * Used by: Public contact form, lead management
 * 
 * FIELDS:
 * - name: Min 2 chars (required) - Catch spam with single char names
 * - email: Valid email (required) - For follow-up
 * - phone: Optional - Some won't provide
 * - serviceInterested: Optional - Lead might not know which service
 * - message: Min 10 chars (required) - Prevent spam/bot submissions
 * 
 * VALIDATION LOGIC:
 * - Spam detection: Long name + short message likely spam
 * - Message check: 10 chars filters "hello", "test", etc
 * 
 * DEBUGGING:
 * - Test spam: leadSchema.parse({name: 'a', email: 'test@test.com', message: 'hi'})
 * - Should fail on name and message length
 * 
 * FEATURE IDEAS:
 * - Add spam keywords filter
 * - Add phone format validation (US: +1 234-567-8900)
 * - Add service selection dropdown (from database)
 * - Add honeypot field for bot detection
 * - Add Captcha for extra security
 * 
 * BACKEND MATCH:
 * Check backend Lead model matches these fields
 */
export const leadSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  email: z.string().email({ message: 'Email is required' }),
  phone: z.string().optional(), // Can be empty
  serviceInterested: z.string().optional(), // Can be empty
  message: z.string().min(10, { message: 'Message should be at least 10 characters' }),
});

/**
 * SERVICE FORM SCHEMA
 * 
 * PURPOSE: Validate service creation/editing in admin dashboard
 * 
 * FIELDS:
 * - title: Min 3 chars - Prevent "a", "ab" as service names
 * - description: Optional - Can add details later
 * - price: Must be >= 0 - Prevent negative prices
 * - active: Boolean - Controls public visibility
 * 
 * VALIDATION LOGIC:
 * - Title: 3+ chars ensures meaningful service names
 * - Price: Non-negative only (can be 0 for free services)
 * - Active: Toggles visibility without deleting
 * 
 * USAGE IN ADMIN:
 * Admin creates new service -> Form validates -> POST /services
 * 
 * DEBUGGING:
 * - Check price is number: z.number().min(0)
 * - Test: serviceSchema.parse({title: 'a', price: -5, active: false})
 * - Should fail on title and price
 * 
 * FEATURE IDEAS:
 * - Add category field: 'web', 'seo', 'social', etc
 * - Add min/max price range
 * - Add featured toggle for homepage
 * - Add duration field: "2-4 weeks"
 * - Add revisions/deliverables list
 */
export const serviceSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
  price: z.number().min(0, { message: 'Price must be a positive number' }),
  active: z.boolean(), // Can't be optional - must explicitly set
});

/**
 * PROJECT FORM SCHEMA
 * 
 * PURPOSE: Validate project/portfolio item creation/editing
 * 
 * FIELDS:
 * - title: Min 3 chars - Project name
 * - description: Optional - Project details and results
 * - clientName: Optional - Client company/person name
 * - imageUrl: Valid HTTPS URL, optional - Portfolio image
 * - projectUrl: Valid HTTPS URL, optional - Live demo link
 * 
 * VALIDATION LOGIC:
 * - Title: Minimum 3 chars for meaningful names
 * - imageUrl: Must be valid URL for display
 * - projectUrl: Must be valid URL for links
 * 
 * URL VALIDATION:
 * z.string().url() checks for valid URL format
 * Accepts: http://, https://
 * Rejects: "google.com" (missing https://), "not a url"
 * 
 * DEBUGGING:
 * - Test URL: projectSchema.parse({title: 'test', imageUrl: 'not-url'})
 * - Should fail: "Image URL must be valid"
 * 
 * FEATURE IDEAS:
 * - Add technology tags: ['React', 'Node.js', 'PostgreSQL']
 * - Add results field: "Increased sales by 40%"
 * - Add featured toggle for homepage
 * - Add case study markdown content
 * - Add before/after images
 * - Add client testimonial
 * 
 * PERFORMANCE TIPS:
 * - Cache images in CDN (URL should be static)
 * - Use image optimization library
 * - Validate URLs before storing
 */
export const projectSchema = z.object({
  title: z.string().min(3, { message: 'Title is required' }),
  description: z.string().optional(),
  clientName: z.string().optional(),
  imageUrl: z.string().url({ message: 'Image URL must be valid' }).optional(),
  projectUrl: z.string().url({ message: 'Project URL must be valid' }).optional(),
});
