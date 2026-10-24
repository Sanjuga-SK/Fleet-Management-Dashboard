import React, { useEffect, useState } from 'react';
import { fleetService } from '@/services/fleetService';
import { Trip, Vehicle } from '@/types/fleet';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState, Button } from '@/components/ui';
import { TripRouteModal } from '@/components/trips/TripRouteModal';
import { Route, Layers } from 'lucide-react';

export const TripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const loadTrips = async () => {
    try {
      setLoading(true);
      const [t, v] = await Promise.all([
        fleetService.getTrips(statusFilter, vehicleFilter),
        fleetService.getVehicles(),
      ]);
      setTrips(t);
      setVehicles(v);
    } catch (e) {
      console.error('Failed to load trips', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [statusFilter, vehicleFilter]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-dominant tracking-tight">
            Trip History & Route Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
            Audit historical journey breadcrumbs, evaluate route durations, and replay trip waypoints.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-canvas-card border border-border-subtle rounded-card p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-control text-xs">
            {(['all', 'in_progress', 'completed', 'delayed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded text-xs transition-colors capitalize ${
                  statusFilter === status
                    ? 'bg-white text-content-dominant shadow-sm font-semibold'
                    : 'text-content-muted hover:text-content-dominant'
                }`}
              >
                {status === 'all' ? 'All Trips' : status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Vehicle Filter Dropdown */}
          <select
            value={vehicleFilter}
            onChange={(e) => setVehicleFilter(e.target.value)}
            className="px-3 py-1.5 bg-canvas-bg border border-border-subtle rounded-control text-xs text-content-dominant focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate_number} ({v.make} {v.model})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-content-muted">
          Showing <span className="font-bold text-content-dominant">{trips.length}</span> trips
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-canvas-card border border-border-subtle rounded-card overflow-hidden shadow-card">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : trips.length === 0 ? (
          <EmptyState
            icon={Route}
            title="No trips recorded"
            description="No trips match your selected status and vehicle filter criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border-subtle text-content-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Vehicle & Driver</th>
                  <th className="py-3 px-4 font-semibold">Origin & Destination</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Start Time</th>
                  <th className="py-3 px-4 font-semibold">End Time</th>
                  <th className="py-3 px-4 font-semibold">Distance</th>
                  <th className="py-3 px-4 font-semibold">Avg / Max Speed</th>
                  <th className="py-3 px-4 font-semibold text-right">Route Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-content-dominant">
                        {trip.vehicle?.plate_number || 'N/A'}
                      </div>
                      <div className="text-[11px] text-content-muted">{trip.driver_name}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-content-dominant font-medium truncate">
                        {trip.origin}
                      </div>
                      <div className="text-content-muted text-[11px] truncate flex items-center gap-1">
                        <span className="text-slate-300">↳</span> {trip.destination}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          trip.status === 'in_progress'
                            ? 'bg-orange-50 text-orange-700 border border-orange-200'
                            : trip.status === 'completed'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {trip.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-content-dominant font-mono">
                      {new Date(trip.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4 text-content-muted font-mono">
                      {trip.end_time
                        ? new Date(trip.end_time).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-content-dominant">
                      {trip.distance_km} km
                    </td>

                    <td className="py-3 px-4 font-mono text-content-supportive">
                      {trip.avg_speed_kmh} / {trip.max_speed_kmh} km/h
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTrip(trip)}
                        icon={<Layers className="w-3.5 h-3.5 text-primary" />}
                      >
                        Plot Route
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trip Route Map Modal */}
      <TripRouteModal
        trip={selectedTrip}
        isOpen={Boolean(selectedTrip)}
        onClose={() => setSelectedTrip(null)}
      />
    </div>
  );
};
