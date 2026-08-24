"use client";

import { useEffect, useState } from "react";
import { Activity, Plus } from "lucide-react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import {
  AccessPoint,
  getAccessPoints,
} from "@/src/services/accessPoint.service";
import {
  NetworkMetric,
  RecordNetworkMetricPayload,
  getNetworkMetrics,
  recordNetworkMetrics,
} from "@/src/services/monitoring.service";
import MonitoringModal from "@/src/components/monitoring/MonitoringModal";
import MonitoringTable from "@/src/components/monitoring/MonitoringTable";
import MonitoringChart from "@/src/components/monitoring/MonitoringChart";

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<NetworkMetric[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  async function loadAccessPoints() {
    try {
      const data = await getAccessPoints();

      setAccessPoints(data);
    } catch (error) {
      console.error("Failed to load access points:", error);
    }
  }

  async function loadMetrics() {
    try {
      setLoading(true);
      setError("");

      const data = await getNetworkMetrics(selectedAccessPoint || undefined);

      setMetrics(data);
    } catch (error) {
      console.error("Failed to load network metrics:", error);

      setError("Unable to load network metrics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccessPoints();
  }, []);

  useEffect(() => {
    loadMetrics();
  }, [selectedAccessPoint]);

  async function handleRecord(payload: RecordNetworkMetricPayload) {
    try {
      setSaving(true);
      setError("");

      await recordNetworkMetrics(payload);

      setModalOpen(false);

      await loadMetrics();
    } catch (error: any) {
      console.error("Failed to record metrics:", error);

      setError(
        error?.response?.data?.message || "Unable to record network metrics.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Network Monitoring
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor Wi-Fi network performance across access points.
          </p>
        </div>

        <button
          onClick={() => {
            setError("");
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Record Metrics
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Filter by Access Point
        </label>

        <select
          value={selectedAccessPoint}
          onChange={(event) => setSelectedAccessPoint(event.target.value)}
          className="w-full md:max-w-md rounded-xl border border-slate-300 text-slate-500 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        >
          <option value="">All Access Points</option>

          {accessPoints.map((accessPoint) => (
            <option key={accessPoint.id} value={accessPoint.id}>
              {accessPoint.name}
              {" — "}
              {accessPoint.building_name}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Metric Records"
          value={metrics.length}
          icon={Activity}
        />

        <SummaryCard
          title="Access Points"
          value={new Set(metrics.map((metric) => metric.access_point_id)).size}
          icon={Activity}
        />

        <SummaryCard
          title="Online Measurements"
          value={
            metrics.filter(
              (metric) =>
                metric.network_availability !== null &&
                Number(metric.network_availability) > 0,
            ).length
          }
          icon={Activity}
        />

        <SummaryCard
          title="Latest Records"
          value={
            metrics.length > 0
              ? new Date(metrics[0].recorded_at).toLocaleTimeString()
              : "—"
          }
          icon={Activity}
        />
      </div>

      {/* Table */}
      <MonitoringTable metrics={metrics} loading={loading} />

      {/* Chart */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Performance Analysis
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Visual analysis of recorded Wi-Fi performance metrics.
          </p>
        </div>

        <MonitoringChart metrics={metrics} />
      </div>

      {/* Modal */}
      <MonitoringModal
        open={modalOpen}
        loading={saving}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
          }
        }}
        onSubmit={handleRecord}
      />
    </AdminLayout>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={19} />
        </div>

        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
