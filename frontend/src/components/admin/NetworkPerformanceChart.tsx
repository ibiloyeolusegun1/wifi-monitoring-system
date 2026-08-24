"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PerformanceData {
  recorded_at: string;
  signal_strength: number | string;
  throughput: number | string;
  latency: number | string;
  packet_loss: number | string;
}

interface NetworkPerformanceChartProps {
  data: PerformanceData[];
}

export default function NetworkPerformanceChart({
  data,
}: NetworkPerformanceChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.recorded_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    throughput: Number(item.throughput),
    latency: Number(item.latency),
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />

          <Tooltip />

          <Legend />

          <Line
            type="monotone"
            dataKey="throughput"
            name="Throughput (Mbps)"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="latency"
            name="Latency (ms)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
