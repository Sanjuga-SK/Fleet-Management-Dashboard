import React from 'react';
import { AlertSeverity } from '@/types/fleet';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SeverityBadgeProps {
  severity: AlertSeverity;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, className = '' }) => {
  switch (severity) {
    case 'critical':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200 ${className}`}
        >
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          Critical
        </span>
      );
    case 'warning':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 ${className}`}
        >
          <AlertCircle className="w-3 h-3 text-orange" />
          Warning
        </span>
      );
    case 'info':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
        >
          <Info className="w-3 h-3 text-slate-500" />
          Info
        </span>
      );
  }
};
