import api from "../api";

export async function getCategories() {
  const res = await api.get("/admin/category");
  return res.data;
}

export async function createCategory(data) {
  const res = await api.post("/admin/category", data);
  return res.data;
}

export async function deleteCategory(id) {
  const res = await api.delete(`/admin/category/${id}`);
  return res.data;
}

export async function getCategory(id) {
  const res = await api.get(`/admin/category/${id}`);
  return res.data;
}

export async function updateCategory(id, data) {
  const res = await api.put(`/admin/category/${id}`, data);
  return res.data;
}
