import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createAction = async (data: {
  descricao: string;
  tipo: string;
  demandId: string;
  tecnicoId?: string;
}) => {
  const { data: newAction } = await api.post("/actions", data);
  return newAction;
};
