import React from 'react';
import { Radio } from 'lucide-react';

export interface LoadingSpinnerProps {
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Loading telematics data...',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-content-dominant ${className}`}>
      <div
        className={`${sizeMap} rounded-2xl bg-primary-subtle border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-xs`}
      >
        <Radio className={`${iconSize} animate-pulse`} />
      </div>
      {label && (
        <div className="text-xs font-semibold text-content-muted tracking-wide">
          {label}
        </div>
      )}
    </div>
  );
};
