import React from 'react';
import { Modal } from '@/components/ui';
import { Trip } from '@/types/fleet';
import { FleetMap } from '@/components/map/FleetMap';
import { Route, Clock, Gauge, Calendar } from 'lucide-react';

interface TripRouteModalProps {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TripRouteModal: React.FC<TripRouteModalProps> = ({ trip, isOpen, onClose }) => {
  if (!trip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trip Route: ${trip.origin} → ${trip.destination}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Header Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-border-subtle rounded-control text-xs">
          <div>
            <div className="text-content-muted flex items-center gap-1 mb-0.5">
              <Route className="w-3.5 h-3.5 text-primary" /> Distance
            </div>
            <div className="text-sm font-mono font-bold text-content-dominant">
              {trip.distance_km} km
            </div>
          </div>

          <div>
            <div className="text-content-muted flex items-center gap-1 mb-0.5">
              <Gauge className="w-3.5 h-3.5 text-primary" /> Avg Speed
            </div>
            <div className="text-sm font-mono font-bold text-content-dominant">
              {trip.avg_speed_kmh} km/h
            </div>
          </div>

          <div>
            <div className="text-content-muted flex items-center gap-1 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-orange" /> Max Speed
            </div>
            <div className="text-sm font-mono font-bold text-content-dominant">
              {trip.max_speed_kmh} km/h
            </div>
          </div>

          <div>
            <div className="text-content-muted flex items-center gap-1 mb-0.5">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Departure
            </div>
            <div className="text-xs font-medium text-content-dominant">
              {new Date(trip.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Map Plotting Polyline */}
        <div className="rounded-card overflow-hidden border border-border-subtle">
          <FleetMap
            vehicles={trip.vehicle ? [trip.vehicle] : []}
            selectedTrip={trip}
            height="380px"
            showControls={false}
          />
        </div>

        {/* Origin / Destination Waypoints */}
        <div className="flex items-center justify-between text-xs text-content-muted px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
            <span className="font-medium text-content-dominant">{trip.origin}</span>
          </div>
          <span className="text-slate-300">━━━━━━━━━▶</span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-200"></span>
            <span className="font-medium text-content-dominant">{trip.destination}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
