'use client';

import * as React from 'react';
import { Toaster as HotToast, toast, type ToastBar } from 'react-hot-toast';

export const toaster = toast;

export function Toaster() {
  return (
    <HotToast
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#f8fafc',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1rem',
        },
      }}
      gutter={12}
      containerStyle={{
        padding: '1rem',
      }}
    />
  );
}
