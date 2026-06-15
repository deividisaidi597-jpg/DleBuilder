import api from "../api";

export async function getModes(categoryId) {
  const response = await api.get(`/game/category/${categoryId}/modes`);

  return response.data;
}

export async function startGame(data) {
  const response = await api.post("/game/start", data);

  return response.data;
}

export async function guess(data) {
  const response = await api.post("/game/guess", data);

  return response.data;
}

export async function getSession(id) {
  const response = await api.get(`/game/session/${id}`);

  return response.data;
}

export async function searchEntities(categoryId, query) {
  const response = await api.get(
    `/entity/category/${categoryId}/entities/search`,
    {
      params: {
        q: query,
      },
    },
  );
  console.log("RESPONSE DATA:", response.data);

  return response.data;
}
