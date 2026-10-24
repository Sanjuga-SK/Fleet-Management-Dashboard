import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-control transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs gap-1.5',
    md: 'py-2 px-4 text-xs gap-2',
    lg: 'py-2.5 px-5 text-sm gap-2',
  }[size];

  const variantStyles = {
    primary:
      'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-xs border border-transparent',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 focus:ring-slate-400',
    outline:
      'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 focus:ring-slate-400 shadow-xs',
    danger:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 focus:ring-rose-500',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent focus:ring-slate-300',
    orange:
      'bg-orange text-white hover:bg-orange-600 focus:ring-orange shadow-xs border border-transparent',
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
