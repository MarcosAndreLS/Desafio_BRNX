import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDemands = async (statusFilter?: string) => {
  const params = statusFilter && statusFilter !== "all" ? { status: statusFilter.toUpperCase() } : {};
  const { data } = await api.get("/demands", { params });
  return data;
};

// Função para atualizar o status de uma demanda
export const updateDemandStatus = async (id: string, newStatus: string) => {
  // Envia o novo status com a chave 'status' para corresponder ao controller
  const { data } = await api.patch(`/demands/${id}/status`, { status: newStatus.toUpperCase() });
  return data;
};