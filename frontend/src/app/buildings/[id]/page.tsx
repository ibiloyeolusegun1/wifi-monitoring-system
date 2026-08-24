"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Plus, Wifi } from "lucide-react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import { Building, getBuilding } from "@/src/services/building.service";
import {
  AccessPoint,
  getAccessPoints,
} from "@/src/services/accessPoint.service";

export default function BuildingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [building, setBuilding] = useState<Building | null>(null);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBuilding() {
      try {
        const { id } = await params;

        // Load building and access points together
        const [buildingData, accessPointData] = await Promise.all([
          getBuilding(id),
          getAccessPoints(id),
        ]);

        setBuilding(buildingData);
        setAccessPoints(accessPointData);
      } catch (error) {
        console.error("Failed to load building:", error);

        setError("Unable to load building information.");
      } finally {
        setLoading(false);
      }
    }

    loadBuilding();
  }, [params]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">Loading building...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !building) {
    return (
      <AdminLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || "Building not found."}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Back */}
      <Link
        href={`/campuses/${building.campus_id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={17} />
        Back to {building.campus_name || "Campus"}
      </Link>

      {/* Building Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 size={27} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {building.campus_name || "Campus"}
              </p>

              <h1 className="mt-1 text-2xl font-bold text-slate-900">
                {building.name}
              </h1>

              {building.location && (
                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <MapPin size={16} />

                  {building.location}
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/access-points?buildingId=${building.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Access Point
          </Link>
        </div>

        {building.description && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm leading-6 text-slate-600">
              {building.description}
            </p>
          </div>
        )}
      </div>

      {/* Access Points */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-semibold text-slate-900">Access Points</h2>

            <p className="text-sm text-slate-500 mt-1">
              Wi-Fi access points installed in this building.
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {accessPoints.length}{" "}
            {accessPoints.length === 1 ? "Access Point" : "Access Points"}
          </span>
        </div>

        {accessPoints.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-14 text-center">
            <Wifi size={34} className="mx-auto text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">
              No access points have been added yet.
            </p>

            <Link
              href={`/access-points?buildingId=${building.id}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Access Point
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {accessPoints.map((accessPoint) => (
              <Link
                key={accessPoint.id}
                href={`/access-points/${accessPoint.id}`}
                className="rounded-xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Wifi size={19} />
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      accessPoint.status === "ONLINE"
                        ? "bg-green-50 text-green-700"
                        : accessPoint.status === "MAINTENANCE"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-red-50 text-red-700"
                    }`}
                  >
                    {accessPoint.status}
                  </span>
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {accessPoint.name}
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  {accessPoint.ssid}
                </p>

                <div className="mt-4 space-y-2">
                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-600">IP:</span>{" "}
                    {accessPoint.ip_address || "No IP address"}
                  </p>

                  <p className="text-sm text-slate-500">
                    <span className="font-medium text-slate-600">MAC:</span>{" "}
                    {accessPoint.mac_address}
                  </p>

                  {accessPoint.channel !== null &&
                    accessPoint.channel !== undefined && (
                      <p className="text-sm text-slate-500">
                        <span className="font-medium text-slate-600">
                          Channel:
                        </span>{" "}
                        {accessPoint.channel}
                      </p>
                    )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
