import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  iconBgClass?: string;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgClass = 'bg-primary-subtle text-primary',
  badge,
}) => {
  return (
    <div className="bg-canvas-card border border-border-subtle rounded-card p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-content-muted uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {badge}
            </span>
          )}
          <div className={`w-8 h-8 rounded-control flex items-center justify-center ${iconBgClass}`}>
            {icon}
          </div>
        </div>
      </div>
      <div className="text-3xl font-bold text-content-dominant tracking-tight mb-2">
        {value}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 text-xs text-content-muted">
          {trend && (
            <span
              className={`font-semibold ${
                trend.positive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
