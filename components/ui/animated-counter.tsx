'use client';

import { useEffect, useMemo, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export function AnimatedCounter({ value, duration = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const step = useMemo(() => Math.max(1, Math.floor(value / (duration / 16))), [value, duration]);

  useEffect(() => {
    let current = 0;
    const handle = window.setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        window.clearInterval(handle);
      } else {
        setCount(current);
      }
    }, 16);

    return () => window.clearInterval(handle);
  }, [value, step]);

  return <span className="font-semibold text-3xl text-white">{count}</span>;
}
