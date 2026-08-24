import api from "@/src/lib/api";

export interface NetworkMetric {
  id: string;
  access_point_id: string;
  access_point_name: string;
  building_name: string;
  campus_name: string;

  signal_strength: number | null;
  throughput: number | null;
  latency: number | null;
  packet_loss: number | null;
  bandwidth_utilization: number | null;
  connected_users: number | null;
  access_point_utilization: number | null;
  network_availability: number | null;
  channel_utilization: number | null;

  recorded_at: string;
}

export interface RecordNetworkMetricPayload {
  accessPointId: string;
  signalStrength?: number;
  throughput?: number;
  latency?: number;
  packetLoss?: number;
  bandwidthUtilization?: number;
  connectedUsers?: number;
  accessPointUtilization?: number;
  networkAvailability?: number;
  channelUtilization?: number;
}

export async function getNetworkMetrics(
  accessPointId?: string,
): Promise<NetworkMetric[]> {
  const params: Record<string, string> = {};

  if (accessPointId) {
    params.accessPointId = accessPointId;
  }

  const response = await api.get("/monitoring/metrics", {
    params,
  });

  return response.data.data;
}

export async function recordNetworkMetrics(
  payload: RecordNetworkMetricPayload,
): Promise<NetworkMetric> {
  const response = await api.post("/monitoring/metrics", payload);

  return response.data.data;
}
