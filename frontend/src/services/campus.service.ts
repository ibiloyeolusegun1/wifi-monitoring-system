import api from "@/src/lib/api";

export interface Campus {
  id: string;
  name: string;
  location: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampusPayload {
  name: string;
  location: string;
  description?: string;
}

export async function getCampuses(): Promise<Campus[]> {
  const response = await api.get("/campuses");

  return response.data.data;
}

export async function getCampus(id: string): Promise<Campus> {
  const response = await api.get(`/campuses/${id}`);

  return response.data.data;
}

export async function createCampus(payload: CampusPayload): Promise<Campus> {
  const response = await api.post("/campuses", payload);

  return response.data.data;
}

export async function updateCampus(
  id: string,
  payload: CampusPayload,
): Promise<Campus> {
  const response = await api.put(`/campuses/${id}`, payload);

  return response.data.data;
}

export async function deleteCampus(id: string): Promise<void> {
  await api.delete(`/campuses/${id}`);
}
