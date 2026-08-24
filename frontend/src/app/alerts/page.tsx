"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Bell, RefreshCw } from "lucide-react";

import AdminLayout from "@/src/components/admin/AdminLayout";

import {
  AccessPoint,
  getAccessPoints,
} from "@/src/services/accessPoint.service";

import {
  NetworkAlert,
  generateAlerts,
  getAlerts,
} from "@/src/services/alert.service";

import AlertTable from "@/src/components/alerts/AlertTable";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<NetworkAlert[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const loadAccessPoints = async () => {
    try {
      const data = await getAccessPoints();

      setAccessPoints(data);
    } catch (error) {
      console.error("Failed to load access points:", error);
    }
  };

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAlerts(selectedAccessPoint || undefined);

      setAlerts(data);
    } catch (error) {
      console.error("Failed to load alerts:", error);

      setError("Unable to load network alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccessPoints();
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [selectedAccessPoint]);

  async function handleGenerateAlerts() {
    if (!selectedAccessPoint) {
      setError("Please select an access point before generating alerts.");

      return;
    }

    try {
      setGenerating(true);
      setError("");

      const result = await generateAlerts(selectedAccessPoint);

      await loadAlerts();

      if (result.message) {
        setError("");

        console.log(result.message);
      }
    } catch (error: any) {
      console.error("Failed to generate alerts:", error);

      setError(error?.response?.data?.message || "Unable to generate alerts.");
    } finally {
      setGenerating(false);
    }
  }

  const summary = useMemo(() => {
    return {
      total: alerts.length,

      critical: alerts.filter((alert) => alert.severity === "CRITICAL").length,

      high: alerts.filter((alert) => alert.severity === "HIGH").length,

      medium: alerts.filter((alert) => alert.severity === "MEDIUM").length,
    };
  }, [alerts]);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Network Alerts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor network problems detected from Wi-Fi performance metrics.
          </p>
        </div>

        <button
          onClick={handleGenerateAlerts}
          disabled={generating || !selectedAccessPoint}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          <RefreshCw size={17} className={generating ? "animate-spin" : ""} />

          {generating ? "Generating..." : "Generate Alerts"}
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
          Access Point
        </label>

        <select
          value={selectedAccessPoint}
          onChange={(event) => setSelectedAccessPoint(event.target.value)}
          className="w-full md:max-w-lg rounded-xl border border-slate-300 text-slate-500 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
        >
          <option value="">Select access point</option>

          {accessPoints.map((accessPoint) => (
            <option key={accessPoint.id} value={accessPoint.id}>
              {accessPoint.name}
              {" — "}
              {accessPoint.building_name}
            </option>
          ))}
        </select>

        <p className="mt-2 text-xs text-slate-400">
          Select an access point before generating alerts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <AlertSummaryCard
          title="Total Alerts"
          value={summary.total}
          icon={Bell}
          iconClass="bg-blue-50 text-blue-600"
        />

        <AlertSummaryCard
          title="Critical"
          value={summary.critical}
          icon={AlertTriangle}
          iconClass="bg-red-50 text-red-600"
        />

        <AlertSummaryCard
          title="High"
          value={summary.high}
          icon={AlertTriangle}
          iconClass="bg-orange-50 text-orange-600"
        />

        <AlertSummaryCard
          title="Medium"
          value={summary.medium}
          icon={AlertTriangle}
          iconClass="bg-yellow-50 text-yellow-600"
        />
      </div>

      {/* Table */}
      <AlertTable alerts={alerts} loading={loading} />
    </AdminLayout>
  );
}

function AlertSummaryCard({
  title,
  value,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: typeof Bell;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
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
