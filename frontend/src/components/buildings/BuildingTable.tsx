"use client";

import Link from "next/link";
import { Building2, Eye, MapPin, Pencil, Trash2 } from "lucide-react";

import { Building } from "@/src/services/building.service";

interface BuildingTableProps {
  buildings: Building[];
  loading: boolean;
  onEdit: (building: Building) => void;
  onDelete: (building: Building) => void;
}

export default function BuildingTable({
  buildings,
  loading,
  onEdit,
  onDelete,
}: BuildingTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-sm text-slate-400">Loading buildings...</p>
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
        <Building2 size={38} className="mx-auto text-slate-300" />

        <p className="mt-3 font-medium text-slate-600">No buildings found</p>

        <p className="mt-1 text-sm text-slate-400">
          Add a building to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Building
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Location
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Description
              </th>

              <th className="px-6 py-4 text-right font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {buildings.map((building) => (
              <tr key={building.id} className="hover:bg-slate-50 transition">
                {/* Building */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Building2 size={19} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {building.name}
                      </p>

                      {building.campus_name && (
                        <p className="text-xs text-slate-400">
                          {building.campus_name}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Location */}
                <td className="px-6 py-4">
                  {building.location ? (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin size={16} className="text-slate-400" />

                      {building.location}
                    </div>
                  ) : (
                    <span className="text-slate-400">Not specified</span>
                  )}
                </td>

                {/* Description */}
                <td className="px-6 py-4 max-w-md">
                  <p className="truncate text-slate-500">
                    {building.description || "No description"}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/buildings/${building.id}`}
                      title="View building"
                      className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </Link>

                    <button
                      onClick={() => onEdit(building)}
                      title="Edit building"
                      className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => onDelete(building)}
                      title="Delete building"
                      className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
