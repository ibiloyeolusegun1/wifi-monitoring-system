"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Eye, MapPin, Plus } from "lucide-react";

import AdminLayout from "@/src/components/admin/AdminLayout";

import { Campus, getCampus } from "@/src/services/campus.service";

import { Building, getBuildings } from "@/src/services/building.service";

export default function CampusDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [campus, setCampus] = useState<Campus | null>(null);

  const [buildings, setBuildings] = useState<Building[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [campusId, setCampusId] = useState("");

  useEffect(() => {
    async function loadCampus() {
      try {
        const { id } = await params;

        setCampusId(id);

        const [campusData, buildingData] = await Promise.all([
          getCampus(id),
          getBuildings(id),
        ]);

        setCampus(campusData);
        setBuildings(buildingData);
      } catch (error) {
        console.error("Failed to load campus:", error);

        setError("Unable to load campus information.");
      } finally {
        setLoading(false);
      }
    }

    loadCampus();
  }, [params]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">Loading campus...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !campus) {
    return (
      <AdminLayout>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error || "Campus not found."}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Back */}
      <Link
        href="/campuses"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={17} />
        Back to Campuses
      </Link>

      {/* Campus Information */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 size={27} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {campus.name}
              </h1>

              <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                <MapPin size={16} />
                {campus.location}
              </div>
            </div>
          </div>

          <Link
            href={`/buildings?campusId=${campusId}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Building
          </Link>
        </div>

        {campus.description && (
          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm leading-6 text-slate-600">
              {campus.description}
            </p>
          </div>
        )}
      </div>

      {/* Buildings */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-slate-900">Campus Buildings</h2>

            <p className="text-sm text-slate-500 mt-1">
              Buildings associated with this campus.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {buildings.length}{" "}
            {buildings.length === 1 ? "Building" : "Buildings"}
          </span>
        </div>

        {buildings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 py-14 text-center">
            <Building2 size={32} className="mx-auto text-slate-300" />

            <p className="mt-3 text-sm text-slate-500">
              No buildings have been added yet.
            </p>

            <Link
              href={`/buildings?campusId=${campusId}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Building
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {buildings.map((building) => (
              <div
                key={building.id}
                className="rounded-xl border border-slate-200 p-5 hover:border-blue-200 hover:shadow-sm transition"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building2 size={19} />
                  </div>

                  <Link
                    href={`/buildings/${building.id}`}
                    className="p-2 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                    title="View building"
                  >
                    <Eye size={17} />
                  </Link>
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {building.name}
                </h3>

                {building.location && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                    <MapPin size={14} />

                    {building.location}
                  </div>
                )}

                <p className="mt-3 text-sm text-slate-500 line-clamp-2">
                  {building.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
