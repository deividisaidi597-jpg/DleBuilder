import api from "../api";

export async function createEntity(data) {
  const response = await api.post("/admin/entity", data);

  return response.data;
}

export async function getEntities(categoryId) {
  const response = await api.get("/admin/entity", {
    params: categoryId ? { categoryId } : {},
  });

  return response.data;
}

export async function getEntity(id) {
  const response = await api.get(`/admin/entity/${id}`);

  return response.data;
}

export async function updateEntity(id, data) {
  const response = await api.patch(`/admin/entity/${id}`, data);

  return response.data;
}

export async function deleteEntity(id) {
  const response = await api.delete(`/admin/entity/${id}`);

  return response.data;
}
