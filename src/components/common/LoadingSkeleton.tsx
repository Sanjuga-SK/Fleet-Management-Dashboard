import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="bg-canvas-card border border-border-subtle rounded-card p-5 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-3 bg-slate-200 rounded w-24"></div>
      <div className="h-8 w-8 bg-slate-200 rounded-control"></div>
    </div>
    <div className="h-8 bg-slate-200 rounded w-16 mb-3"></div>
    <div className="h-3 bg-slate-200 rounded w-32"></div>
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="w-full bg-canvas-card border border-border-subtle rounded-card overflow-hidden animate-pulse">
    <div className="bg-slate-50 border-b border-border-subtle p-3 flex gap-4">
      <div className="h-4 bg-slate-200 rounded w-28"></div>
      <div className="h-4 bg-slate-200 rounded w-20"></div>
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-4 bg-slate-200 rounded w-32"></div>
      <div className="h-4 bg-slate-200 rounded w-16"></div>
    </div>
    <div className="divide-y divide-border-subtle">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex gap-4 items-center">
          <div className="h-4 bg-slate-200 rounded w-28"></div>
          <div className="h-5 bg-slate-200 rounded-full w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

export const MapSkeleton: React.FC = () => (
  <div className="w-full h-full min-h-[360px] bg-slate-100 rounded-card border border-border-subtle flex flex-col items-center justify-center animate-pulse p-6">
    <div className="w-12 h-12 rounded-full bg-slate-200 mb-3"></div>
    <div className="h-4 bg-slate-200 rounded w-36 mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-56"></div>
  </div>
);
