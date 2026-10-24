import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Truck,
  Route,
  AlertTriangle,
  LogOut,
  Radio,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  onCloseMobile?: () => void;
  openAlertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile, openAlertsCount = 0 }) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Fleet Map', path: '/map', icon: MapPin },
    { name: 'Vehicles', path: '/vehicles', icon: Truck },
    { name: 'Trip History', path: '/trips', icon: Route },
    {
      name: 'Alerts & Health',
      path: '/alerts',
      icon: AlertTriangle,
      badge: openAlertsCount > 0 ? openAlertsCount : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col h-screen select-none shadow-sm flex-shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm font-bold tracking-wider text-base">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              BYTEBEAM
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Operations Center</div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-control text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.name}</span>
            </div>

          </NavLink>
        ))}
      </nav>

      {/* Sign Out Action Footer */}
      <div className="p-3 border-t border-slate-200 bg-white flex-shrink-0">
        <button
          onClick={handleSignOut}
          className="w-full flex  gap-2 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 bordertransition-colors"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
