import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'orange';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    success: {
      container: 'bg-green-50 text-green-700 border-green-200',
      dot: 'bg-green-600',
    },
    warning: {
      container: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500',
    },
    danger: {
      container: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-600',
    },
    info: {
      container: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    orange: {
      container: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
    },
    neutral: {
      container: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
  };

  const style = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${sizeStyles} ${style.container} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      <span>{children}</span>
    </span>
  );
};
