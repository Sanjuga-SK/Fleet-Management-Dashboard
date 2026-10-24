import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Vehicle, VehicleLocation, Trip, Alert, FleetMetrics, AlertStatus } from '@/types/fleet';
import {
  getLocalVehicles,
  saveLocalVehicles,
  getLocalVehicleLocations,
  saveLocalVehicleLocations,
  getLocalTrips,
  getLocalAlerts,
  saveLocalAlerts,
} from '@/lib/demoData';

export const fleetService = {
  // Check active mode
  isDemoMode(): boolean {
    return !isSupabaseConfigured;
  },

  // ============================================================================
  // VEHICLE OPERATIONS
  // ============================================================================
  async getVehicles(search?: string, statusFilter?: string): Promise<Vehicle[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('vehicles').select('*').order('last_telemetry_at', { ascending: false });
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (search && search.trim()) {
        const term = search.trim();
        query = query.or(`plate_number.ilike.%${term}%,driver_name.ilike.%${term}%,vin.ilike.%${term}%,make.ilike.%${term}%`);
      }
      const { data, error } = await query;
      if (error) {
        console.warn('Supabase getVehicles failed, falling back to local store:', error.message);
        return this.getLocalFilteredVehicles(search, statusFilter);
      }

      const vehiclesList = (data as Vehicle[]) || [];

      // Read from vehicle_locations to ensure vehicles reflect the latest GPS ping
      try {
        const { data: latestLocs } = await supabase
          .from('vehicle_locations')
          .select('vehicle_id, latitude, longitude, speed_kmh, battery_fuel_pct, timestamp')
          .order('timestamp', { ascending: false });

        if (latestLocs && latestLocs.length > 0) {
          const locMap = new Map<string, (typeof latestLocs)[0]>();
          for (const loc of latestLocs) {
            if (!locMap.has(loc.vehicle_id)) {
              locMap.set(loc.vehicle_id, loc);
            }
          }
          for (const v of vehiclesList) {
            const latest = locMap.get(v.id);
            if (latest) {
              v.latitude = Number(latest.latitude);
              v.longitude = Number(latest.longitude);
              v.speed_kmh = Number(latest.speed_kmh);
              v.battery_fuel_pct = Number(latest.battery_fuel_pct);
              v.last_telemetry_at = latest.timestamp;
            }
          }
        }
      } catch (locErr) {
        console.warn('vehicle_locations telemetry sync notice:', locErr);
      }

      return vehiclesList;
    }
    return this.getLocalFilteredVehicles(search, statusFilter);
  },

  getLocalFilteredVehicles(search?: string, statusFilter?: string): Vehicle[] {
    let list = getLocalVehicles();
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter((v) => v.status === statusFilter);
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.plate_number.toLowerCase().includes(q) ||
          v.vin.toLowerCase().includes(q) ||
          (v.driver_name && v.driver_name.toLowerCase().includes(q)) ||
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('vehicles').select('*').eq('id', id).single();
      if (!error && data) return data as Vehicle;
    }
    const vehicles = getLocalVehicles();
    return vehicles.find((v) => v.id === id) || null;
  },

  async createVehicle(payload: Omit<Vehicle, 'id' | 'last_telemetry_at'>): Promise<Vehicle> {
    const newVehicle: Vehicle = {
      ...payload,
      id: crypto.randomUUID(),
      last_telemetry_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('vehicles').insert(newVehicle).select().single();
      if (error) {
        console.warn('Supabase createVehicle failed, saving locally:', error.message);
      } else if (data) {
        return data as Vehicle;
      }
    }

    const vehicles = getLocalVehicles();
    vehicles.unshift(newVehicle);
    saveLocalVehicles(vehicles);
    return newVehicle;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const updatedFields = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Vehicle;
    }

    const vehicles = getLocalVehicles();
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Vehicle ${id} not found`);

    vehicles[index] = { ...vehicles[index], ...updatedFields };
    saveLocalVehicles(vehicles);
    return vehicles[index];
  },

  async deleteVehicle(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (!error) return true;
    }
    const vehicles = getLocalVehicles().filter((v) => v.id !== id);
    saveLocalVehicles(vehicles);
    return true;
  },

  // ============================================================================
  // VEHICLE LOCATION OPERATIONS (Telematics History)
  // ============================================================================
  async getVehicleLocations(vehicleId?: string, limit: number = 50): Promise<VehicleLocation[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('vehicle_locations')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return (data as VehicleLocation[]).map((loc) => ({
          ...loc,
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
          speed_kmh: Number(loc.speed_kmh),
          battery_fuel_pct: Number(loc.battery_fuel_pct),
        }));
      }
      if (error) {
        console.warn('Supabase getVehicleLocations error, falling back to local:', error.message);
      }
    }

    let list = getLocalVehicleLocations();
    if (vehicleId) {
      list = list.filter((l) => l.vehicle_id === vehicleId);
    }
    return list.slice(0, limit);
  },

  async recordVehicleLocation(location: Omit<VehicleLocation, 'id' | 'timestamp'>): Promise<VehicleLocation> {
    const newLocation: VehicleLocation = {
      ...location,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('vehicle_locations').insert(newLocation).select().single();
      if (!error && data) return data as VehicleLocation;
    }

    const locations = getLocalVehicleLocations();
    locations.unshift(newLocation);
    saveLocalVehicleLocations(locations);
    return newLocation;
  },

  // ============================================================================
  // TRIP OPERATIONS
  // ============================================================================
  async getTrips(statusFilter?: string, vehicleId?: string): Promise<Trip[]> {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('trips').select('*, vehicle:vehicles(*)').order('start_time', { ascending: false });
      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      if (vehicleId && vehicleId !== 'all') {
        query = query.eq('vehicle_id', vehicleId);
      }
      const { data, error } = await query;
      if (!error && data) return data as Trip[];
    }

    let trips = getLocalTrips();
    const vehicles = getLocalVehicles();
    const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

    trips = trips.map((t) => ({
      ...t,
      vehicle: vehicleMap.get(t.vehicle_id),
    }));

    if (statusFilter && statusFilter !== 'all') {
      trips = trips.filter((t) => t.status === statusFilter);
    }
    if (vehicleId && vehicleId !== 'all') {
      trips = trips.filter((t) => t.vehicle_id === vehicleId);
    }
    return trips;
  },

  // ============================================================================
  // ALERT OPERATIONS
  // ============================================================================
  async getAlerts(severityFilter?: string, statusFilter?: string): Promise<Alert[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('alerts').select('*, vehicle:vehicles(*)').order('created_at', { ascending: false });
        if (severityFilter && severityFilter !== 'all') {
          query = query.eq('severity', severityFilter);
        }
        if (statusFilter && statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        const { data, error } = await query;
        if (!error && data) return data as Alert[];
      } catch (err) {
        console.warn('Network offline / alerts fetch error, using local fallback:', err);
      }
    }

    let alerts = getLocalAlerts();
    const vehicles = getLocalVehicles();
    const vehicleMap = new Map(vehicles.map((v) => [v.id, v]));

    alerts = alerts.map((a) => ({
      ...a,
      vehicle: a.vehicle_id ? vehicleMap.get(a.vehicle_id) : undefined,
    }));

    if (severityFilter && severityFilter !== 'all') {
      alerts = alerts.filter((a) => a.severity === severityFilter);
    }
    if (statusFilter && statusFilter !== 'all') {
      alerts = alerts.filter((a) => a.status === statusFilter);
    }
    return alerts;
  },

  async updateAlertStatus(id: string, status: AlertStatus, acknowledgedBy?: string): Promise<Alert> {
    const updates: Partial<Alert> = {
      status,
      ...(status === 'acknowledged'
        ? { acknowledged_by: acknowledgedBy || 'Fleet Dispatcher', acknowledged_at: new Date().toISOString() }
        : {}),
      ...(status === 'resolved' ? { resolved_at: new Date().toISOString() } : {}),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as Alert;
    }

    const alerts = getLocalAlerts();
    const index = alerts.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Alert ${id} not found`);

    alerts[index] = { ...alerts[index], ...updates };
    saveLocalAlerts(alerts);
    return alerts[index];
  },

  // ============================================================================
  // FLEET METRICS (AGGREGATIONS)
  // ============================================================================
  async getFleetMetrics(): Promise<FleetMetrics> {
    const vehicles = await this.getVehicles();
    const trips = await this.getTrips();
    const alerts = await this.getAlerts();

    const activeEnRoute = vehicles.filter((v) => v.status === 'in_transit').length;
    const idle = vehicles.filter((v) => v.status === 'idle').length;
    const inMaintenance = vehicles.filter((v) => v.status === 'maintenance').length;
    const offline = vehicles.filter((v) => v.status === 'offline').length;
    const activeTrips = trips.filter((t) => t.status === 'in_progress').length;
    const openAlerts = alerts.filter((a) => a.status !== 'resolved').length;
    const criticalAlerts = alerts.filter((a) => a.status === 'open' && a.severity === 'critical').length;

    const totalBattery = vehicles.reduce((sum, v) => sum + (v.battery_fuel_pct || 0), 0);
    const averageBatteryFuel = vehicles.length > 0 ? Math.round(totalBattery / vehicles.length) : 0;

    return {
      totalVehicles: vehicles.length,
      activeEnRoute,
      idleOrUnavailable: idle + offline,
      inMaintenance,
      offline,
      activeTrips,
      openAlerts,
      criticalAlerts,
      averageBatteryFuel,
    };
  },
};
