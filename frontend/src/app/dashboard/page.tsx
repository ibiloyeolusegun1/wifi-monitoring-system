"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Gauge, Wifi, Lightbulb, } from "lucide-react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import {
  DashboardSummary,
  RecentPerformance,
  getDashboardSummary,
  getRecentPerformance,
} from "@/src/services/dashboard.service";
import MonitoringChart from "@/src/components/monitoring/MonitoringChart";
import { NetworkAlert, getAlerts } from "@/src/services/alert.service";
import {
  NetworkRecommendation,
  getRecommendations,
} from "@/src/services/recommendation.service";

const cards = [
  {
    key: "totalAccessPoints",
    title: "Total Access Points",
    description: "Registered access points",
    icon: Wifi,
    iconClass: "bg-blue-50 text-blue-600",
  },
  {
    key: "onlineAccessPoints",
    title: "Online Access Points",
    description: "Currently operational",
    icon: Activity,
    iconClass: "bg-green-50 text-green-600",
  },
  {
    key: "criticalAlerts",
    title: "Critical Alerts",
    description: "Require attention",
    icon: AlertTriangle,
    iconClass: "bg-red-50 text-red-600",
  },
  {
    key: "networkAvailability",
    title: "Network Availability",
    description: "Overall availability",
    icon: Gauge,
    iconClass: "bg-purple-50 text-purple-600",
  },
] as const;

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [performance, setPerformance] = useState<RecentPerformance[]>([]);
  const [alerts, setAlerts] = useState<NetworkAlert[]>([]);
  const [recommendations, setRecommendations] = useState<
    NetworkRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [summaryData, performanceData, alertsData, recommendationsData] =
          await Promise.all([
            getDashboardSummary(),
            getRecentPerformance(),
            getAlerts(),
            getRecommendations(),
          ]);

        setSummary(summaryData);
        setPerformance(performanceData);
        setAlerts(alertsData.slice(0, 5));
        setRecommendations(recommendationsData.slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        setError("Unable to load dashboard information.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const chartData = useMemo(() => {
    return performance.map((item) => ({
      id: item.recorded_at,
      access_point_id: "",
      access_point_name: "Network",
      building_name: "",
      campus_name: "",

      signal_strength: item.signal_strength,

      throughput: item.throughput,

      latency: item.latency,

      packet_loss: item.packet_loss,

      bandwidth_utilization: null,
      connected_users: null,
      access_point_utilization: null,
      network_availability: null,
      channel_utilization: null,

      recorded_at: item.recorded_at,
    }));
  }, [performance]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <p className="mt-3 text-sm text-slate-500">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor and manage your university Wi-Fi network.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;

          let value: string | number = "—";

          if (summary) {
            if (card.key === "networkAvailability") {
              value =
                summary.networkAvailability !== null
                  ? `${summary.networkAvailability}%`
                  : "—";
            } else {
              value = summary[card.key];
            }
          }

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {value}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Statistics */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MiniStat
          title="Offline Access Points"
          value={summary?.offlineAccessPoints ?? 0}
        />

        <MiniStat title="Total Alerts" value={summary?.totalAlerts ?? 0} />

        <MiniStat
          title="Pending Recommendations"
          value={summary?.pendingRecommendations ?? 0}
        />

        <MiniStat
          title="Average Latency"
          value={
            summary?.averageLatency !== null &&
            summary?.averageLatency !== undefined
              ? `${summary.averageLatency} ms`
              : "—"
          }
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Performance */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="font-semibold text-slate-900">
              Network Performance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recent Wi-Fi performance metrics
            </p>
          </div>

          <MonitoringChart metrics={chartData} />
        </div>

        {/* Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="font-semibold text-slate-900">Recent Alerts</h2>

            <p className="mt-1 text-sm text-slate-500">Latest network issues</p>
          </div>

          {alerts.length === 0 ? (
            <div className="py-16 text-center">
              <AlertTriangle size={32} className="mx-auto text-slate-300" />

              <p className="mt-3 text-sm text-slate-400">No recent alerts</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        alert.severity === "CRITICAL"
                          ? "bg-red-50 text-red-600"
                          : alert.severity === "HIGH"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-yellow-50 text-yellow-600"
                      }`}
                    >
                      <AlertTriangle size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800">
                        {alert.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {alert.access_point_name}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Recommendations */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Recommendations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest network optimization recommendations.
            </p>
          </div>

          <a
            href="/recommendations"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </a>
        </div>

        {recommendations.length === 0 ? (
          <div className="py-12 text-center">
            <Lightbulb size={32} className="mx-auto text-slate-300" />

            <p className="mt-3 text-sm text-slate-400">
              No recommendations available.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-200 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                      <Lightbulb size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {recommendation.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {recommendation.access_point_name}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      recommendation.priority === "CRITICAL"
                        ? "bg-red-50 text-red-700"
                        : recommendation.priority === "HIGH"
                          ? "bg-orange-50 text-orange-700"
                          : recommendation.priority === "MEDIUM"
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {recommendation.priority}
                  </span>
                </div>

                <p className="mt-4 text-xs leading-5 text-slate-500">
                  {recommendation.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-400">
                    {recommendation.metric}
                  </span>

                  <span className="text-xs font-medium text-slate-600">
                    {recommendation.metric_value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function MiniStat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
