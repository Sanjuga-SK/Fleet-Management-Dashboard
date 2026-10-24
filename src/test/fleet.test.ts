import { describe, it, expect, beforeEach } from 'vitest';
import { fleetService } from '@/services/fleetService';
import { INITIAL_DEMO_VEHICLES } from '@/lib/demoData';

describe('Fleet Management Service & Domain Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('operates in demo mode when Supabase credentials are absent', () => {
    expect(fleetService.isDemoMode()).toBe(true);
  });

  it('retrieves default demo vehicles on initial boot', async () => {
    const vehicles = await fleetService.getVehicles();
    expect(vehicles.length).toBe(INITIAL_DEMO_VEHICLES.length);
    expect(vehicles[0].plate_number).toBe('KA-01-MJ-2041');
  });

  it('filters vehicles by operational status', async () => {
    const inTransitVehicles = await fleetService.getVehicles(undefined, 'in_transit');
    expect(inTransitVehicles.length).toBeGreaterThan(0);
    inTransitVehicles.forEach((v) => {
      expect(v.status).toBe('in_transit');
    });

    const idleVehicles = await fleetService.getVehicles(undefined, 'idle');
    expect(idleVehicles.length).toBeGreaterThan(0);
    idleVehicles.forEach((v) => {
      expect(v.status).toBe('idle');
    });
  });

  it('filters vehicles by search query across plate, VIN, and driver', async () => {
    const plateMatch = await fleetService.getVehicles('MJ-2041');
    expect(plateMatch.length).toBe(1);
    expect(plateMatch[0].plate_number).toBe('KA-01-MJ-2041');

    const driverMatch = await fleetService.getVehicles('Suresh');
    expect(driverMatch.length).toBe(1);
    expect(driverMatch[0].driver_name).toBe('Suresh Gowda');
  });

  it('correctly aggregates fleet metrics', async () => {
    const metrics = await fleetService.getFleetMetrics();
    expect(metrics.totalVehicles).toBe(INITIAL_DEMO_VEHICLES.length);
    expect(metrics.activeEnRoute + metrics.idleOrUnavailable + metrics.inMaintenance).toBe(metrics.totalVehicles);
    expect(metrics.openAlerts).toBeGreaterThanOrEqual(0);
  });

  it('creates and persists a new vehicle in demo mode', async () => {
    const newVehicle = await fleetService.createVehicle({
      plate_number: 'KA-09-XX-9999',
      vin: '1FT8W3BT9TEST9999',
      make: 'Eicher',
      model: 'Pro 2049 EV',
      year: 2025,
      type: 'electric_delivery',
      status: 'idle',
      battery_fuel_pct: 100,
      speed_kmh: 0,
      heading_degrees: 0,
      odometer_km: 120,
      driver_name: 'Test Driver',
      latitude: 12.9716,
      longitude: 77.5946,
    });

    expect(newVehicle.id).toBeDefined();
    expect(newVehicle.plate_number).toBe('KA-09-XX-9999');

    const fetched = await fleetService.getVehicleById(newVehicle.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.plate_number).toBe('KA-09-XX-9999');
  });

  it('updates alert status to acknowledged with dispatcher attribution', async () => {
    const alerts = await fleetService.getAlerts();
    const openAlert = alerts.find((a) => a.status === 'open');
    expect(openAlert).toBeDefined();

    const updated = await fleetService.updateAlertStatus(
      openAlert!.id,
      'acknowledged',
      'Test Dispatcher'
    );
    expect(updated.status).toBe('acknowledged');
    expect(updated.acknowledged_by).toBe('Test Dispatcher');
    expect(updated.acknowledged_at).toBeDefined();
  });

  it('retrieves vehicle telemetry locations and filters by vehicle_id', async () => {
    const allLocations = await fleetService.getVehicleLocations();
    expect(allLocations.length).toBeGreaterThan(0);

    const vehicleId = 'd1111111-1111-4111-8111-111111111111';
    const vehicleLocations = await fleetService.getVehicleLocations(vehicleId);
    expect(vehicleLocations.length).toBe(3);
    vehicleLocations.forEach((loc) => {
      expect(loc.vehicle_id).toBe(vehicleId);
      expect(loc.latitude).toBeGreaterThan(12.0);
      expect(loc.longitude).toBeGreaterThan(77.0);
    });
  });
});
