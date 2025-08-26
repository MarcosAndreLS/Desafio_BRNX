import { DemandRepository } from "../repositories/DemandRepository";
import { DemandStatus, DemandPriority, DemandType } from "../generated/prisma";

const demandRepository = new DemandRepository();

export class DemandService {
  async createDemand(
    titulo: string,
    descricao: string,
    tipo: DemandType,
    prioridade: keyof typeof DemandPriority, // string do body
    providerId: string
  ) {
    return demandRepository.create({
      titulo,
      descricao,
      tipo,
      prioridade: DemandPriority[prioridade], // converte string para enum
      providerId,
      status: DemandStatus.PENDENTE,
    });
  }

  async listDemands() {
    return demandRepository.findAll();
  }
}
