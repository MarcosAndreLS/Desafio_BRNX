// src/api/dashboard.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // sua API backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Buscar todas as demandas (pode usar ?status=PENDENTE se quiser filtrar)
export const fetchDemands = async () => {
  const res = await api.get("/demands");
  return res.data;
};

// Exemplo de endpoint para provedores (se já tiver no backend)
export const fetchProviders = async () => {
  const res = await api.get("/providers");
  return res.data;
};
