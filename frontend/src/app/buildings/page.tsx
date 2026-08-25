"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Building2 } from "lucide-react";
import AdminLayout from "@/src/components/admin/AdminLayout";
import BuildingModal from "@/src/components/buildings/BuildingModal";
import BuildingTable from "@/src/components/buildings/BuildingTable";

import {
  Building,
  BuildingPayload,
  BuildingUpdatePayload,
  createBuilding,
  deleteBuilding,
  getBuildings,
  updateBuilding,
} from "@/src/services/building.service";

import { Campus, getCampuses } from "@/src/services/campus.service";

// Default export just wraps the real page in Suspense
export default function BuildingsPage() {
  return (
    <Suspense fallback={null}>
      <BuildingsPageContent />
    </Suspense>
  );
}

// Everything that was in your old component moves in here, unchanged
function BuildingsPageContent() {
  const searchParams = useSearchParams();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const initialCampusId = searchParams.get("campusId") || "";
  const [selectedCampusId, setSelectedCampusId] = useState(initialCampusId);
  const [loading, setLoading] = useState(true);
  const [campusesLoading, setCampusesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );

  async function loadCampuses() {
    try {
      setCampusesLoading(true);

      const data = await getCampuses();

      setCampuses(data);
    } catch (error) {
      console.error("Failed to load campuses:", error);

      setError("Unable to load campuses.");
    } finally {
      setCampusesLoading(false);
    }
  }

  async function loadBuildings() {
    try {
      setLoading(true);
      setError("");

      const data = await getBuildings(selectedCampusId || undefined);

      setBuildings(data);
    } catch (error) {
      console.error("Failed to load buildings:", error);

      setError("Unable to load buildings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampuses();
  }, []);

  useEffect(() => {
    loadBuildings();
  }, [selectedCampusId]);

  useEffect(() => {
    const campusId = searchParams.get("campusId");

    if (campusId) {
      setSelectedCampusId(campusId);
    }
  }, [searchParams]);

  function handleAdd() {
    if (!selectedCampusId) {
      setError("Please select a campus before adding a building.");
      return;
    }

    setSelectedBuilding(null);
    setModalOpen(true);
    setError("");
  }

  function handleEdit(building: Building) {
    setSelectedBuilding(building);
    setModalOpen(true);
    setError("");
  }

  function handleCloseModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedBuilding(null);
  }

  async function handleSubmit(
    payload: BuildingPayload | BuildingUpdatePayload,
  ) {
    try {
      setSaving(true);
      setError("");

      if (selectedBuilding) {
        const updated = await updateBuilding(
          selectedBuilding.id,
          payload as BuildingUpdatePayload,
        );

        setBuildings((current) =>
          current.map((building) =>
            building.id === updated.id
              ? {
                  ...building,
                  ...updated,
                  campus_name: building.campus_name,
                }
              : building,
          ),
        );
      } else {
        const created = await createBuilding(payload as BuildingPayload);

        setBuildings((current) =>
          [...current, created].sort((a, b) => a.name.localeCompare(b.name)),
        );
      }

      setModalOpen(false);
      setSelectedBuilding(null);
    } catch (error: any) {
      console.error("Failed to save building:", error);

      setError(error?.response?.data?.message || "Unable to save building.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(building: Building) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${building.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteBuilding(building.id);

      setBuildings((current) =>
        current.filter((item) => item.id !== building.id),
      );
    } catch (error: any) {
      console.error("Failed to delete building:", error);

      setError(error?.response?.data?.message || "Unable to delete building.");
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Buildings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage buildings within university campuses.
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={campusesLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          <Plus size={18} />
          Add Building
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Filter by Campus
            </label>

            <p className="text-xs text-slate-400 mt-1">
              Select a campus to view its buildings.
            </p>
          </div>

          <select
            value={selectedCampusId}
            onChange={(event) => setSelectedCampusId(event.target.value)}
            className="sm:ml-auto w-full sm:w-72 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
          >
            <option value="">All Campuses</option>

            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                {selectedCampusId ? "Campus Buildings" : "Total Buildings"}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {loading ? "..." : buildings.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Buildings */}
      <BuildingTable
        buildings={buildings}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal */}
      <BuildingModal
        open={modalOpen}
        campusId={selectedCampusId}
        building={selectedBuilding}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
