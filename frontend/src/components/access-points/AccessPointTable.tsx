"use client";

import Link from "next/link";
import { Eye, Pencil, Radio, Trash2 } from "lucide-react";

import { AccessPoint } from "@/src/services/accessPoint.service";

interface AccessPointTableProps {
  accessPoints: AccessPoint[];
  loading: boolean;
  onEdit: (accessPoint: AccessPoint) => void;
  onDelete: (accessPoint: AccessPoint) => void;
}

function statusStyle(status: string) {
  switch (status.toUpperCase()) {
    case "ONLINE":
      return "bg-green-50 text-green-700";

    case "MAINTENANCE":
      return "bg-yellow-50 text-yellow-700";

    case "OFFLINE":
    default:
      return "bg-red-50 text-red-700";
  }
}

export default function AccessPointTable({
  accessPoints,
  loading,
  onEdit,
  onDelete,
}: AccessPointTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-sm text-slate-400">Loading access points...</p>
      </div>
    );
  }

  if (accessPoints.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
        <Radio size={38} className="mx-auto text-slate-300" />

        <p className="mt-3 font-medium text-slate-600">
          No access points found
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Register an access point to get started.
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
                Access Point
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Campus / Building
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                SSID
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                IP Address
              </th>

              <th className="px-6 py-4 text-left font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-right font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {accessPoints.map((accessPoint) => (
              <tr key={accessPoint.id} className="hover:bg-slate-50 transition">
                {/* Access Point */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <Radio size={19} />
                    </div>

                    <div>
                      <p className="font-medium text-slate-900">
                        {accessPoint.name}
                      </p>

                      <p className="text-xs text-slate-400">
                        {accessPoint.mac_address}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Campus / Building */}
                <td className="px-6 py-4">
                  <p className="text-slate-700">
                    {accessPoint.campus_name || "—"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {accessPoint.building_name || "—"}
                  </p>
                </td>

                {/* SSID */}
                <td className="px-6 py-4 text-slate-600">{accessPoint.ssid}</td>

                {/* IP */}
                <td className="px-6 py-4 text-slate-600">
                  {accessPoint.ip_address || "Not assigned"}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle(
                      accessPoint.status,
                    )}`}
                  >
                    {accessPoint.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/access-points/${accessPoint.id}`}
                      title="View access point"
                      className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={17} />
                    </Link>

                    <button
                      onClick={() => onEdit(accessPoint)}
                      title="Edit access point"
                      className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      onClick={() => onDelete(accessPoint)}
                      title="Delete access point"
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
