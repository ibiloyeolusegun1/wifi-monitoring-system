"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  FileText,
  Lightbulb,
  Printer,
  RefreshCw,
} from "lucide-react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import {
  AccessPoint,
  getAccessPoints,
} from "@/src/services/accessPoint.service";
import {
  AlertReport,
  PerformanceReport,
  RecommendationReport,
  getAlertReport,
  getPerformanceReport,
  getRecommendationReport,
} from "@/src/services/report.service";
import PerformanceTable from "@/src/components/reports/PerformanceTable";
import AlertTable from "@/src/components/reports/AlertTable";
import RecommendationTable from "@/src/components/reports/RecommendationTable";
import ReportHeader from "@/src/components/reports/ReportHeader";

type ReportType = "performance" | "alerts" | "recommendations";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("performance");
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [performance, setPerformance] = useState<PerformanceReport[]>([]);
  const [alerts, setAlerts] = useState<AlertReport[]>([]);
  const [recommendations, setRecommendations] = useState<
    RecommendationReport[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccessPoints() {
      try {
        const data = await getAccessPoints();

        setAccessPoints(data);
      } catch (error) {
        console.error("Failed to load access points:", error);
      }
    }

    loadAccessPoints();
  }, []);

  async function generateReport() {
    try {
      setLoading(true);
      setError("");

      const filters = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        accessPointId: selectedAccessPoint || undefined,
      };

      if (reportType === "performance") {
        const data = await getPerformanceReport(filters);

        setPerformance(data);
      }

      if (reportType === "alerts") {
        const data = await getAlertReport(filters);

        setAlerts(data);
      }

      if (reportType === "recommendations") {
        const data = await getRecommendationReport(filters);

        setRecommendations(data);
      }
    } catch (error: any) {
      console.error("Failed to generate report:", error);

      setError(error?.response?.data?.message || "Unable to generate report.");
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setStartDate("");
    setEndDate("");
    setSelectedAccessPoint("");
  }

  const reportCount = useMemo(() => {
    if (reportType === "performance") {
      return performance.length;
    }

    if (reportType === "alerts") {
      return alerts.length;
    }

    return recommendations.length;
  }, [reportType, performance, alerts, recommendations]);

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Reports
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Generate and review Wi-Fi network performance reports.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={generateReport}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />

              {loading ? "Generating..." : "Generate Report"}
            </button>
            <button
              onClick={() => window.print()}
              disabled={loading || reportCount === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Printer size={17} />
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Report Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(event) =>
                setReportType(event.target.value as ReportType)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="performance">Performance Report</option>

              <option value="alerts">Alert Report</option>

              <option value="recommendations">Recommendation Report</option>
            </select>
          </div>

          {/* Access Point */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Access Point
            </label>

            <select
              value={selectedAccessPoint}
              onChange={(event) => setSelectedAccessPoint(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
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

          {/* Start Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="report-summary mb-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <ReportCard
          title="Report Records"
          value={reportCount}
          icon={FileText}
          iconClass="bg-blue-50 text-blue-600"
        />

        <ReportCard
          title="Performance"
          value={performance.length}
          icon={Activity}
          iconClass="bg-green-50 text-green-600"
        />

        <ReportCard
          title="Alerts"
          value={alerts.length}
          icon={AlertTriangle}
          iconClass="bg-red-50 text-red-600"
        />

        <ReportCard
          title="Recommendations"
          value={recommendations.length}
          icon={Lightbulb}
          iconClass="bg-indigo-50 text-indigo-600"
        />
      </div>

      {/* Report */}
      <div className="report-content">
        <ReportHeader
          title={
            reportType === "performance"
              ? "Network Performance Report"
              : reportType === "alerts"
                ? "Network Alert Report"
                : "Network Recommendation Report"
          }
          subtitle="University Wi-Fi Network Monitoring and Analysis"
          startDate={startDate}
          endDate={endDate}
        />

        {reportType === "performance" && (
          <PerformanceTable data={performance} loading={loading} />
        )}

        {reportType === "alerts" && (
          <AlertTable data={alerts} loading={loading} />
        )}

        {reportType === "recommendations" && (
          <RecommendationTable data={recommendations} loading={loading} />
        )}
      </div>
    </AdminLayout>
  );
}

function ReportCard({
  title,
  value,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: typeof FileText;
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
