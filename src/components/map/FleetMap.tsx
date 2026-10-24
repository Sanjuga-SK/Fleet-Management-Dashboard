import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Vehicle, Trip, VehicleLocation, VehicleStatus } from '@/types/fleet';
import { StatusBadge } from '../common/StatusBadge';
import { Gauge, BatteryCharging, Navigation, Crosshair, MapPin } from 'lucide-react';

// Custom SVG HTML Map Pin for Vehicles with Green + Orange theme
const createVehicleIcon = (status: VehicleStatus, heading: number = 0, isSelected: boolean = false) => {
  let color = '#15803D'; // in_transit: Primary green
  let bgColor = '#F0FDF4';
  let borderColor = '#166534';

  if (status === 'idle') {
    color = '#F97316'; // idle: Primary orange
    bgColor = '#FFF7ED';
    borderColor = '#EA580C';
  } else if (status === 'maintenance') {
    color = '#D97706'; // maintenance: Amber
    bgColor = '#FEF3C7';
    borderColor = '#B45309';
  } else if (status === 'offline') {
    color = '#64748B'; // offline: Slate
    bgColor = '#F1F5F9';
    borderColor = '#475569';
  }

  // Selected vehicle gets an eye-catching orange ring highlight
  const pulseRing = isSelected ? `box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.45); border-color: #F97316;` : '';

  const html = `
    <div style="
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: ${bgColor};
      border: 2px solid ${borderColor};
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(${heading}deg);
      transition: all 0.2s ease;
      cursor: pointer;
      ${pulseRing}
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${color}" stroke="${borderColor}" stroke-width="1.5">
        <polygon points="12 2 19 21 12 17 5 21 12 2" />
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-vehicle-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

// Component to handle auto-fitting bounds or re-centering
const MapController: React.FC<{
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
  selectedTrip?: Trip | null;
}> = ({ vehicles, selectedVehicle, selectedTrip }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedVehicle) {
      map.flyTo([selectedVehicle.latitude, selectedVehicle.longitude], 14, { duration: 1.2 });
      return;
    }

    if (selectedTrip && selectedTrip.route_coordinates.length > 0) {
      const bounds = L.latLngBounds(selectedTrip.route_coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
      return;
    }

    if (vehicles.length > 0) {
      const bounds = L.latLngBounds(vehicles.map((v) => [v.latitude, v.longitude]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [vehicles, selectedVehicle, selectedTrip, map]);

  return null;
};

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle | null;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  selectedTrip?: Trip | null;
  breadcrumbs?: VehicleLocation[];
  height?: string;
  showControls?: boolean;
}

export const FleetMap: React.FC<FleetMapProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  selectedTrip,
  breadcrumbs = [],
  height = '500px',
  showControls = true,
}) => {
  // Center fallback (Bangalore corridor)
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  const routePolyline = useMemo(() => {
    if (selectedTrip && selectedTrip.route_coordinates && selectedTrip.route_coordinates.length > 0) {
      return selectedTrip.route_coordinates;
    }
    return null;
  }, [selectedTrip]);

  const breadcrumbCoords = useMemo(() => {
    if (!breadcrumbs || breadcrumbs.length === 0) return [];
    // Sort oldest to newest for polyline tracing
    return [...breadcrumbs]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map((loc) => [loc.latitude, loc.longitude] as [number, number]);
  }, [breadcrumbs]);

  return (
    <div className="relative w-full overflow-hidden rounded-card border border-border-subtle shadow-card" style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full z-0 font-sans"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController
          vehicles={vehicles}
          selectedVehicle={selectedVehicle}
          selectedTrip={selectedTrip}
        />

        {/* Selected Trip Historical Route Polyline */}
        {routePolyline && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: selectedTrip?.status === 'in_progress' ? '#F97316' : '#15803D',
              weight: 5,
              opacity: 0.9,
              dashArray: selectedTrip?.status === 'in_progress' ? '8, 8' : undefined,
            }}
          />
        )}

        {/* Vehicle Telemetry Historical Breadcrumbs from vehicle_locations */}
        {breadcrumbCoords.length > 1 && (
          <Polyline
            positions={breadcrumbCoords}
            pathOptions={{
              color: '#2563EB',
              weight: 3,
              dashArray: '5, 5',
              opacity: 0.85,
            }}
          />
        )}

        {/* Individual breadcrumb telemetry pings */}
        {breadcrumbs.map((loc) => (
          <CircleMarker
            key={loc.id}
            center={[loc.latitude, loc.longitude]}
            radius={4}
            pathOptions={{
              color: '#1D4ED8',
              fillColor: '#60A5FA',
              fillOpacity: 0.9,
              weight: 1.5,
            }}
          >
            <Popup className="custom-fleet-popup">
              <div className="p-1 font-sans text-xs">
                <div className="font-semibold text-blue-900 mb-1">
                  GPS Telemetry Ping (vehicle_locations)
                </div>
                <div className="text-content-muted text-[11px] space-y-0.5">
                  <div>Speed: <span className="font-mono font-medium text-slate-800">{loc.speed_kmh} km/h</span></div>
                  <div>Battery/Fuel: <span className="font-mono font-medium text-slate-800">{loc.battery_fuel_pct}%</span></div>
                  <div>Time: <span className="font-mono text-[10px]">{new Date(loc.timestamp).toLocaleTimeString()}</span></div>
                </div>
                <div className="text-[10px] text-amber-700 font-medium mt-1">
                  Simulated Sample Data (Non-live GPS)
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Vehicle Markers */}
        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicle?.id === vehicle.id;
          const icon = createVehicleIcon(vehicle.status, vehicle.heading_degrees, isSelected);

          return (
            <Marker
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectVehicle?.(vehicle),
              }}
            >
              <Popup className="custom-fleet-popup">
                <div className="p-1 min-w-[200px] font-sans">
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-200">
                    <span className="font-mono font-bold text-xs text-content-dominant">
                      {vehicle.plate_number}
                    </span>
                    <StatusBadge status={vehicle.status} showIcon={false} />
                  </div>

                  <div className="text-xs text-content-supportive space-y-1 mb-3">
                    <div className="flex justify-between">
                      <span className="text-content-muted">Driver:</span>
                      <span className="font-semibold text-content-dominant">{vehicle.driver_name || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-content-muted flex items-center gap-1">
                        <Gauge className="w-3 h-3 text-primary" /> Speed:
                      </span>
                      <span className="font-mono font-semibold text-content-dominant">{vehicle.speed_kmh} km/h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-content-muted flex items-center gap-1">
                        <BatteryCharging className="w-3 h-3 text-orange" /> Fuel/SoC:
                      </span>
                      <span className="font-mono font-semibold text-content-dominant">{vehicle.battery_fuel_pct}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-content-muted">Model:</span>
                      <span>{vehicle.make} {vehicle.model}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-amber-800 bg-amber-50 px-2 py-1.5 rounded flex items-center gap-1.5 border border-amber-200 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="font-semibold">Simulated Sample Data (Non-live GPS telematics)</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend & Overlay Controls */}
      {showControls && (
        <>
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-control shadow-md border border-border-subtle text-xs space-y-1.5">
            <div className="font-semibold text-content-dominant text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Fleet Status Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-700 border border-green-800 inline-block"></span>
              <span className="text-content-supportive">In Transit (Moving)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange border border-orange-600 inline-block"></span>
              <span className="text-content-supportive">Idle / Stationary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600 border border-amber-700 inline-block"></span>
              <span className="text-content-supportive">Maintenance Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 border border-slate-500 inline-block"></span>
              <span className="text-content-supportive">Offline</span>
            </div>
            {selectedTrip && (
              <div className="pt-1.5 border-t border-slate-200 text-primary font-semibold flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-primary inline-block"></span>
                <span>Active Route Polyline</span>
              </div>
            )}
            {breadcrumbs.length > 0 && (
              <div className="pt-1.5 border-t border-slate-200 text-blue-700 font-semibold flex items-center gap-1.5 text-[11px]">
                <span className="w-3 h-0.5 bg-blue-600 inline-block border-t border-dashed"></span>
                <span>Pings ({breadcrumbs.length} from vehicle_locations)</span>
              </div>
            )}
          </div>

        </>
      )}
    </div>
  );
};
