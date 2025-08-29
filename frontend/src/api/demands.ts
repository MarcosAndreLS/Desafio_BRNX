import axios from "axios";
import { Demand, DemandStatus, DemandPriority, DemandType } from "@/generated/prisma";


const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Corrigido: Definição explícita das propriedades
type DemandCreateData = {
  titulo: string;
  descricao: string;
  tipo: DemandType;
  prioridade: DemandPriority;
  providerId: string;
  atendenteId: string;
};

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

export const getDemandById = async (id: string) => {
  const { data } = await api.get(`/demands/${id}`);
  return data;
};

// Função para deletar uma demanda
export const deleteDemand = async (id: string) => {
  // Faz uma requisição DELETE para o endpoint de exclusão
  const { data } = await api.delete(`/demands/${id}`);
  return data;
};

// Função para criar uma nova demanda
export const createDemand = async (demand: DemandCreateData) => {
    console.log("Payload enviado:", demand);
  const response = await api.post("/demands", demand);
  return response.data;
};