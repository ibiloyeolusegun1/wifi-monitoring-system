import api from "@/src/lib/api";

export interface NetworkRecommendation {
  id: string;
  access_point_id: string;
  access_point_name: string;
  building_name: string;
  campus_name: string;

  title: string;
  description: string;
  reason: string;

  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

  status: string;

  metric: string;
  metric_value: number;
  recommended_value: number | null;

  created_at: string;
  updated_at: string;
  implemented_at: string | null;
}

export async function getRecommendations(
  accessPointId?: string,
): Promise<NetworkRecommendation[]> {
  const params: Record<string, string> = {};

  if (accessPointId) {
    params.accessPointId = accessPointId;
  }

  const response = await api.get("/recommendations", {
    params,
  });

  return response.data.data;
}

export async function generateRecommendations(
  accessPointId: string,
): Promise<NetworkRecommendation[]> {
  const response = await api.post(`/recommendations/generate/${accessPointId}`);

  return response.data.data;
}
