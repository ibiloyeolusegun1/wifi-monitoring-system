"use client";

import { AlertTriangle } from "lucide-react";
import { AlertReport } from "@/src/services/report.service";

interface AlertTableProps {
  data: AlertReport[];
  loading: boolean;
}

function severityClass(severity: string) {
  switch (severity) {
    case "CRITICAL":
      return "bg-red-50 text-red-700";

    case "HIGH":
      return "bg-orange-50 text-orange-700";

    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700";

    case "LOW":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function statusClass(status: string) {
  switch (status.toUpperCase()) {
    case "RESOLVED":
      return "bg-green-50 text-green-700";

    case "ACKNOWLEDGED":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function AlertTable({ data, loading }: AlertTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm text-slate-400">Loading alert report...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
        <AlertTriangle size={38} className="mx-auto text-slate-300" />

        <p className="mt-3 text-sm font-medium text-slate-600">
          No alert records found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          No network alerts match the selected filters.
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
                Alert
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Access Point
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Severity
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Metric
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Value
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Status
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Created
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {data.map((alert) => (
              <tr key={alert.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">{alert.title}</p>

                  <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
                    {alert.message}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {alert.access_point_name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {alert.building_name}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${severityClass(
                      alert.severity,
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-600">{alert.metric}</td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {alert.metric_value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Threshold: {alert.threshold_value}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                      alert.status,
                    )}`}
                  >
                    {alert.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-xs text-slate-500">
                  {new Date(alert.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
