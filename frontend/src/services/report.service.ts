import api from "@/src/lib/api";

export interface PerformanceReport {
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

export interface AlertReport {
  id: string;
  access_point_id: string;
  access_point_name: string;
  building_name: string;
  campus_name: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  metric: string;
  metric_value: number;
  threshold_value: number;
  created_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
}

export interface RecommendationReport {
  id: string;
  access_point_id: string;
  access_point_name: string;
  building_name: string;
  campus_name: string;
  title: string;
  description: string;
  reason: string;
  priority: string;
  status: string;
  metric: string;
  metric_value: number;
  recommended_value: number | null;
  created_at: string;
  updated_at: string;
  implemented_at: string | null;
}

export interface AccessPointReport {
  id: string;
  name: string;
  mac_address: string;
  ip_address: string | null;
  ssid: string;
  channel: number | null;
  frequency: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  installed_at: string | null;
  building_name: string;
  campus_name: string;
  created_at: string;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  accessPointId?: string;
}

export async function getPerformanceReport(
  filters: ReportFilters = {},
): Promise<PerformanceReport[]> {
  const response = await api.get("/reports/performance", { params: filters });

  return response.data.data;
}

export async function getAlertReport(
  filters: ReportFilters = {},
): Promise<AlertReport[]> {
  const response = await api.get("/reports/alerts", { params: filters });

  return response.data.data;
}

export async function getRecommendationReport(
  filters: ReportFilters = {},
): Promise<RecommendationReport[]> {
  const response = await api.get("/reports/recommendations", {
    params: filters,
  });

  return response.data.data;
}

export async function getAccessPointReport(): Promise<AccessPointReport[]> {
  const response = await api.get("/reports/access-points");

  return response.data.data;
}
