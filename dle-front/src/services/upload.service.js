import api from "../api";

export async function uploadAudio(file, title) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("audio", file);

  const response = await api.post("/upload/audio", formData);

  return response.data;
}
