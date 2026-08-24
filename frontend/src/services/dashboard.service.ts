import api from "@/src/lib/api";

export interface DashboardSummary {
  totalAccessPoints: number;
  onlineAccessPoints: number;
  offlineAccessPoints: number;
  totalAlerts: number;
  criticalAlerts: number;
  pendingRecommendations: number;

  averageSignalStrength: number | null;
  averageThroughput: number | null;
  averageLatency: number | null;
  averagePacketLoss: number | null;
  networkAvailability: number | null;
}

export interface RecentPerformance {
  recorded_at: string;
  signal_strength: number | null;
  throughput: number | null;
  latency: number | null;
  packet_loss: number | null;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await api.get("/dashboard/summary");

  return response.data.data;
}

export async function getRecentPerformance(): Promise<RecentPerformance[]> {
  const response = await api.get("/dashboard/performance");

  return response.data.data;
}
