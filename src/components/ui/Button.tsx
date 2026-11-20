import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-[5px] transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.99]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-semibold tracking-wide',
    md: 'px-4 py-2 text-xs font-semibold tracking-wide',
    lg: 'px-5 py-2.5 text-sm font-semibold tracking-wide',
  };

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]',
    secondary:
      'bg-[#161a22] hover:bg-[#1d232e] text-slate-200 border border-[#2b3345] shadow-[0_1px_2px_rgba(0,0,0,0.3)]',
    danger:
      'bg-rose-700 hover:bg-rose-600 text-white border border-rose-500/40 shadow-[0_1px_2px_rgba(0,0,0,0.4)]',
    outline:
      'border border-[#2d3546] hover:border-[#414d64] text-slate-300 hover:text-white bg-[#0e1117] hover:bg-[#141821]',
    ghost:
      'text-slate-400 hover:text-white hover:bg-[#161a22] border border-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
