export type VehicleType = 'truck' | 'van' | 'electric_delivery' | 'semi' | 'pickup';
export type VehicleStatus = 'in_transit' | 'idle' | 'maintenance' | 'offline';

export interface Vehicle {
  id: string;
  plate_number: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  status: VehicleStatus;
  battery_fuel_pct: number;
  speed_kmh: number;
  heading_degrees: number;
  odometer_km: number;
  driver_name?: string;
  driver_phone?: string;
  latitude: number;
  longitude: number;
  last_telemetry_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleLocation {
  id: string;
  vehicle_id: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  battery_fuel_pct: number;
  timestamp: string;
}

export type VehicleFormData = Omit<Vehicle, 'id' | 'created_at' | 'updated_at' | 'last_telemetry_at'>;
