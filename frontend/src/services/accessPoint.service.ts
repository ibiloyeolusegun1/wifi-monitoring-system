import api from "@/src/lib/api";

export interface AccessPoint {
  id: string;
  building_id: string;
  building_name?: string;
  campus_id?: string;
  campus_name?: string;
  name: string;
  mac_address: string;
  ip_address?: string | null;
  ssid: string;
  channel?: number | null;
  frequency?: string | null;
  status: string;
  latitude?: number | null;
  longitude?: number | null;
  installed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AccessPointPayload {
  buildingId: string;
  name: string;
  macAddress: string;
  ipAddress?: string;
  ssid: string;
  channel?: number;
  frequency?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  installedAt?: string;
}

export interface AccessPointUpdatePayload {
  name?: string;
  ipAddress?: string;
  ssid?: string;
  channel?: number;
  frequency?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  installedAt?: string;
}

export async function getAccessPoints(
  buildingId?: string,
  status?: string,
): Promise<AccessPoint[]> {
  const params: Record<string, string> = {};

  if (buildingId) {
    params.buildingId = buildingId;
  }

  if (status) {
    params.status = status;
  }

  const response = await api.get("/access-points", {
    params,
  });

  return response.data.data;
}

export async function getAccessPoint(id: string): Promise<AccessPoint> {
  const response = await api.get(`/access-points/${id}`);

  return response.data.data;
}

export async function createAccessPoint(
  payload: AccessPointPayload,
): Promise<AccessPoint> {
  const response = await api.post("/access-points", payload);

  return response.data.data;
}

export async function updateAccessPoint(
  id: string,
  payload: AccessPointUpdatePayload,
): Promise<AccessPoint> {
  const response = await api.put(`/access-points/${id}`, payload);

  return response.data.data;
}

export async function deleteAccessPoint(id: string): Promise<void> {
  await api.delete(`/access-points/${id}`);
}
