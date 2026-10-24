import React, { useEffect, useState } from 'react';
import { fleetService } from '@/services/fleetService';
import { Vehicle } from '@/types/fleet';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { Button, SearchInput, EmptyState } from '@/components/ui';
import { VehicleFormModal } from '@/components/vehicles/VehicleFormModal';
import { VehicleDetailModal } from '@/components/vehicles/VehicleDetailModal';
import {
  Truck,
  Plus,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  Gauge,
} from 'lucide-react';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'plate' | 'speed' | 'battery' | 'odometer'>('plate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [inspectVehicle, setInspectVehicle] = useState<Vehicle | null>(null);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const data = await fleetService.getVehicles(search, statusFilter);
      setVehicles(data);
    } catch (e) {
      console.error('Failed to load vehicles', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadVehicles();
  };

  const handleCreateOrUpdate = async (payload: Omit<Vehicle, 'id' | 'last_telemetry_at'>) => {
    if (editingVehicle) {
      await fleetService.updateVehicle(editingVehicle.id, payload);
    } else {
      await fleetService.createVehicle(payload);
    }
    await loadVehicles();
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to decommission and delete vehicle ${vehicle.plate_number}?`)) {
      await fleetService.deleteVehicle(vehicle.id);
      await loadVehicles();
    }
  };

  // Filter & sort in memory
  const processedVehicles = vehicles
    .filter((v) => typeFilter === 'all' || v.type === typeFilter)
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'plate') comparison = a.plate_number.localeCompare(b.plate_number);
      if (sortBy === 'speed') comparison = a.speed_kmh - b.speed_kmh;
      if (sortBy === 'battery') comparison = a.battery_fuel_pct - b.battery_fuel_pct;
      if (sortBy === 'odometer') comparison = a.odometer_km - b.odometer_km;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="space-y-6">
      {/* Page Title & Register Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-dominant tracking-tight">
            Vehicle Fleet Registry
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
            Manage assets, assign operators, audit diagnostic readings, and track fleet availability.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingVehicle(null);
            setFormModalOpen(true);
          }}
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          Register Vehicle
        </Button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-canvas-card border border-border-subtle rounded-card p-4 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80">
          <SearchInput
            placeholder="Search plate number, driver, VIN..."
            value={search}
            onChange={(val) => setSearch(val)}
            onClear={() => {
              setSearch('');
              loadVehicles();
            }}
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-control text-xs">
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

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-canvas-bg border border-border-subtle rounded-control text-xs text-content-dominant focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="electric_delivery">Electric Delivery</option>
            <option value="semi">Semi</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-canvas-bg border border-border-subtle rounded-control text-xs text-content-dominant focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="plate">Sort by Plate</option>
            <option value="speed">Sort by Speed</option>
            <option value="battery">Sort by Battery</option>
            <option value="odometer">Sort by Odometer</option>
          </select>
        </div>
      </div>

      {/* Main Vehicles Data Table */}
      <div className="bg-canvas-card border border-border-subtle rounded-card overflow-hidden shadow-card">
        {loading ? (
          <TableSkeleton rows={6} />
        ) : processedVehicles.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="No vehicles found"
            description="No vehicles matched your filter parameters. Try clearing your filters or register a new vehicle."
            actionText="Register Vehicle"
            onAction={() => {
              setEditingVehicle(null);
              setFormModalOpen(true);
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border-subtle text-content-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold sticky left-0 bg-slate-50 z-10 shadow-[1px_0_0_0_#E2E8F0]">
                    Registration Plate
                  </th>
                  <th className="py-3 px-4 font-semibold">Make & Model</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Assigned Driver</th>
                  <th className="py-3 px-4 font-semibold">Speed</th>
                  <th className="py-3 px-4 font-semibold">Fuel / SoC</th>
                  <th className="py-3 px-4 font-semibold">Odometer</th>
                  <th className="py-3 px-4 font-semibold">Last Ping</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {processedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Sticky Column: Plate Number */}
                    <td className="py-3 px-4 font-mono font-bold text-content-dominant text-sm sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[1px_0_0_0_#E2E8F0]">
                      <button
                        onClick={() => setInspectVehicle(vehicle)}
                        className="hover:text-primary transition-colors hover:underline text-left"
                      >
                        {vehicle.plate_number}
                      </button>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-content-dominant">
                        {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-[10px] text-content-muted capitalize">
                        {vehicle.year} • {vehicle.type.replace('_', ' ')}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={vehicle.status} />
                    </td>

                    <td className="py-3 px-4 font-medium text-content-dominant">
                      {vehicle.driver_name || (
                        <span className="text-content-muted italic">Unassigned</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-content-dominant">
                      <span className="inline-flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-primary" />
                        {vehicle.speed_kmh} km/h
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              vehicle.battery_fuel_pct > 50
                                ? 'bg-primary'
                                : vehicle.battery_fuel_pct > 25
                                ? 'bg-orange'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${vehicle.battery_fuel_pct}%` }}
                          />
                        </div>
                        <span>{vehicle.battery_fuel_pct}%</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-content-dominant">
                      {vehicle.odometer_km.toLocaleString()} km
                    </td>

                    <td className="py-3 px-4 text-content-muted text-[11px]">
                      {new Date(vehicle.last_telemetry_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setInspectVehicle(vehicle)}
                          className="p-1.5 text-content-muted hover:text-primary hover:bg-slate-100 rounded transition-colors"
                          title="Inspect details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(vehicle)}
                          className="p-1.5 text-content-muted hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                          title="Delete vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicle Form Modal (Create / Edit) */}
      <VehicleFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingVehicle}
      />

      {/* Vehicle Diagnostic Inspector Modal */}
      <VehicleDetailModal
        vehicle={inspectVehicle}
        isOpen={Boolean(inspectVehicle)}
        onClose={() => setInspectVehicle(null)}
        onEdit={(v) => {
          setInspectVehicle(null);
          setEditingVehicle(v);
          setFormModalOpen(true);
        }}
      />
    </div>
  );
};
