"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

import {
  AccessPoint,
  getAccessPoints,
} from "@/src/services/accessPoint.service";

import { RecordNetworkMetricPayload } from "@/src/services/monitoring.service";

interface MonitoringModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: RecordNetworkMetricPayload) => Promise<void>;
}

export default function MonitoringModal({
  open,
  loading = false,
  onClose,
  onSubmit,
}: MonitoringModalProps) {
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);

  const [accessPointId, setAccessPointId] = useState("");

  const [signalStrength, setSignalStrength] = useState("");

  const [throughput, setThroughput] = useState("");

  const [latency, setLatency] = useState("");

  const [packetLoss, setPacketLoss] = useState("");

  const [bandwidthUtilization, setBandwidthUtilization] = useState("");

  const [connectedUsers, setConnectedUsers] = useState("");

  const [accessPointUtilization, setAccessPointUtilization] = useState("");

  const [networkAvailability, setNetworkAvailability] = useState("");

  const [channelUtilization, setChannelUtilization] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadAccessPoints() {
      try {
        const data = await getAccessPoints();

        setAccessPoints(data);
      } catch (error) {
        console.error("Failed to load access points:", error);

        setError("Unable to load access points.");
      }
    }

    loadAccessPoints();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setAccessPointId("");
    setSignalStrength("");
    setThroughput("");
    setLatency("");
    setPacketLoss("");
    setBandwidthUtilization("");
    setConnectedUsers("");
    setAccessPointUtilization("");
    setNetworkAvailability("");
    setChannelUtilization("");
    setError("");
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessPointId) {
      setError("Please select an access point.");
      return;
    }

    try {
      setError("");

      await onSubmit({
        accessPointId,

        signalStrength:
          signalStrength !== "" ? Number(signalStrength) : undefined,

        throughput: throughput !== "" ? Number(throughput) : undefined,

        latency: latency !== "" ? Number(latency) : undefined,

        packetLoss: packetLoss !== "" ? Number(packetLoss) : undefined,

        bandwidthUtilization:
          bandwidthUtilization !== ""
            ? Number(bandwidthUtilization)
            : undefined,

        connectedUsers:
          connectedUsers !== "" ? Number(connectedUsers) : undefined,

        accessPointUtilization:
          accessPointUtilization !== ""
            ? Number(accessPointUtilization)
            : undefined,

        networkAvailability:
          networkAvailability !== "" ? Number(networkAvailability) : undefined,

        channelUtilization:
          channelUtilization !== "" ? Number(channelUtilization) : undefined,
      });
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Unable to record network metrics.",
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

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Record Network Metrics
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Record Wi-Fi performance data for an access point.
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

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Access Point */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Access Point
            </label>

            <select
              value={accessPointId}
              onChange={(event) => setAccessPointId(event.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 text-slate-500 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            >
              <option value="">Select access point</option>

              {accessPoints.map((accessPoint) => (
                <option key={accessPoint.id} value={accessPoint.id}>
                  {accessPoint.name}
                  {" — "}
                  {accessPoint.building_name || "Building"}
                </option>
              ))}
            </select>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricInput
              label="Signal Strength (dBm)"
              value={signalStrength}
              onChange={setSignalStrength}
              placeholder="-65"
              disabled={loading}
            />

            <MetricInput
              label="Throughput (Mbps)"
              value={throughput}
              onChange={setThroughput}
              placeholder="68"
              disabled={loading}
            />

            <MetricInput
              label="Latency (ms)"
              value={latency}
              onChange={setLatency}
              placeholder="22"
              disabled={loading}
            />

            <MetricInput
              label="Packet Loss (%)"
              value={packetLoss}
              onChange={setPacketLoss}
              placeholder="0.7"
              disabled={loading}
            />

            <MetricInput
              label="Bandwidth Utilization (%)"
              value={bandwidthUtilization}
              onChange={setBandwidthUtilization}
              placeholder="65"
              disabled={loading}
            />

            <MetricInput
              label="Connected Users"
              value={connectedUsers}
              onChange={setConnectedUsers}
              placeholder="42"
              disabled={loading}
            />

            <MetricInput
              label="AP Utilization (%)"
              value={accessPointUtilization}
              onChange={setAccessPointUtilization}
              placeholder="70"
              disabled={loading}
            />

            <MetricInput
              label="Network Availability (%)"
              value={networkAvailability}
              onChange={setNetworkAvailability}
              placeholder="99.5"
              disabled={loading}
            />

            <MetricInput
              label="Channel Utilization (%)"
              value={channelUtilization}
              onChange={setChannelUtilization}
              placeholder="55"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
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

              {loading ? "Recording..." : "Record Metrics"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MetricInput({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="number"
        step="any"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-300 text-slate-500 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}
