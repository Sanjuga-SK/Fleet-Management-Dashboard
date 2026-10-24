import React, { useEffect, useState } from 'react';
import { FleetMap } from '@/components/map/FleetMap';
import { fleetService } from '@/services/fleetService';
import { Vehicle, Trip, VehicleLocation } from '@/types/fleet';
import { StatusBadge } from '@/components/common/StatusBadge';
import { MapSkeleton } from '@/components/common/LoadingSkeleton';
import {
  Search,
  RotateCcw,
} from 'lucide-react';

export const FleetMapPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<VehicleLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const loadData = async () => {
    try {
      const [v, t] = await Promise.all([
        fleetService.getVehicles(),
        fleetService.getTrips(),
      ]);
      setVehicles(v);
      setTrips(t);
    } catch (e) {
      console.error('Failed to load map data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch telemetry breadcrumb history from vehicle_locations when a vehicle is selected
  useEffect(() => {
    if (selectedVehicle) {
      fleetService
        .getVehicleLocations(selectedVehicle.id)
        .then(setBreadcrumbs)
        .catch(() => setBreadcrumbs([]));
    } else {
      setBreadcrumbs([]);
    }
  }, [selectedVehicle]);

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      v.plate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.driver_name && v.driver_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesType && matchesSearch;
  });

  // Find active trip for selected vehicle
  const activeTripForSelected = selectedVehicle
    ? trips.find((t) => t.vehicle_id === selectedVehicle.id && t.status === 'in_progress')
    : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div>
            <h1 className="text-2xl font-bold text-content-dominant tracking-tight">
              Live Fleet GIS Map
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
            Geographic telematics overview synchronized with Supabase telemetry pings.
          </p>
        </div>

        {/* Quick summary chips */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-800 font-semibold border border-green-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {vehicles.filter((v) => v.status === 'in_transit').length} Moving
          </span>
          <span className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 font-semibold border border-orange-200">
            {vehicles.filter((v) => v.status === 'idle').length} Idle
          </span>
          <button
            onClick={() => {
              setSelectedVehicle(null);
              setStatusFilter('all');
              setTypeFilter('all');
              setSearchQuery('');
            }}
            className="p-1.5 rounded-control text-content-muted hover:text-content-dominant hover:bg-slate-100"
            title="Reset filters"
          >
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-canvas-card border border-border-subtle rounded-card p-3 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by plate, driver, or VIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-canvas-bg border border-border-subtle rounded-control text-xs text-content-dominant focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status filter pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-control text-xs font-medium">
            {(['all', 'in_transit', 'idle', 'maintenance', 'offline'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded text-xs transition-colors capitalize ${
                  statusFilter === status
                    ? 'bg-white text-content-dominant shadow-sm font-semibold'
                    : 'text-content-muted hover:text-content-dominant'
                }`}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Type filter dropdown */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-canvas-bg border border-border-subtle rounded-control text-xs text-content-dominant focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Vehicle Types</option>
            <option value="truck">Trucks</option>
            <option value="van">Vans</option>
            <option value="electric_delivery">Electric Delivery</option>
            <option value="semi">Semis</option>
          </select>
        </div>
      </div>

      {/* Map & Vehicle Inspector Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Map Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-canvas-card border border-border-subtle rounded-card overflow-hidden shadow-card relative min-h-[550px]">
          {loading ? (
            <MapSkeleton />
          ) : (
            <FleetMap
              vehicles={filteredVehicles}
              selectedVehicle={selectedVehicle}
              onSelectVehicle={setSelectedVehicle}
              selectedTrip={activeTripForSelected}
              breadcrumbs={breadcrumbs}
              height="580px"
            />
          )}
        </div>

        {/* Vehicle Telematics Sidebar List (4 cols) */}
        <div className="lg:col-span-4 bg-canvas-card border border-border-subtle rounded-card p-4 shadow-card flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
            <div>
              <h2 className="text-sm font-bold text-content-dominant">
                Vehicles on Map ({filteredVehicles.length})
              </h2>
              <p className="text-[11px] text-content-muted">
                Click a vehicle to center map and inspect route
              </p>
            </div>
            {selectedVehicle && (
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredVehicles.length === 0 ? (
              <div className="p-8 text-center text-xs text-content-muted">
                No vehicles match current filters.
              </div>
            ) : (
              filteredVehicles.map((vehicle) => {
                const isSelected = selectedVehicle?.id === vehicle.id;
                return (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`p-3 rounded-control border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange bg-orange-50 shadow-sm ring-1 ring-orange/30'
                        : 'border-border-subtle hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-content-dominant text-sm">
                        {vehicle.plate_number}
                      </span>
                      <StatusBadge status={vehicle.status} showIcon={false} />
                    </div>

                    <div className="text-content-muted flex items-center justify-between mb-2 text-[11px]">
                      <span>{vehicle.make} {vehicle.model}</span>
                      <span className="capitalize">{vehicle.type.replace('_', ' ')}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 text-[11px]">
                      <div>
                        <div className="text-content-muted text-[10px]">Speed</div>
                        <div className="font-mono font-semibold text-content-dominant">
                          {vehicle.speed_kmh} km/h
                        </div>
                      </div>
                      <div>
                        <div className="text-content-muted text-[10px]">Battery/Fuel</div>
                        <div className="font-mono font-semibold text-content-dominant">
                          {vehicle.battery_fuel_pct}%
                        </div>
                      </div>
                      <div>
                        <div className="text-content-muted text-[10px]">Driver</div>
                        <div className="font-medium text-content-dominant truncate">
                          {vehicle.driver_name?.split(' ')[0] || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
