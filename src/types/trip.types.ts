import { Vehicle } from './vehicle.types';

export type TripStatus = 'in_progress' | 'completed' | 'delayed' | 'cancelled';

export type RouteCoordinate = [number, number];

export interface Trip {
  id: string;
  vehicle_id: string;
  driver_name: string;
  origin: string;
  destination: string;
  start_time: string;
  end_time?: string | null;
  distance_km: number;
  avg_speed_kmh: number;
  max_speed_kmh: number;
  status: TripStatus;
  route_coordinates: RouteCoordinate[];
  vehicle?: Vehicle;
}
