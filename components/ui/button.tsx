/**
 * BUTTON COMPONENT - Reusable UI Component
 * 
 * PURPOSE:
 * Base button component used throughout the app
 * Supports multiple variants and sizes
 * Built with CVA (class-variance-authority) for type-safe styling
 * 
 * FEATURES:
 * - Multiple variants: default, secondary, ghost, glass
 * - Multiple sizes: sm, md, lg
 * - Accessible focus states
 * - Disabled state handling
 * - Forwardref for parent DOM access
 * 
 * USAGE:
 * <Button onClick={handleClick}>Click me</Button>
 * <Button variant="secondary" size="lg">Large secondary button</Button>
 * <Button disabled>Disabled</Button>
 * <Button as="a" href="/link">Link button</Button>
 * 
 * DEBUGGING:
 * - Check classes apply correctly: Open DevTools
 * - Verify hover states work
 * - Test focus states for accessibility
 * - Ensure disabled state prevents clicks
 * 
 * FEATURE IDEAS:
 * - Add loading state with spinner
 * - Add icon support (left/right)
 * - Add loading skeleton variant
 * - Add tooltip on hover
 * - Add analytics tracking
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * BUTTON VARIANTS DEFINITION
 * 
 * Purpose: Define all button styles using CVA (class-variance-authority)
 * 
 * STRUCTURE:
 * cva(baseStyles, {
 *   variants: {
 *     variant: { ... },
 *     size: { ... }
 *   },
 *   defaultVariants: { ... }
 * })
 * 
 * CVA BENEFITS:
 * - Type-safe: TypeScript knows which props are valid
 * - DRY: Define styles once, reuse everywhere
 * - Composable: Combine variant and size
 * 
 * BASE STYLES (applied to all buttons):
 * - Flexbox layout (center items)
 * - Rounded corners (rounded-xl)
 * - Smooth transitions for hover effects
 * - Focus ring for accessibility
 * - Disabled state handling
 * 
 * VARIANTS:
 * 1. default: Primary button (filled with primary color)
 * 2. secondary: Secondary action (light background)
 * 3. ghost: Minimal button (transparent background)
 * 4. glass: Glassmorphism style (translucent + backdrop blur)
 * 
 * SIZES:
 * - sm: 9px height, small padding
 * - md: 11px height, medium padding (default)
 * - lg: 12px height, large padding
 */
const buttonVariants = cva(
  // BASE STYLES - Applied to all button variants
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      // VARIANT OPTIONS
      variant: {
        // Default: Primary filled button
        // Used for main CTAs
        default: 'bg-primary-500 text-white hover:bg-primary-600',
        
        // Secondary: Light filled button
        // Used for secondary actions
        secondary: 'bg-white/10 text-white hover:bg-white/20',
        
        // Ghost: Transparent button
        // Minimal style, text only
        ghost: 'bg-transparent text-white/80 hover:bg-white/10',
        
        // Glass: Glassmorphism style
        // Translucent with blur effect
        glass: 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-xl border border-white/10',
      },
      
      // SIZE OPTIONS
      size: {
        // Small size
        sm: 'h-9 px-3',
        
        // Medium size (default)
        md: 'h-11 px-4',
        
        // Large size
        lg: 'h-12 px-6',
      },
    },
    
    // DEFAULT VARIANT AND SIZE
    // Used if not specified
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * BUTTON PROPS INTERFACE
 * 
 * Extends: HTMLButtonElement attributes + Variant props
 * 
 * Allows passing:
 * - Standard HTML button props: onClick, disabled, etc.
 * - Custom variant and size props
 * - className for overrides
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * BUTTON COMPONENT
 * 
 * Features:
 * - Forwardref: Allows parent to access DOM node
 * - Type-safe: TypeScript knows all valid props
 * - Styled: CVA handles all styling
 * 
 * Algorithm:
 * 1. Merge variant/size classes with buttonVariants()
 * 2. Merge custom className with cn() utility
 * 3. Spread remaining props to button element
 * 4. Render as button HTML element
 * 
 * EXAMPLE:
 * <Button variant="secondary" size="lg" onClick={() => alert('Clicked!')}>
 *   Click me
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        // Merge variant/size classes with custom className
        // cn() prevents class conflicts (uses tailwind-merge)
        className={cn(buttonVariants({ variant, size }), className)}
        {...props} // Spread remaining props (onClick, disabled, etc)
      />
    );
  }
);

/**
 * DISPLAY NAME
 * 
 * Purpose: For debugging in React DevTools
 * Shows "Button" instead of "ForwardRef" in component tree
 */
Button.displayName = 'Button';
