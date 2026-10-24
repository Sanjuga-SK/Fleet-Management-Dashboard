import React from 'react';
import { Modal } from '@/components/ui';
import { Vehicle } from '@/types/fleet';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Truck,
  User,
  Phone,
  Gauge,
  BatteryCharging,
  Compass,
  MapPin,
  Calendar,
  Hash,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!vehicle) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Vehicle Diagnostics: ${vehicle.plate_number}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-card bg-slate-50 border border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-card bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-content-dominant">
                  {vehicle.plate_number}
                </span>
                <StatusBadge status={vehicle.status} />
              </div>
              <div className="text-xs text-content-muted mt-0.5">
                {vehicle.year} {vehicle.make} {vehicle.model} •{' '}
                <span className="capitalize">{vehicle.type.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="px-3.5 py-1.5 bg-white border border-border-subtle rounded-control text-xs font-semibold text-content-dominant hover:bg-slate-100 transition-colors"
            >
              Edit Details
            </button>
            <Link
              to={`/map`}
              onClick={onClose}
              className="px-3.5 py-1.5 bg-primary text-white rounded-control text-xs font-semibold hover:bg-primary-hover transition-colors"
            >
              Locate on Map
            </Link>
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted mb-3">
            Live Telemetry Readings
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-canvas-bg border border-border-subtle rounded-control">
              <div className="flex items-center gap-1.5 text-xs text-content-muted mb-1">
                <Gauge className="w-3.5 h-3.5 text-blue-600" /> Speed
              </div>
              <div className="text-lg font-mono font-bold text-content-dominant">
                {vehicle.speed_kmh} <span className="text-xs font-normal">km/h</span>
              </div>
            </div>

            <div className="p-3 bg-canvas-bg border border-border-subtle rounded-control">
              <div className="flex items-center gap-1.5 text-xs text-content-muted mb-1">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> Battery / Fuel
              </div>
              <div className="text-lg font-mono font-bold text-content-dominant">
                {vehicle.battery_fuel_pct}%
              </div>
            </div>

            <div className="p-3 bg-canvas-bg border border-border-subtle rounded-control">
              <div className="flex items-center gap-1.5 text-xs text-content-muted mb-1">
                <Compass className="w-3.5 h-3.5 text-amber-600" /> Heading
              </div>
              <div className="text-lg font-mono font-bold text-content-dominant">
                {vehicle.heading_degrees}°
              </div>
            </div>

            <div className="p-3 bg-canvas-bg border border-border-subtle rounded-control">
              <div className="flex items-center gap-1.5 text-xs text-content-muted mb-1">
                <Hash className="w-3.5 h-3.5 text-purple-600" /> Odometer
              </div>
              <div className="text-lg font-mono font-bold text-content-dominant">
                {vehicle.odometer_km.toLocaleString()} <span className="text-xs font-normal">km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Driver & Hardware Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white border border-border-subtle rounded-card space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Assigned Operator
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-content-muted">Driver Name:</span>
                <span className="font-semibold text-content-dominant">
                  {vehicle.driver_name || 'No driver assigned'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-content-muted">Contact Phone:</span>
                <span className="font-mono text-content-dominant flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {vehicle.driver_phone || 'Unlisted'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Status:</span>
                <span className="capitalize">{vehicle.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-border-subtle rounded-card space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-content-muted flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> GPS & Hardware Details
            </h4>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-content-muted">Chassis VIN:</span>
                <span className="font-mono font-semibold text-content-dominant">{vehicle.vin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Coordinates:</span>
                <span className="font-mono text-content-dominant">
                  {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-content-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> Last Telemetry:
                </span>
                <span className="text-content-dominant">
                  {new Date(vehicle.last_telemetry_at).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
