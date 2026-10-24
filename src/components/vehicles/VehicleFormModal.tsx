import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui';
import { Vehicle, VehicleStatus, VehicleType } from '@/types/fleet';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vehicle: Omit<Vehicle, 'id' | 'last_telemetry_at'>) => Promise<void>;
  initialData?: Vehicle | null;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [plateNumber, setPlateNumber] = useState('');
  const [vin, setVin] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState<VehicleType>('truck');
  const [status, setStatus] = useState<VehicleStatus>('idle');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [batteryFuelPct, setBatteryFuelPct] = useState(100);
  const [odometerKm, setOdometerKm] = useState(0);
  const [latitude, setLatitude] = useState(12.9716);
  const [longitude, setLongitude] = useState(77.5946);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setPlateNumber(initialData.plate_number);
      setVin(initialData.vin);
      setMake(initialData.make);
      setModel(initialData.model);
      setYear(initialData.year);
      setType(initialData.type);
      setStatus(initialData.status);
      setDriverName(initialData.driver_name || '');
      setDriverPhone(initialData.driver_phone || '');
      setBatteryFuelPct(initialData.battery_fuel_pct);
      setOdometerKm(initialData.odometer_km);
      setLatitude(initialData.latitude);
      setLongitude(initialData.longitude);
    } else {
      setPlateNumber('');
      setVin('');
      setMake('');
      setModel('');
      setYear(new Date().getFullYear());
      setType('truck');
      setStatus('idle');
      setDriverName('');
      setDriverPhone('');
      setBatteryFuelPct(100);
      setOdometerKm(0);
      setLatitude(12.9716);
      setLongitude(77.5946);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber.trim() || !vin.trim() || !make.trim() || !model.trim()) {
      setError('Please fill in all required fields (Plate, VIN, Make, Model).');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        plate_number: plateNumber.trim().toUpperCase(),
        vin: vin.trim().toUpperCase(),
        make: make.trim(),
        model: model.trim(),
        year: Number(year),
        type,
        status,
        battery_fuel_pct: Number(batteryFuelPct),
        speed_kmh: initialData?.speed_kmh || 0,
        heading_degrees: initialData?.heading_degrees || 0,
        odometer_km: Number(odometerKm),
        driver_name: driverName.trim() || undefined,
        driver_phone: driverPhone.trim() || undefined,
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save vehicle');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit Vehicle: ${initialData.plate_number}` : 'Register New Vehicle'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-control">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Registration Plate *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. KA-01-AB-1234"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              VIN (Chassis Number) *
            </label>
            <input
              type="text"
              required
              placeholder="17-character VIN"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Make / Manufacturer *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tata, Mahindra"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Model *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ace EV, Bolero"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Vehicle Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as VehicleType)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="truck">Truck</option>
              <option value="van">Van</option>
              <option value="electric_delivery">Electric Delivery (EV)</option>
              <option value="semi">Semi Trailer</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Operational Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as VehicleStatus)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            >
              <option value="idle">Idle / Available</option>
              <option value="in_transit">In Transit (Active)</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Assigned Driver Name
            </label>
            <input
              type="text"
              placeholder="Driver's full name"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Driver Contact Phone
            </label>
            <input
              type="text"
              placeholder="+91 98450 00000"
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value)}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Battery / Fuel Level (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={batteryFuelPct}
              onChange={(e) => setBatteryFuelPct(Number(e.target.value))}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-dominant mb-1">
              Current Odometer (km)
            </label>
            <input
              type="number"
              min="0"
              value={odometerKm}
              onChange={(e) => setOdometerKm(Number(e.target.value))}
              className="w-full px-3 py-2 bg-canvas-bg border border-border-subtle rounded-control text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-subtle">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={submitting}
          >
            {initialData ? 'Update Record' : 'Register Vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
