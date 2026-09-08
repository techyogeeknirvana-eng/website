'use client';

import { useState, useCallback } from 'react';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const toast = useCallback(({ title, description, variant }: ToastOptions) => {
    if (typeof window !== 'undefined') {
      if (variant === 'destructive') {
        console.error(`[TYGN Toast Error] ${title}: ${description || ''}`);
      } else {
        console.log(`[TYGN Toast] ${title}: ${description || ''}`);
      }
    }
  }, []);

  return { toast };
}
