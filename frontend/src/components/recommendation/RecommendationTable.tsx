"use client";

import { CheckCircle2, Lightbulb } from "lucide-react";

import { NetworkRecommendation } from "@/src/services/recommendation.service";

interface RecommendationTableProps {
  recommendations: NetworkRecommendation[];
  loading: boolean;
}

function priorityStyle(priority: NetworkRecommendation["priority"]) {
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

function statusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "IMPLEMENTED":
      return "bg-green-50 text-green-700";

    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function RecommendationTable({
  recommendations,
  loading,
}: RecommendationTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-sm text-slate-400">Loading recommendations...</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
        <Lightbulb size={40} className="mx-auto text-slate-300" />

        <p className="mt-3 font-medium text-slate-600">
          No recommendations found
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Generate recommendations from the latest network performance metrics.
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
            {recommendations.map((recommendation) => (
              <tr key={recommendation.id} className="hover:bg-slate-50">
                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Lightbulb size={18} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
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

                  <p className="text-xs text-slate-400">
                    {recommendation.building_name}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle(
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
                    {recommendation.recommended_value !== null && (
                      <>
                        {" | "}
                        Recommended: {recommendation.recommended_value}
                      </>
                    )}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(
                      recommendation.status,
                    )}`}
                  >
                    {recommendation.status === "IMPLEMENTED" && (
                      <CheckCircle2 size={13} />
                    )}

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
