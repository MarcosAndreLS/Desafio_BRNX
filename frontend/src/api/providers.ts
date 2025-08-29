import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // sua API backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Buscar todos provedores
export const getProviders = async () => {
  const { data } = await api.get("/providers");
  return data;
};

// Excluir provedor por ID
export const deleteProvider = async (id: string) => {
  await api.delete(`/providers/${id}`);
};

export const getProviderById = async (id: string) => {
  const { data } = await api.get(`/providers/${id}`);
  return data;
};

export const createProvider = async (providerData) => {
  const { data } = await api.post("/providers", providerData);
  return data;
};

export const updateProvider = async (id: string, providerData) => {
  const { data } = await api.patch(`/providers/${id}`, providerData);
  return data;
};
