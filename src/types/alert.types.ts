import { Vehicle } from './vehicle.types';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertCategory =
  | 'speeding'
  | 'geofence'
  | 'engine_temp'
  | 'low_fuel'
  | 'harsh_braking'
  | 'maintenance'
  | 'connectivity';

export type AlertStatus = 'open' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  vehicle_id?: string;
  severity: AlertSeverity;
  category: AlertCategory;
  message: string;
  status: AlertStatus;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  created_at: string;
  vehicle?: Vehicle;
}
