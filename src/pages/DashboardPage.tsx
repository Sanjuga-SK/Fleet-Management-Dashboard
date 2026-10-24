import React, { useEffect, useState } from 'react';
import {
  Truck,
  Navigation,
  Clock,
  AlertTriangle,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fleetService } from '@/services/fleetService';
import { FleetMetrics, Vehicle, Trip, Alert } from '@/types/fleet';
import { MetricCard } from '@/components/common/MetricCard';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { CardSkeleton, TableSkeleton } from '@/components/common/LoadingSkeleton';
import { FleetMap } from '@/components/map/FleetMap';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<FleetMetrics | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const loadDashboardData = async () => {
    try {
      const [m, v, t, a] = await Promise.all([
        fleetService.getFleetMetrics(),
        fleetService.getVehicles(),
        fleetService.getTrips(),
        fleetService.getAlerts(),
      ]);
      setMetrics(m);
      setVehicles(v);
      setTrips(t.slice(0, 5));
      setAlerts(a.filter((item) => item.status !== 'resolved').slice(0, 5));
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton rows={4} />
      </div>
    );
  }

  // Chart data for vehicle statuses
  const statusChartData = [
    { name: 'In Transit', value: metrics.activeEnRoute, color: '#15803D' },
    { name: 'Idle', value: vehicles.filter((v) => v.status === 'idle').length, color: '#F97316' },
    { name: 'Maintenance', value: metrics.inMaintenance, color: '#D97706' },
    { name: 'Offline', value: metrics.offline, color: '#64748B' },
  ].filter((d) => d.value > 0);

  // Speed telemetry distribution
  const speedDistributionData = vehicles.map((v) => ({
    name: v.plate_number.replace('KA-', '').replace('MH-', '').replace('DL-', ''),
    speed: v.speed_kmh,
    battery: v.battery_fuel_pct,
  }));

  return (
    <div className="space-y-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-dominant tracking-tight">
            Fleet Command Center
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
            Real-time telematics dispatch, live vehicle tracking, and active exception monitoring.
          </p>
        </div>

      </div>

      {/* 4 Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Fleet"
          value={metrics.totalVehicles}
          trend={{ value: '100% active fleet', positive: true }}
          icon={<Truck className="w-4 h-4" />}
          iconBgClass="bg-green-50 text-primary border border-green-200"
        />
        <MetricCard
          title="Active En Route"
          value={metrics.activeEnRoute}
          trend={{ value: `+${metrics.activeTrips} active trips`, positive: true }}
          icon={<Navigation className="w-4 h-4" />}
          iconBgClass="bg-green-100 text-green-800 border border-green-200"
        />
        <MetricCard
          title="Idle / Offline"
          value={metrics.idleOrUnavailable}
          trend={{ value: 'Available for dispatch', positive: false }}
          icon={<Clock className="w-4 h-4" />}
          iconBgClass="bg-orange-50 text-orange border border-orange-200"
        />
        <MetricCard
          title="Open Alerts"
          value={metrics.openAlerts}
          trend={{
            value: metrics.criticalAlerts > 0 ? 'Action required' : 'All nominal',
            positive: metrics.criticalAlerts === 0,
          }}
          icon={<AlertTriangle className="w-4 h-4" />}
          iconBgClass="bg-rose-50 text-rose-700 border border-rose-200"
        />
      </div>

      {/* Split Telemetry View: Map (60%) + Real-time Alert Triage (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-8 bg-canvas-card border border-border-subtle rounded-card p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-content-dominant">
                Active GIS Fleet Telemetry
              </h2>
              <p className="text-xs text-content-muted mt-0.5">
                Real-time simulated GPS positions on OpenStreetMap layer.
              </p>
            </div>
          </div>

          <div className="flex-1 min-h-[380px]">
            <FleetMap
              vehicles={vehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={setSelectedVehicle}
              height="380px"
            />
          </div>
        </div>

        {/* Live Alerts & Triage Drawer */}
        <div className="lg:col-span-4 bg-canvas-card border border-border-subtle rounded-card p-5 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-content-dominant flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Active Alerts
              </h2>
              <p className="text-xs text-content-muted mt-0.5">
                {alerts.length} operational exceptions unhandled
              </p>
            </div>
            <Link
              to="/alerts"
              className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px]">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-xs text-content-muted">
                No active operational alerts. Fleet is operating within normal parameters.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-control border border-border-subtle bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <SeverityBadge severity={alert.severity} />
                    <span className="text-[11px] font-mono text-content-muted">
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-content-dominant line-clamp-2">
                    {alert.message}
                  </p>
                  {alert.vehicle && (
                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-content-muted">
                      <span className="font-mono font-semibold">{alert.vehicle.plate_number}</span>
                      <span>{alert.vehicle.driver_name}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Analytics Charts & Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution Donut */}
        <div className="lg:col-span-5 bg-canvas-card border border-border-subtle rounded-card p-5 shadow-card">
          <h2 className="text-base font-semibold text-content-dominant mb-1">
            Fleet Status Distribution
          </h2>
          <p className="text-xs text-content-muted mb-4">
            Live operational classification of vehicle assets.
          </p>

          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} Vehicles`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-2xl font-bold text-content-dominant">{metrics.totalVehicles}</span>
              <div className="text-[10px] text-content-muted uppercase">Total Fleet</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border-subtle">
            {statusChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-content-muted">{item.name}:</span>
                <span className="font-bold text-content-dominant">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Speed & Battery Telemetry Chart */}
        <div className="lg:col-span-7 bg-canvas-card border border-border-subtle rounded-card p-5 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-content-dominant">
              Vehicle Speed & Battery Telemetry
            </h2>
            <div className="flex items-center gap-3 text-xs text-content-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-orange inline-block" /> Speed (km/h)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-primary inline-block" /> Battery (%)
              </span>
            </div>
          </div>
          <p className="text-xs text-content-muted mb-4">
            Live velocity telemetry vs remaining energy reserves.
          </p>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={speedDistributionData} barGap={4}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    borderColor: '#E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="speed" fill="#F97316" radius={[4, 4, 0, 0]} name="Speed (km/h)" />
                <Bar dataKey="battery" fill="#15803D" radius={[4, 4, 0, 0]} name="Battery / Fuel (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="bg-canvas-card border border-border-subtle rounded-card p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-content-dominant">Recent Fleet Trips</h2>
            <p className="text-xs text-content-muted mt-0.5">
              Current and completed dispatch runs with route checkpoints.
            </p>
          </div>
          <Link
            to="/trips"
            className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1"
          >
            All trips <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-slate-50/70 text-content-muted uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Vehicle</th>
                <th className="py-2.5 px-3 font-semibold">Driver</th>
                <th className="py-2.5 px-3 font-semibold">Origin & Destination</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Distance</th>
                <th className="py-2.5 px-3 font-semibold">Avg Speed</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-content-dominant">
                    {trip.vehicle?.plate_number || 'N/A'}
                  </td>
                  <td className="py-3 px-3 text-content-supportive font-medium">
                    {trip.driver_name}
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-content-dominant font-medium truncate max-w-xs">
                      {trip.origin} → {trip.destination}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        trip.status === 'in_progress'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {trip.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-content-dominant">
                    {trip.distance_km} km
                  </td>
                  <td className="py-3 px-3 font-mono text-content-supportive">
                    {trip.avg_speed_kmh} km/h
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to="/trips"
                      className="text-primary hover:text-primary-hover font-semibold text-xs"
                    >
                      View Map
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
