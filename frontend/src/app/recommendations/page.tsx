"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import {
  AccessPoint,
  getAccessPoints,
} from "@/src/services/accessPoint.service";
import {
  NetworkRecommendation,
  generateRecommendations,
  getRecommendations,
} from "@/src/services/recommendation.service";
import RecommendationTable from "@/src/components/recommendation/RecommendationTable";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<
    NetworkRecommendation[]
  >([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function loadAccessPoints() {
    try {
      const data = await getAccessPoints();

      setAccessPoints(data);
    } catch (error) {
      console.error("Failed to load access points:", error);
    }
  }

  async function loadRecommendations() {
    try {
      setLoading(true);
      setError("");

      const data = await getRecommendations(selectedAccessPoint || undefined);

      setRecommendations(data);
    } catch (error) {
      console.error("Failed to load recommendations:", error);

      setError("Unable to load recommendations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccessPoints();
  }, []);

  useEffect(() => {
    loadRecommendations();
  }, [selectedAccessPoint]);

  async function handleGenerateRecommendations() {
    if (!selectedAccessPoint) {
      setError(
        "Please select an access point before generating recommendations.",
      );

      return;
    }

    try {
      setGenerating(true);
      setError("");

      await generateRecommendations(selectedAccessPoint);

      await loadRecommendations();
    } catch (error: any) {
      console.error("Failed to generate recommendations:", error);

      setError(
        error?.response?.data?.message || "Unable to generate recommendations.",
      );
    } finally {
      setGenerating(false);
    }
  }

  const summary = useMemo(() => {
    return {
      total: recommendations.length,

      critical: recommendations.filter((item) => item.priority === "CRITICAL")
        .length,

      high: recommendations.filter((item) => item.priority === "HIGH").length,

      implemented: recommendations.filter(
        (item) => item.status === "IMPLEMENTED",
      ).length,
    };
  }, [recommendations]);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Recommendations
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Optimization recommendations based on Wi-Fi network performance.
          </p>
        </div>

        <button
          onClick={handleGenerateRecommendations}
          disabled={generating || !selectedAccessPoint}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          <RefreshCw size={17} className={generating ? "animate-spin" : ""} />

          {generating ? "Generating..." : "Generate Recommendations"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Access Point Filter */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Access Point
        </label>

        <select
          value={selectedAccessPoint}
          onChange={(event) => setSelectedAccessPoint(event.target.value)}
          className="w-full md:max-w-lg rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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

        <p className="mt-2 text-xs text-slate-400">
          Select an access point to generate recommendations from its latest
          network metrics.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <RecommendationCard
          title="Total Recommendations"
          value={summary.total}
          icon={Lightbulb}
          className="bg-indigo-50 text-indigo-600"
        />

        <RecommendationCard
          title="Critical"
          value={summary.critical}
          icon={AlertTriangle}
          className="bg-red-50 text-red-600"
        />

        <RecommendationCard
          title="High Priority"
          value={summary.high}
          icon={AlertTriangle}
          className="bg-orange-50 text-orange-600"
        />

        <RecommendationCard
          title="Implemented"
          value={summary.implemented}
          icon={CheckCircle2}
          className="bg-green-50 text-green-600"
        />
      </div>

      {/* Recommendations */}
      <RecommendationTable
        recommendations={recommendations}
        loading={loading}
      />
    </AdminLayout>
  );
}

function RecommendationCard({
  title,
  value,
  icon: Icon,
  className,
}: {
  title: string;
  value: number;
  icon: typeof Lightbulb;
  className: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
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
