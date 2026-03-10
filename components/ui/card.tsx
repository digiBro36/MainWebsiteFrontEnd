import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, children, glass = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl',
        glass && 'glass',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
