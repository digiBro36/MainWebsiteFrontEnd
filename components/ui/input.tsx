import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(16).slice(2)}`;

    return (
      <div className="relative">
        {label ? (
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-3 top-2 text-xs font-medium transition-all',
              props.value && props.value.toString().length > 0 ? 'text-primary-300 -translate-y-5 scale-90' : 'text-neutral-text_muted'
            )}
          >
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30',
            error && 'border-danger-500 focus:border-danger-400 focus:ring-danger-500/30',
            className
          )}
          {...props}
        />
        {error ? <p className="mt-1 text-xs text-danger-300">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
