"use client";

import { AlertTriangle, Clock } from "lucide-react";

import { NetworkAlert } from "@/src/services/alert.service";

interface AlertTableProps {
  alerts: NetworkAlert[];
  loading: boolean;
}

function severityStyle(severity: NetworkAlert["severity"]) {
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

function statusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "RESOLVED":
      return "bg-green-50 text-green-700";

    case "ACKNOWLEDGED":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-red-50 text-red-700";
  }
}

export default function AlertTable({ alerts, loading }: AlertTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-sm text-slate-400">Loading alerts...</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
        <AlertTriangle size={40} className="mx-auto text-slate-300" />

        <p className="mt-3 font-medium text-slate-600">No alerts found</p>

        <p className="mt-1 text-sm text-slate-400">
          The selected access point has no recorded alerts.
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
                Status
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Created
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <AlertTriangle size={18} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {alert.title}
                      </p>

                      <p className="mt-1 max-w-md text-xs text-slate-400">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {alert.access_point_name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {alert.building_name}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${severityStyle(
                      alert.severity,
                    )}`}
                  >
                    {alert.severity}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <p className="text-slate-700">{alert.metric}</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Value: {alert.metric_value}
                    {" | "}
                    Threshold: {alert.threshold_value}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(
                      alert.status,
                    )}`}
                  >
                    {alert.status}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />

                    {new Date(alert.created_at).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
