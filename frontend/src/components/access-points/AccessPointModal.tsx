"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import {
  AccessPoint,
  AccessPointPayload,
  AccessPointUpdatePayload,
} from "@/src/services/accessPoint.service";

interface AccessPointModalProps {
  open: boolean;
  buildingId: string;
  accessPoint?: AccessPoint | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    data: AccessPointPayload | AccessPointUpdatePayload,
  ) => Promise<void>;
}

const statuses = ["ONLINE", "OFFLINE"];

export default function AccessPointModal({
  open,
  buildingId,
  accessPoint,
  loading = false,
  onClose,
  onSubmit,
}: AccessPointModalProps) {
  const [name, setName] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [ssid, setSsid] = useState("");
  const [channel, setChannel] = useState("");
  const [frequency, setFrequency] = useState("");
  const [status, setStatus] = useState("OFFLINE");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [installedAt, setInstalledAt] = useState("");

  const [error, setError] = useState("");

  const editing = Boolean(accessPoint);

  useEffect(() => {
    if (accessPoint) {
      setName(accessPoint.name);
      setMacAddress(accessPoint.mac_address);
      setIpAddress(accessPoint.ip_address || "");
      setSsid(accessPoint.ssid);
      setChannel(
        accessPoint.channel !== null && accessPoint.channel !== undefined
          ? String(accessPoint.channel)
          : "",
      );
      setFrequency(accessPoint.frequency || "");
      setStatus(accessPoint.status || "OFFLINE");
      setLatitude(
        accessPoint.latitude !== null && accessPoint.latitude !== undefined
          ? String(accessPoint.latitude)
          : "",
      );
      setLongitude(
        accessPoint.longitude !== null && accessPoint.longitude !== undefined
          ? String(accessPoint.longitude)
          : "",
      );
      setInstalledAt(
        accessPoint.installed_at ? accessPoint.installed_at.slice(0, 16) : "",
      );
    } else {
      setName("");
      setMacAddress("");
      setIpAddress("");
      setSsid("");
      setChannel("");
      setFrequency("");
      setStatus("OFFLINE");
      setLatitude("");
      setLongitude("");
      setInstalledAt("");
    }

    setError("");
  }, [accessPoint, open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setError("Access point name is required.");
      return;
    }

    if (!editing && !macAddress.trim()) {
      setError("MAC address is required.");
      return;
    }

    if (!ssid.trim()) {
      setError("SSID is required.");
      return;
    }

    try {
      setError("");

      if (editing) {
        await onSubmit({
          name: name.trim(),
          ipAddress: ipAddress.trim(),
          ssid: ssid.trim(),
          channel: channel ? Number(channel) : undefined,
          frequency: frequency.trim(),
          status,
          latitude: latitude ? Number(latitude) : undefined,
          longitude: longitude ? Number(longitude) : undefined,
          installedAt: installedAt
            ? new Date(installedAt).toISOString()
            : undefined,
        });

        return;
      }

      if (!buildingId) {
        setError("Building is required.");
        return;
      }

      await onSubmit({
        buildingId,
        name: name.trim(),
        macAddress: macAddress.trim(),
        ipAddress: ipAddress.trim(),
        ssid: ssid.trim(),
        channel: channel ? Number(channel) : undefined,
        frequency: frequency.trim(),
        status,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        installedAt: installedAt
          ? new Date(installedAt).toISOString()
          : undefined,
      });
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Unable to save access point.",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editing ? "Edit Access Point" : "Add Access Point"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editing
                ? "Update access point information."
                : "Register a Wi-Fi access point."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Access Point Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AP-Engineering-01"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* MAC */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  MAC Address
                </label>

                <input
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                  placeholder="AA:BB:CC:DD:EE:FF"
                  disabled={loading || editing}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:bg-slate-100"
                />
              </div>

              {/* IP */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  IP Address
                </label>

                <input
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="192.168.1.10"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* SSID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  SSID
                </label>

                <input
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="University-WiFi"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>
          </div>

          {/* Wireless Configuration */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Wireless Configuration
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Channel
                </label>

                <input
                  type="number"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="36"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Frequency
                </label>

                <input
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  placeholder="5 GHz"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="6.5244"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="3.3792"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Installation Date
                </label>

                <input
                  type="datetime-local"
                  value={installedAt}
                  onChange={(e) => setInstalledAt(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 text-slate-500 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading && <Loader2 size={17} className="animate-spin" />}

              {loading
                ? "Saving..."
                : editing
                  ? "Update Access Point"
                  : "Create Access Point"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
