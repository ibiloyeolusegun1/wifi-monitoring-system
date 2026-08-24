"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { NetworkMetric } from "@/src/services/monitoring.service";

interface MonitoringChartProps {
  metrics: NetworkMetric[];
}

export default function MonitoringChart({ metrics }: MonitoringChartProps) {
  const chartData = [...metrics].reverse().map((metric) => ({
    time: new Date(metric.recorded_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    signal: metric.signal_strength,

    throughput: metric.throughput,

    latency: metric.latency,

    packetLoss: metric.packet_loss,

    availability: metric.network_availability,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-400">
          No monitoring data available for visualization.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Signal Strength */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Signal Strength
        </h3>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis
                label={{
                  value: "dBm",
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="signal"
                name="Signal Strength"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Throughput and Latency */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Throughput and Latency
        </h3>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="throughput"
                name="Throughput (Mbps)"
                stroke="#16a34a"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="latency"
                name="Latency (ms)"
                stroke="#dc2626"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Availability and Packet Loss */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Availability and Packet Loss
        </h3>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="time" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="availability"
                name="Availability (%)"
                stroke="#7c3aed"
                strokeWidth={2}
                dot={false}
              />

              <Line
                type="monotone"
                dataKey="packetLoss"
                name="Packet Loss (%)"
                stroke="#ea580c"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
