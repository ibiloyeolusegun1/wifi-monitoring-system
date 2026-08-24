import api from "@/src/lib/api";

export interface NetworkAlert {
  id: string;
  access_point_id: string;
  access_point_name: string;
  building_name: string;
  campus_name: string;

  title: string;
  message: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  status: string;

  metric: string;
  metric_value: number;
  threshold_value: number;

  created_at: string;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
}

export async function getAlerts(
  accessPointId?: string,
): Promise<NetworkAlert[]> {
  const params: Record<string, string> = {};

  if (accessPointId) {
    params.accessPointId = accessPointId;
  }

  const response = await api.get("/alerts", {
    params,
  });

  return response.data.data;
}

export async function generateAlerts(accessPointId: string) {
  const response = await api.post(`/alerts/generate/${accessPointId}`);

  return response.data;
}
