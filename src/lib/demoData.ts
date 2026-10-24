import { Vehicle, VehicleLocation, Trip, Alert } from '@/types/fleet';

export const INITIAL_DEMO_VEHICLES: Vehicle[] = [
  {
    id: 'd1111111-1111-4111-8111-111111111111',
    plate_number: 'KA-01-MJ-2041',
    vin: '1FT8W3BT9NED12041',
    make: 'Tata',
    model: 'Ace EV',
    year: 2024,
    type: 'electric_delivery',
    status: 'in_transit',
    battery_fuel_pct: 78,
    speed_kmh: 48.5,
    heading_degrees: 95,
    odometer_km: 14250.4,
    driver_name: 'Rajesh Kumar',
    driver_phone: '+91 98450 12345',
    latitude: 12.9716,
    longitude: 77.5946,
    last_telemetry_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 'd2222222-2222-4222-8222-222222222222',
    plate_number: 'KA-05-AB-8812',
    vin: '1M8GDM9A3KP08812',
    make: 'Mahindra',
    model: 'Bolero Maxi Truck',
    year: 2023,
    type: 'truck',
    status: 'in_transit',
    battery_fuel_pct: 62,
    speed_kmh: 54.0,
    heading_degrees: 180,
    odometer_km: 48920.8,
    driver_name: 'Suresh Gowda',
    driver_phone: '+91 98450 23456',
    latitude: 12.8399,
    longitude: 77.6770,
    last_telemetry_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    id: 'd3333333-3333-4333-8333-333333333333',
    plate_number: 'KA-04-EV-9014',
    vin: '3FA6P0SU1HR09014',
    make: 'Euler Motors',
    model: 'HiLoad EV',
    year: 2024,
    type: 'electric_delivery',
    status: 'idle',
    battery_fuel_pct: 92,
    speed_kmh: 0.0,
    heading_degrees: 0,
    odometer_km: 8310.2,
    driver_name: 'Arun Prakash',
    driver_phone: '+91 98450 34567',
    latitude: 12.9352,
    longitude: 77.6245,
    last_telemetry_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'd4444444-4444-4444-8444-444444444444',
    plate_number: 'MH-12-HQ-5120',
    vin: '1FDNE3FN8KDA5120',
    make: 'Ashok Leyland',
    model: 'Ecomet 1615',
    year: 2022,
    type: 'semi',
    status: 'in_transit',
    battery_fuel_pct: 45,
    speed_kmh: 62.0,
    heading_degrees: 310,
    odometer_km: 128450.0,
    driver_name: 'Manpreet Singh',
    driver_phone: '+91 98450 45678',
    latitude: 13.0358,
    longitude: 77.5970,
    last_telemetry_at: new Date(Date.now() - 30 * 1000).toISOString(),
  },
  {
    id: 'd5555555-5555-4555-8555-555555555555',
    plate_number: 'KA-03-NV-3349',
    vin: '2C4RDGBG6ER33490',
    make: 'Force Motors',
    model: 'Traveller Delivery',
    year: 2023,
    type: 'van',
    status: 'maintenance',
    battery_fuel_pct: 34,
    speed_kmh: 0.0,
    heading_degrees: 0,
    odometer_km: 67200.5,
    driver_name: 'Karthik Nair',
    driver_phone: '+91 98450 56789',
    latitude: 12.9141,
    longitude: 77.6100,
    last_telemetry_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'd6666666-6666-4666-8666-666666666666',
    plate_number: 'KA-51-MD-7721',
    vin: '1GNKVJKD8EJ77210',
    make: 'Tata',
    model: 'Ultra T.7',
    year: 2023,
    type: 'truck',
    status: 'in_transit',
    battery_fuel_pct: 85,
    speed_kmh: 42.0,
    heading_degrees: 45,
    odometer_km: 34180.2,
    driver_name: 'Anil Reddy',
    driver_phone: '+91 98450 67890',
    latitude: 12.9850,
    longitude: 77.7280,
    last_telemetry_at: new Date(Date.now() - 60 * 1000).toISOString(),
  },
  {
    id: 'd7777777-7777-4777-8777-777777777777',
    plate_number: 'DL-01-AX-4910',
    vin: '1FTFW1ED4MFA4910',
    make: 'Eicher',
    model: 'Pro 2049',
    year: 2022,
    type: 'truck',
    status: 'offline',
    battery_fuel_pct: 18,
    speed_kmh: 0.0,
    heading_degrees: 0,
    odometer_km: 92140.0,
    driver_name: 'Vikram Sharma',
    driver_phone: '+91 98450 78901',
    latitude: 13.1986,
    longitude: 77.7066,
    last_telemetry_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'd8888888-8888-4888-8888-888888888888',
    plate_number: 'KA-02-EL-1102',
    vin: '5TFHX5F10AX11020',
    make: 'Piaggio',
    model: 'Ape E-City',
    year: 2024,
    type: 'electric_delivery',
    status: 'idle',
    battery_fuel_pct: 41,
    speed_kmh: 0.0,
    heading_degrees: 0,
    odometer_km: 6420.0,
    driver_name: 'Deepak Verma',
    driver_phone: '+91 98450 89012',
    latitude: 12.9279,
    longitude: 77.6271,
    last_telemetry_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_DEMO_TRIPS: Trip[] = [
  {
    id: 'b1111111-1111-4111-8111-111111111111',
    vehicle_id: 'd1111111-1111-4111-8111-111111111111',
    driver_name: 'Rajesh Kumar',
    origin: 'Majestic Central Hub, Bengaluru',
    destination: 'Whitefield Tech Park, Bengaluru',
    start_time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    end_time: null,
    distance_km: 18.4,
    avg_speed_kmh: 38.2,
    max_speed_kmh: 58.0,
    status: 'in_progress',
    route_coordinates: [
      [12.9778, 77.5726],
      [12.9716, 77.5946],
      [12.9698, 77.6499],
      [12.9850, 77.7280],
    ],
  },
  {
    id: 'b2222222-2222-4222-8222-222222222222',
    vehicle_id: 'd2222222-2222-4222-8222-222222222222',
    driver_name: 'Suresh Gowda',
    origin: 'Peenya Industrial Area',
    destination: 'Electronic City Phase 1',
    start_time: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
    end_time: null,
    distance_km: 32.6,
    avg_speed_kmh: 44.0,
    max_speed_kmh: 68.5,
    status: 'in_progress',
    route_coordinates: [
      [13.0324, 77.5273],
      [12.9716, 77.5946],
      [12.9141, 77.6100],
      [12.8399, 77.6770],
    ],
  },
  {
    id: 'b3333333-3333-4333-8333-333333333333',
    vehicle_id: 'd4444444-4444-4444-8444-444444444444',
    driver_name: 'Manpreet Singh',
    origin: 'Hosur Logistics Hub',
    destination: 'Hebbal Distribution Center',
    start_time: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    end_time: null,
    distance_km: 45.8,
    avg_speed_kmh: 48.6,
    max_speed_kmh: 74.0,
    status: 'in_progress',
    route_coordinates: [
      [12.7409, 77.8253],
      [12.8399, 77.6770],
      [12.9716, 77.5946],
      [13.0358, 77.5970],
    ],
  },
  {
    id: 'b4444444-4444-4444-8444-444444444444',
    vehicle_id: 'd6666666-6666-4666-8666-666666666666',
    driver_name: 'Anil Reddy',
    origin: 'Bommasandra Industrial Area',
    destination: 'ITPL Tech Zone',
    start_time: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    distance_km: 28.5,
    avg_speed_kmh: 39.4,
    max_speed_kmh: 56.0,
    status: 'completed',
    route_coordinates: [
      [12.8163, 77.6917],
      [12.9141, 77.6100],
      [12.9850, 77.7280],
    ],
  },
];

export const INITIAL_DEMO_ALERTS: Alert[] = [
  {
    id: 'a1111111-1111-4111-8111-111111111111',
    vehicle_id: 'd5555555-5555-4555-8555-555555555555',
    severity: 'critical',
    category: 'engine_temp',
    message: 'Engine coolant temperature reached 106°C. High thermal risk on Force Traveller.',
    status: 'open',
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'a2222222-2222-4222-8222-222222222222',
    vehicle_id: 'd4444444-4444-4444-8444-444444444444',
    severity: 'critical',
    category: 'speeding',
    message: 'Speed limit violation: Recorded 74.0 km/h in urban 50 km/h logistics zone.',
    status: 'open',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: 'a3333333-3333-4333-8333-333333333333',
    vehicle_id: 'd2222222-2222-4222-8222-222222222222',
    severity: 'warning',
    category: 'harsh_braking',
    message: 'Sudden deceleration of -4.2 m/s² detected near Silk Board Junction.',
    status: 'acknowledged',
    acknowledged_by: 'Dispatcher (demo)',
    acknowledged_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
  },
  {
    id: 'a4444444-4444-4444-8444-444444444444',
    vehicle_id: 'd7777777-7777-4777-8777-777777777777',
    severity: 'warning',
    category: 'connectivity',
    message: 'Telemetry heartbeat lost for 18 consecutive hours. Device offline.',
    status: 'open',
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'a5555555-5555-4555-8555-555555555555',
    vehicle_id: 'd1111111-1111-4111-8111-111111111111',
    severity: 'info',
    category: 'geofence',
    message: 'Vehicle entered destination geofence: Whitefield Logistics Terminal.',
    status: 'resolved',
    resolved_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_DEMO_LOCATIONS: VehicleLocation[] = [
  // Vehicle 1: KA-01-MJ-2041
  { id: 'c1111111-1111-4111-8111-000000000001', vehicle_id: 'd1111111-1111-4111-8111-111111111111', latitude: 12.9778, longitude: 77.5726, speed_kmh: 36.5, battery_fuel_pct: 84, timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
  { id: 'c1111111-1111-4111-8111-000000000002', vehicle_id: 'd1111111-1111-4111-8111-111111111111', latitude: 12.9745, longitude: 77.5850, speed_kmh: 42.0, battery_fuel_pct: 82, timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: 'c1111111-1111-4111-8111-000000000003', vehicle_id: 'd1111111-1111-4111-8111-111111111111', latitude: 12.9716, longitude: 77.5946, speed_kmh: 48.5, battery_fuel_pct: 78, timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString() },

  // Vehicle 2: KA-05-AB-8812
  { id: 'c2222222-2222-4222-8222-000000000001', vehicle_id: 'd2222222-2222-4222-8222-222222222222', latitude: 13.0324, longitude: 77.5273, speed_kmh: 45.0, battery_fuel_pct: 74, timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString() },
  { id: 'c2222222-2222-4222-8222-000000000002', vehicle_id: 'd2222222-2222-4222-8222-222222222222', latitude: 12.9716, longitude: 77.5946, speed_kmh: 50.0, battery_fuel_pct: 70, timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'c2222222-2222-4222-8222-000000000003', vehicle_id: 'd2222222-2222-4222-8222-222222222222', latitude: 12.9141, longitude: 77.6100, speed_kmh: 55.0, battery_fuel_pct: 66, timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
  { id: 'c2222222-2222-4222-8222-000000000004', vehicle_id: 'd2222222-2222-4222-8222-222222222222', latitude: 12.8399, longitude: 77.6770, speed_kmh: 54.0, battery_fuel_pct: 62, timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString() },

  // Vehicle 3: KA-04-EV-9014
  { id: 'c3333333-3333-4333-8333-000000000001', vehicle_id: 'd3333333-3333-4333-8333-000000000003', latitude: 12.9380, longitude: 77.6210, speed_kmh: 22.5, battery_fuel_pct: 95, timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString() },
  { id: 'c3333333-3333-4333-8333-000000000002', vehicle_id: 'd3333333-3333-4333-8333-000000000003', latitude: 12.9360, longitude: 77.6230, speed_kmh: 10.0, battery_fuel_pct: 93, timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString() },
  { id: 'c3333333-3333-4333-8333-000000000003', vehicle_id: 'd3333333-3333-4333-8333-000000000003', latitude: 12.9352, longitude: 77.6245, speed_kmh: 0.0, battery_fuel_pct: 92, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },

  // Vehicle 4: MH-12-HQ-5120
  { id: 'c4444444-4444-4444-8444-000000000001', vehicle_id: 'd4444444-4444-4444-8444-444444444444', latitude: 12.7409, longitude: 77.8253, speed_kmh: 65.0, battery_fuel_pct: 60, timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString() },
  { id: 'c4444444-4444-4444-8444-000000000002', vehicle_id: 'd4444444-4444-4444-8444-444444444444', latitude: 12.8399, longitude: 77.6770, speed_kmh: 58.0, battery_fuel_pct: 54, timestamp: new Date(Date.now() - 70 * 60 * 1000).toISOString() },
  { id: 'c4444444-4444-4444-8444-000000000003', vehicle_id: 'd4444444-4444-4444-8444-444444444444', latitude: 12.9716, longitude: 77.5946, speed_kmh: 60.0, battery_fuel_pct: 49, timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: 'c4444444-4444-4444-8444-000000000004', vehicle_id: 'd4444444-4444-4444-8444-444444444444', latitude: 13.0358, longitude: 77.5970, speed_kmh: 62.0, battery_fuel_pct: 45, timestamp: new Date(Date.now() - 30 * 1000).toISOString() },

  // Vehicle 5: KA-03-NV-3349
  { id: 'c5555555-5555-4555-8555-000000000001', vehicle_id: 'd5555555-5555-4555-8555-555555555555', latitude: 12.9200, longitude: 77.6150, speed_kmh: 28.0, battery_fuel_pct: 38, timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'c5555555-5555-4555-8555-000000000002', vehicle_id: 'd5555555-5555-4555-8555-555555555555', latitude: 12.9141, longitude: 77.6100, speed_kmh: 0.0, battery_fuel_pct: 34, timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },

  // Vehicle 6: KA-51-MD-7721
  { id: 'c6666666-6666-4666-8666-000000000001', vehicle_id: 'd6666666-6666-4666-8666-666666666666', latitude: 12.8163, longitude: 77.6917, speed_kmh: 48.0, battery_fuel_pct: 95, timestamp: new Date(Date.now() - 210 * 60 * 1000).toISOString() },
  { id: 'c6666666-6666-4666-8666-000000000002', vehicle_id: 'd6666666-6666-4666-8666-666666666666', latitude: 12.9141, longitude: 77.6100, speed_kmh: 40.0, battery_fuel_pct: 90, timestamp: new Date(Date.now() - 130 * 60 * 1000).toISOString() },
  { id: 'c6666666-6666-4666-8666-000000000003', vehicle_id: 'd6666666-6666-4666-8666-666666666666', latitude: 12.9698, longitude: 77.6499, speed_kmh: 44.0, battery_fuel_pct: 88, timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'c6666666-6666-4666-8666-000000000004', vehicle_id: 'd6666666-6666-4666-8666-666666666666', latitude: 12.9850, longitude: 77.7280, speed_kmh: 42.0, battery_fuel_pct: 85, timestamp: new Date(Date.now() - 60 * 1000).toISOString() },

  // Vehicle 7: DL-01-AX-4910
  { id: 'c7777777-7777-4777-8777-000000000001', vehicle_id: 'd7777777-7777-4777-8777-777777777777', latitude: 13.1500, longitude: 77.6500, speed_kmh: 48.0, battery_fuel_pct: 22, timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'c7777777-7777-4777-8777-000000000002', vehicle_id: 'd7777777-7777-4777-8777-777777777777', latitude: 13.1986, longitude: 77.7066, speed_kmh: 0.0, battery_fuel_pct: 18, timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString() },

  // Vehicle 8: KA-02-EL-1102
  { id: 'c8888888-8888-4888-8888-000000000001', vehicle_id: 'd8888888-8888-4888-8888-888888888888', latitude: 12.9320, longitude: 77.6300, speed_kmh: 18.5, battery_fuel_pct: 44, timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
  { id: 'c8888888-8888-4888-8888-000000000002', vehicle_id: 'd8888888-8888-4888-8888-888888888888', latitude: 12.9279, longitude: 77.6271, speed_kmh: 0.0, battery_fuel_pct: 41, timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString() },
];

// LocalStorage Persistence Helpers for Demo Mode
const STORAGE_KEYS = {
  VEHICLES: 'bytebeam_fleet_vehicles',
  LOCATIONS: 'bytebeam_fleet_locations',
  TRIPS: 'bytebeam_fleet_trips',
  ALERTS: 'bytebeam_fleet_alerts',
};

export const getLocalVehicleLocations = (): VehicleLocation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_DEMO_LOCATIONS));
      return INITIAL_DEMO_LOCATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_LOCATIONS;
  }
};

export const saveLocalVehicleLocations = (locations: VehicleLocation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(locations));
  } catch (e) {
    console.error('Failed to save vehicle locations to localStorage', e);
  }
};

export const getLocalVehicles = (): Vehicle[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(INITIAL_DEMO_VEHICLES));
      return INITIAL_DEMO_VEHICLES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_VEHICLES;
  }
};

export const saveLocalVehicles = (vehicles: Vehicle[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  } catch (e) {
    console.error('Failed to save vehicles to localStorage', e);
  }
};

export const getLocalTrips = (): Trip[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(INITIAL_DEMO_TRIPS));
      return INITIAL_DEMO_TRIPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_TRIPS;
  }
};

export const saveLocalTrips = (trips: Trip[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  } catch (e) {
    console.error('Failed to save trips to localStorage', e);
  }
};

export const getLocalAlerts = (): Alert[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_DEMO_ALERTS));
      return INITIAL_DEMO_ALERTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_ALERTS;
  }
};

export const saveLocalAlerts = (alerts: Alert[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts to localStorage', e);
  }
};
