import api from "@/src/lib/api";

export interface Building {
  id: string;
  campus_id: string;
  campus_name?: string;
  name: string;
  location?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuildingPayload {
  campusId: string;
  name: string;
  location?: string;
  description?: string;
}

export interface BuildingUpdatePayload {
  name?: string;
  location?: string;
  description?: string;
}

export async function getBuildings(
  campusId?: string
): Promise<Building[]> {
  const response = await api.get("/buildings", {
    params: campusId ? { campusId } : undefined,
  });

  return response.data.data;
}

export async function getBuilding(
  id: string
): Promise<Building> {
  const response = await api.get(
    `/buildings/${id}`
  );

  return response.data.data;
}

export async function createBuilding(
  payload: BuildingPayload
): Promise<Building> {
  const response = await api.post(
    "/buildings",
    payload
  );

  return response.data.data;
}

export async function updateBuilding(
  id: string,
  payload: BuildingUpdatePayload
): Promise<Building> {
  const response = await api.put(
    `/buildings/${id}`,
    payload
  );

  return response.data.data;
}

export async function deleteBuilding(
  id: string
): Promise<void> {
  await api.delete(`/buildings/${id}`);
}