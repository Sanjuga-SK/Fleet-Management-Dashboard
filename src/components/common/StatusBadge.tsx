import React from 'react';
import { VehicleStatus } from '@/types/fleet';
import { Navigation, Pause, Wrench, WifiOff } from 'lucide-react';

interface StatusBadgeProps {
  status: VehicleStatus;
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showIcon = true, className = '' }) => {
  switch (status) {
    case 'in_transit':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-800 border border-green-200 ${className}`}
        >
          {showIcon ? (
            <Navigation className="w-3 h-3 text-primary animate-pulse" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
          In Transit
        </span>
      );
    case 'idle':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 ${className}`}
        >
          {showIcon ? (
            <Pause className="w-3 h-3 text-orange" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-orange" />
          )}
          Idle
        </span>
      );
    case 'maintenance':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
        >
          {showIcon ? (
            <Wrench className="w-3 h-3 text-amber-600" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          )}
          Maintenance
        </span>
      );
    case 'offline':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
        >
          {showIcon ? (
            <WifiOff className="w-3 h-3 text-slate-500" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          )}
          Offline
        </span>
      );
  }
};
