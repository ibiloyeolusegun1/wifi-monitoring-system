"use client";

import { Activity } from "lucide-react";
import { PerformanceReport } from "@/src/services/report.service";

interface PerformanceTableProps {
  data: PerformanceReport[];
  loading: boolean;
}

export default function PerformanceTable({
  data,
  loading,
}: PerformanceTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm text-slate-400">Loading performance report...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
        <Activity size={38} className="mx-auto text-slate-300" />

        <p className="mt-3 text-sm font-medium text-slate-600">
          No performance records found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try changing the selected date range or access point.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Access Point
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Location
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
                Availability
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Recorded
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {item.access_point_name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {item.campus_name}
                  </p>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {item.building_name}
                </td>

                <td className="px-5 py-4">
                  {item.signal_strength !== null
                    ? `${item.signal_strength} dBm`
                    : "—"}
                </td>

                <td className="px-5 py-4">
                  {item.throughput !== null ? `${item.throughput} Mbps` : "—"}
                </td>

                <td className="px-5 py-4">
                  {item.latency !== null ? `${item.latency} ms` : "—"}
                </td>

                <td className="px-5 py-4">
                  {item.packet_loss !== null ? `${item.packet_loss}%` : "—"}
                </td>

                <td className="px-5 py-4">
                  {item.network_availability !== null
                    ? `${item.network_availability}%`
                    : "—"}
                </td>

                <td className="px-5 py-4 text-xs text-slate-500">
                  {new Date(item.recorded_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
