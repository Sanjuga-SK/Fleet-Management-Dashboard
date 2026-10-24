export interface FleetMetrics {
  totalVehicles: number;
  activeEnRoute: number;
  idleOrUnavailable: number;
  inMaintenance: number;
  offline: number;
  activeTrips: number;
  openAlerts: number;
  criticalAlerts: number;
  averageBatteryFuel: number;
}

export interface MetricTrend {
  value: string;
  positive?: boolean;
}
