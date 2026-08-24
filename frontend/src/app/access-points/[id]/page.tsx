"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, Globe, Radio, Wifi } from "lucide-react";

import AdminLayout from "@/src/components/admin/AdminLayout";

import {
  AccessPoint,
  getAccessPoint,
} from "@/src/services/accessPoint.service";

function getStatusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "ONLINE":
      return "bg-green-50 text-green-700";

    case "MAINTENANCE":
      return "bg-yellow-50 text-yellow-700";

    default:
      return "bg-red-50 text-red-700";
  }
}

export default function AccessPointDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [accessPoint, setAccessPoint] = useState<AccessPoint | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccessPoint() {
      try {
        const { id } = await params;

        const data = await getAccessPoint(id);

        setAccessPoint(data);
      } catch (error) {
        console.error("Failed to load access point:", error);

        setError("Unable to load access point.");
      } finally {
        setLoading(false);
      }
    }

    loadAccessPoint();
  }, [params]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">Loading access point...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !accessPoint) {
    return (
      <AdminLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || "Access point not found."}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Back */}
      <Link
        href={`/buildings/${accessPoint.building_id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={17} />
        Back to {accessPoint.building_name || "Building"}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Radio size={27} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {accessPoint.campus_name || "Campus"}
                {" / "}
                {accessPoint.building_name || "Building"}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {accessPoint.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                    accessPoint.status,
                  )}`}
                >
                  {accessPoint.status}
                </span>

                <span className="text-sm text-slate-500">
                  {accessPoint.ssid}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">
            Network Configuration
          </h2>

          <div className="mt-5 space-y-4">
            <InfoRow label="MAC Address" value={accessPoint.mac_address} />

            <InfoRow
              label="IP Address"
              value={accessPoint.ip_address || "Not assigned"}
            />

            <InfoRow label="SSID" value={accessPoint.ssid} />

            <InfoRow
              label="Channel"
              value={
                accessPoint.channel !== null
                  ? String(accessPoint.channel)
                  : "Not configured"
              }
            />

            <InfoRow
              label="Frequency"
              value={accessPoint.frequency || "Not configured"}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">
            Location & Installation
          </h2>

          <div className="mt-5 space-y-4">
            <InfoRow
              label="Latitude"
              value={
                accessPoint.latitude !== null
                  ? String(accessPoint.latitude)
                  : "Not available"
              }
            />

            <InfoRow
              label="Longitude"
              value={
                accessPoint.longitude !== null
                  ? String(accessPoint.longitude)
                  : "Not available"
              }
            />

            <InfoRow
              label="Installed"
              value={
                accessPoint.installed_at
                  ? new Date(accessPoint.installed_at).toLocaleDateString()
                  : "Not recorded"
              }
            />
          </div>
        </div>
      </div>

      {/* Monitoring */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Network Monitoring</h2>

            <p className="text-sm text-slate-500">
              Performance measurements for this access point.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-slate-300 py-14 text-center">
          <Wifi size={34} className="mx-auto text-slate-300" />

          <p className="mt-3 text-sm text-slate-500">
            No monitoring data displayed yet.
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Network metrics will be connected to this access point in the
            monitoring module.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-sm font-medium text-slate-800 text-right">
        {value}
      </span>
    </div>
  );
}
