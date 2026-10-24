import React, { useEffect, useState } from 'react';
import { fleetService } from '@/services/fleetService';
import { Alert, AlertStatus } from '@/types/fleet';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { TableSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState, Badge, Button } from '@/components/ui';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Check,
  ShieldAlert,
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await fleetService.getAlerts(severityFilter, statusFilter);
      setAlerts(data);
    } catch (e) {
      console.error('Failed to load alerts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [severityFilter, statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: AlertStatus) => {
    try {
      setActionInProgress(id);
      await fleetService.updateAlertStatus(id, newStatus);
      await loadAlerts();
    } catch (e) {
      console.error('Failed to update alert status', e);
    } finally {
      setActionInProgress(null);
    }
  };

  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning' && a.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content-dominant tracking-tight flex items-center gap-2">
            Operational Exceptions & Telematics Alerts
          </h1>
          <p className="text-xs sm:text-sm text-content-muted mt-0.5">
            Triage vehicle diagnostic trouble codes (DTC), driver safety violations, and connectivity heartbeats.
          </p>
        </div>

        {/* Severity Summary Pills */}
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              {criticalCount} Critical Active
            </div>
          )}
          {warningCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {warningCount} Warnings
            </div>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-canvas-card border border-border-subtle rounded-card p-4 shadow-card flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-control text-xs">
            {(['all', 'open', 'acknowledged', 'resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded text-xs transition-colors capitalize ${
                  statusFilter === status
                    ? 'bg-white text-content-dominant shadow-sm font-semibold'
                    : 'text-content-muted hover:text-content-dominant'
                }`}
              >
                {status === 'all' ? 'All Statuses' : status}
              </button>
            ))}
          </div>

          {/* Severity Dropdown */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-canvas-bg border border-border-subtle rounded-control text-xs text-content-dominant focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="warning">Warning Only</option>
            <option value="info">Info Only</option>
          </select>
        </div>

        <div className="text-xs text-content-muted">
          Showing <span className="font-bold text-content-dominant">{alerts.length}</span> alerts
        </div>
      </div>

      {/* Alerts Table */}
      <div className="bg-canvas-card border border-border-subtle rounded-card overflow-hidden shadow-card">
        {loading ? (
          <TableSkeleton rows={5} />
        ) : alerts.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No alerts found"
            description="All systems nominal. No operational alerts matching the selected filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-border-subtle text-content-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-semibold">Severity & Category</th>
                  <th className="py-3 px-4 font-semibold">Vehicle & Driver</th>
                  <th className="py-3 px-4 font-semibold">Alert Message & Diagnostics</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold text-right">Triage Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {alerts.map((alert) => (
                  <tr
                    key={alert.id}
                    className={`transition-colors ${
                      alert.status === 'open' && alert.severity === 'critical'
                        ? 'bg-rose-50/40 hover:bg-rose-50/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <SeverityBadge severity={alert.severity} />
                        <span className="text-[10px] uppercase font-mono font-semibold text-content-muted">
                          {alert.category.replace('_', ' ')}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {alert.vehicle ? (
                        <div>
                          <div className="font-mono font-bold text-content-dominant">
                            {alert.vehicle.plate_number}
                          </div>
                          <div className="text-[11px] text-content-muted">
                            {alert.vehicle.driver_name || alert.vehicle.model}
                          </div>
                        </div>
                      ) : (
                        <span className="text-content-muted italic">Fleet Global</span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-md">
                      <div className="text-content-dominant font-medium">
                        {alert.message}
                      </div>
                      {alert.acknowledged_by && (
                        <div className="text-[10px] text-content-muted mt-0.5">
                          Acknowledged by: <span className="font-semibold">{alert.acknowledged_by}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        size="sm"
                        variant={
                          alert.status === 'open'
                            ? 'danger'
                            : alert.status === 'acknowledged'
                            ? 'orange'
                            : 'success'
                        }
                      >
                        {alert.status.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-content-muted font-mono">
                      {new Date(alert.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {alert.status === 'open' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateStatus(alert.id, 'acknowledged')}
                            loading={actionInProgress === alert.id}
                            icon={<Clock className="w-3 h-3 text-orange" />}
                            className="text-[11px] py-1 px-2.5"
                          >
                            Acknowledge
                          </Button>
                        )}
                        {alert.status !== 'resolved' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                            loading={actionInProgress === alert.id}
                            icon={<Check className="w-3 h-3" />}
                            className="text-[11px] py-1 px-2.5"
                          >
                            Resolve
                          </Button>
                        )}
                        {alert.status === 'resolved' && (
                          <span className="text-[11px] text-primary font-semibold flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Resolved
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
