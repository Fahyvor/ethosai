declare module 'sleek-toast' {
  import React from 'react';

  export interface ToastAPI {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  }

  export interface SleekToastProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }

  export const toast: ToastAPI;
  export const SleekToast: React.FC<SleekToastProps>;
  export default SleekToast;
}
