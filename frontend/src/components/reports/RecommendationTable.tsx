"use client";

import { Lightbulb } from "lucide-react";
import { RecommendationReport } from "@/src/services/report.service";

interface RecommendationTableProps {
  data: RecommendationReport[];
  loading: boolean;
}

function priorityClass(priority: string) {
  switch (priority) {
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
    case "IMPLEMENTED":
      return "bg-green-50 text-green-700";

    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700";

    case "PENDING":
      return "bg-yellow-50 text-yellow-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function RecommendationTable({
  data,
  loading,
}: RecommendationTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="text-sm text-slate-400">
          Loading recommendation report...
        </p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center shadow-sm">
        <Lightbulb size={38} className="mx-auto text-slate-300" />

        <p className="mt-3 text-sm font-medium text-slate-600">
          No recommendation records found
        </p>

        <p className="mt-1 text-xs text-slate-400">
          No recommendations match the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Recommendation
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Access Point
              </th>

              <th className="px-5 py-4 text-left font-semibold text-slate-600">
                Priority
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
            {data.map((recommendation) => (
              <tr key={recommendation.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Lightbulb size={17} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-800">
                        {recommendation.title}
                      </p>

                      <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
                        {recommendation.description}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-700">
                    {recommendation.access_point_name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {recommendation.building_name}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityClass(
                      recommendation.priority,
                    )}`}
                  >
                    {recommendation.priority}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <p className="text-slate-700">{recommendation.metric}</p>

                  <p className="mt-1 text-xs text-slate-400">
                    Current: {recommendation.metric_value}
                  </p>

                  {recommendation.recommended_value !== null && (
                    <p className="mt-1 text-xs text-slate-400">
                      Recommended: {recommendation.recommended_value}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                      recommendation.status,
                    )}`}
                  >
                    {recommendation.status}
                  </span>
                </td>

                <td className="px-5 py-4 text-xs text-slate-500">
                  {new Date(recommendation.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
