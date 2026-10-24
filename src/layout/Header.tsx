import React from 'react';
import { Menu, Search, Activity } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  openAlertsCount?: number;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  searchQuery = '',
  onSearchChange,
}) => {
  const { user, isDemoSession } = useAuth();

  return (
    <header className="h-16 flex-shrink-0 bg-canvas-card border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between z-20">
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-control text-content-supportive hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Filter / Search */}
        {onSearchChange ? (
          <div className="relative w-full">
            <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search vehicle plate, VIN, driver..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-canvas-bg border border-border-subtle rounded-control text-xs text-content-dominant placeholder:text-content-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans"
            />
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 text-xs text-content-muted">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-medium text-content-supportive">Telemetry Pipeline Active</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">


        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-1">
         
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-content-dominant truncate max-w-[160px]">
              {user?.full_name || 'Fleet Operator'}
            </div>
            <div className="text-[10px] text-content-muted font-medium flex items-center gap-1.5">
              {user?.email && (
                <>
                  <span className="truncate max-w-[140px] text-slate-500">{user.email}</span>
                </>
              )}
            </div>
            
          </div>
           <div className="w-8 h-8 rounded-full bg-green-50 text-primary border border-green-200 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
