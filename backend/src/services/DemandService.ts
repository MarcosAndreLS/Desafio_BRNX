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

  async listDemands(status?: DemandStatus) {
    return demandRepository.findAll(status);
  }

  async changeStatus(id: string, newStatus: DemandStatus) {
    const demand = await demandRepository.findById(id);
    if (!demand) {
      throw new Error("Demanda não encontrada");
    }

    const currentStatus = demand.status;

    // Validação de transições
    const invalidTransitions: Record<DemandStatus, DemandStatus[]> = {
      PENDENTE: [], // de PENDENTE qualquer transição é válida
      EM_ANDAMENTO: [], // de EM_ANDAMENTO qualquer transição é válida
      CONCLUIDA: [DemandStatus.PENDENTE, DemandStatus.EM_ANDAMENTO], // não pode voltar
      CANCELADA: [DemandStatus.PENDENTE, DemandStatus.EM_ANDAMENTO, DemandStatus.CONCLUIDA], // não pode voltar
    };

    if (invalidTransitions[currentStatus].includes(newStatus)) {
      throw new Error(`Não é permitido mudar de ${currentStatus} para ${newStatus}`);
    }

    // Atualiza status
    return demandRepository.updateStatus(id, newStatus);
  }
}
