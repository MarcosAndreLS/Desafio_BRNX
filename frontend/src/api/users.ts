// api/users.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getConsultors = async () => {
  const { data } = await api.get("/users/consultors"); 
  return data;
};