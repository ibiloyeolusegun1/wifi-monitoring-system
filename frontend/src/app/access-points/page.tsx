"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Radio } from "lucide-react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import AccessPointModal from "@/src/components/access-points/AccessPointModal";
import AccessPointTable from "@/src/components/access-points/AccessPointTable";

import {
  AccessPoint,
  AccessPointPayload,
  AccessPointUpdatePayload,
  createAccessPoint,
  deleteAccessPoint,
  getAccessPoints,
  updateAccessPoint,
} from "@/src/services/accessPoint.service";

import { Building, getBuildings } from "@/src/services/building.service";

// Default export just wraps the real page in Suspense
export default function AccessPointsPage() {
  return (
    <Suspense fallback={null}>
      <AccessPointsPageContent />
    </Suspense>
  );
}

// Everything that was in your old component moves in here, unchanged
function AccessPointsPageContent() {
  const searchParams = useSearchParams();
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [buildingsLoading, setBuildingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccessPoint, setSelectedAccessPoint] =
    useState<AccessPoint | null>(null);

  async function loadBuildings() {
    try {
      setBuildingsLoading(true);

      const data = await getBuildings();

      setBuildings(data);
    } catch (error) {
      console.error("Failed to load buildings:", error);

      setError("Unable to load buildings.");
    } finally {
      setBuildingsLoading(false);
    }
  }

  async function loadAccessPoints() {
    try {
      setLoading(true);
      setError("");

      const data = await getAccessPoints(
        selectedBuildingId || undefined,
        selectedStatus || undefined,
      );

      setAccessPoints(data);
    } catch (error) {
      console.error("Failed to load access points:", error);

      setError("Unable to load access points.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBuildings();
  }, []);

  useEffect(() => {
    loadAccessPoints();
  }, [selectedBuildingId, selectedStatus]);

  useEffect(() => {
    const buildingId = searchParams.get("buildingId");

    if (buildingId) {
      setSelectedBuildingId(buildingId);
    }
  }, [searchParams]);

  function handleAdd() {
    if (!selectedBuildingId) {
      setError("Please select a building before adding an access point.");
      return;
    }

    setSelectedAccessPoint(null);
    setModalOpen(true);
    setError("");
  }

  function handleEdit(accessPoint: AccessPoint) {
    setSelectedAccessPoint(accessPoint);
    setModalOpen(true);
    setError("");
  }

  function handleCloseModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedAccessPoint(null);
  }

  async function handleSubmit(
    payload: AccessPointPayload | AccessPointUpdatePayload,
  ) {
    try {
      setSaving(true);
      setError("");

      if (selectedAccessPoint) {
        const updated = await updateAccessPoint(
          selectedAccessPoint.id,
          payload as AccessPointUpdatePayload,
        );

        setAccessPoints((current) =>
          current.map((item) =>
            item.id === updated.id
              ? {
                  ...item,
                  ...updated,
                  building_name: item.building_name,
                  campus_name: item.campus_name,
                }
              : item,
          ),
        );
      } else {
        const created = await createAccessPoint(payload as AccessPointPayload);

        setAccessPoints((current) => [...current, created]);
      }

      setModalOpen(false);
      setSelectedAccessPoint(null);
    } catch (error: any) {
      console.error("Failed to save access point:", error);

      setError(
        error?.response?.data?.message || "Unable to save access point.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(accessPoint: AccessPoint) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${accessPoint.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteAccessPoint(accessPoint.id);

      setAccessPoints((current) =>
        current.filter((item) => item.id !== accessPoint.id),
      );
    } catch (error: any) {
      console.error("Failed to delete access point:", error);

      setError(
        error?.response?.data?.message || "Unable to delete access point.",
      );
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Access Points
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage Wi-Fi access points across university buildings.
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={buildingsLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          <Plus size={18} />
          Add Access Point
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Building */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Filter by Building
            </label>

            <select
              value={selectedBuildingId}
              onChange={(event) => setSelectedBuildingId(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">All Buildings</option>

              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.campus_name
                    ? `${building.campus_name} — ${building.name}`
                    : building.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Filter by Status
            </label>

            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">All Statuses</option>

              <option value="ONLINE">Online</option>

              <option value="OFFLINE">Offline</option>

              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Radio size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">Access Points</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading ? "..." : accessPoints.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <AccessPointTable
        accessPoints={accessPoints}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <AccessPointModal
        open={modalOpen}
        buildingId={selectedBuildingId}
        accessPoint={selectedAccessPoint}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
