/**
 * LOGIN FORM COMPONENT
 * 
 * PURPOSE:
 * Admin authentication form for accessing dashboard
 * Handles email/password input, validation, and submission
 * 
 * FEATURES:
 * - Form validation using Zod schema
 * - React Hook Form for form state management
 * - Loading state while authenticating
 * - Error message display
 * - API integration via useLogin hook
 * 
 * ALGORITHM:
 * 1. User enters email and password
 * 2. onSubmit validates with loginSchema
 * 3. If valid, calls mutate(credentials)
 * 4. useLogin hook makes API call: POST /auth/login
 * 5. Backend validates and returns JWT token
 * 6. Token stored in localStorage and authStore
 * 7. Router redirects to dashboard
 * 
 * DEBUGGING:
 * - Check browser console for form validation errors
 * - Verify API call in Network tab: POST /auth/login
 * - Check credentials match backend user
 * - Look for auth token in localStorage: 'dma_token'
 * - Test with: email: 'admin@test.com', password: 'password123'
 * 
 * FEATURE IDEAS:
 * - Add "remember me" checkbox for token persistence
 * - Add "forgot password" link for recovery
 * - Add 2FA (two-factor authentication) flow
 * - Add login attempt rate limiting
 * - Add success/error toast notifications
 * - Add loading spinner animation
 */

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';
import { useLogin } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/**
 * LOGIN FORM VALUES TYPE
 * 
 * Purpose: Type-safe form data
 * Used by: react-hook-form useForm hook
 * 
 * Fields match loginSchema validation
 */
type LoginFormValues = {
  email: string;
  password: string;
};

/**
 * LOGIN FORM COMPONENT
 * 
 * Props: None (uses hooks for state)
 * 
 * HOOKS USED:
 * - useForm: Form state and validation
 * - useLogin: API call and auth flow
 * 
 * RENDERS:
 * - Form title and description
 * - Email input with validation error
 * - Password input with validation error
 * - Error message if login fails
 * - Submit button (shows loading state)
 */
export function LoginForm() {
  // Get mutation hook for login
  const { mutate, isPending, isError, error } = useLogin();
  
  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // Validate with Zod schema
  });

  /**
   * FORM SUBMISSION HANDLER
   * 
   * Called when form submitted and validation passes
   * 
   * Algorithm:
   * 1. Receive validated form data (email, password)
   * 2. Call mutate() to trigger login
   * 3. useLogin handles API call, token storage, redirect
   */
  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* FORM TITLE */}
      <h2 className="text-xl font-semibold text-white">Admin login</h2>
      <p className="text-sm text-neutral-text_muted">Use your admin credentials to access the dashboard.</p>

      {/* EMAIL INPUT */}
      {/* 
        register('email') connects field to form state
        errors.email?.message shows validation error
      */}
      <Input 
        label="Email" 
        type="email" 
        {...register('email')} 
        error={errors.email?.message as string} 
      />
      
      {/* PASSWORD INPUT */}
      <Input 
        label="Password" 
        type="password" 
        {...register('password')} 
        error={errors.password?.message as string} 
      />

      {/* ERROR MESSAGE DISPLAY */}
      {/* Shows if API returns 401 or other error */}
      {isError ? (
        <p className="text-sm text-danger-300">
          {(error as Error)?.message || 'Unable to login'}
        </p>
      ) : null}

      {/* SUBMIT BUTTON */}
      {/* 
        disabled={isPending} prevents double-submission
        Shows "Signing in..." during API call
      */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
