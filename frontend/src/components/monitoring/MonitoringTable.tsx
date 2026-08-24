"use client";

import { Activity } from "lucide-react";
import { NetworkMetric } from "@/src/services/monitoring.service";

interface MonitoringTableProps {
  metrics: NetworkMetric[];
  loading: boolean;
}

export default function MonitoringTable({
  metrics,
  loading,
}: MonitoringTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-sm text-slate-400">Loading network metrics...</p>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
        <Activity size={38} className="mx-auto text-slate-300" />

        <p className="mt-3 font-medium text-slate-600">
          No network metrics found
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Record network metrics to begin monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Access Point
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Signal
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Throughput
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Latency
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Packet Loss
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Users
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Availability
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Recorded
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {metrics.map((metric) => (
              <tr key={metric.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-900">
                    {metric.access_point_name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {metric.building_name}
                  </p>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {metric.signal_strength !== null
                    ? `${metric.signal_strength} dBm`
                    : "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {metric.throughput !== null
                    ? `${metric.throughput} Mbps`
                    : "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {metric.latency !== null ? `${metric.latency} ms` : "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {metric.packet_loss !== null ? `${metric.packet_loss}%` : "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {metric.connected_users ?? "—"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {metric.network_availability !== null
                    ? `${metric.network_availability}%`
                    : "—"}
                </td>

                <td className="px-5 py-4 text-slate-500">
                  {new Date(metric.recorded_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
