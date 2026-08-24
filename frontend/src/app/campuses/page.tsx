"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Eye,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import AdminLayout from "@/src/components/admin/AdminLayout";

import CampusModal from "@/src/components/campuses/CampusModal";

import {
  Campus,
  CampusPayload,
  createCampus,
  deleteCampus,
  getCampuses,
  updateCampus,
} from "@/src/services/campus.service";

export default function CampusesPage() {
  const [campuses, setCampuses] = useState<Campus[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);

  async function loadCampuses() {
    try {
      setLoading(true);
      setError("");

      const data = await getCampuses();

      setCampuses(data);
    } catch (error) {
      console.error("Failed to load campuses:", error);

      setError("Unable to load campuses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampuses();
  }, []);

  function handleAdd() {
    setSelectedCampus(null);
    setModalOpen(true);
  }

  function handleEdit(campus: Campus) {
    setSelectedCampus(campus);
    setModalOpen(true);
  }

  function handleCloseModal() {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedCampus(null);
  }

  async function handleSubmit(payload: CampusPayload) {
    try {
      setSaving(true);
      setError("");

      if (selectedCampus) {
        const updated = await updateCampus(selectedCampus.id, payload);

        setCampuses((current) =>
          current.map((campus) =>
            campus.id === updated.id ? updated : campus,
          ),
        );
      } else {
        const created = await createCampus(payload);

        setCampuses((current) => [created, ...current]);
      }

      setModalOpen(false);
      setSelectedCampus(null);
    } catch (error: any) {
      console.error("Failed to save campus:", error);

      throw new Error(
        error?.response?.data?.message || "Unable to save campus.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(campus: Campus) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${campus.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteCampus(campus.id);

      setCampuses((current) => current.filter((item) => item.id !== campus.id));
    } catch (error: any) {
      console.error("Failed to delete campus:", error);

      setError(error?.response?.data?.message || "Unable to delete campus.");
    }
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Campuses
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage university campuses and their locations.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Campus
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Campuses</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {loading ? "..." : campuses.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Infrastructure</p>

          <p className="mt-2 text-sm text-slate-600">
            Manage campuses, buildings and access points from one place.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Campus
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Location
                </th>

                <th className="text-left px-6 py-4 font-semibold text-slate-600">
                  Description
                </th>

                <th className="text-right px-6 py-4 font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <Loader2
                      size={25}
                      className="mx-auto animate-spin text-blue-600"
                    />

                    <p className="mt-3 text-sm text-slate-400">
                      Loading campuses...
                    </p>
                  </td>
                </tr>
              ) : campuses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <Building2 size={36} className="mx-auto text-slate-300" />

                    <p className="mt-3 text-sm font-medium text-slate-600">
                      No campuses found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Create your first campus to get started.
                    </p>

                    <button
                      onClick={handleAdd}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      <Plus size={16} />
                      Add Campus
                    </button>
                  </td>
                </tr>
              ) : (
                campuses.map((campus) => (
                  <tr key={campus.id} className="hover:bg-slate-50 transition">
                    {/* Campus */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Building2 size={19} />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {campus.name}
                          </p>

                          <p className="text-xs text-slate-400">Campus</p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <MapPin size={16} className="text-slate-400" />

                        {campus.location}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 max-w-md">
                      <p className="truncate text-slate-500">
                        {campus.description || "No description"}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/campuses/${campus.id}`}
                          title="View campus"
                          className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </Link>

                        <button
                          onClick={() => handleEdit(campus)}
                          title="Edit campus"
                          className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(campus)}
                          title="Delete campus"
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <CampusModal
        open={modalOpen}
        campus={selectedCampus}
        loading={saving}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
