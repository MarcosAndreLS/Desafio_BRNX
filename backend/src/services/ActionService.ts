import { PrismaClient, Demand } from '../generated/prisma';

const prisma = new PrismaClient();

export class ActionService {
  async createAction(data: {
    descricao: string;
    tipo: string;
    demandId: string;
    tecnicoId?: string;
  }) {
    // valida se a demanda existe
    const demand = await prisma.demand.findUnique({
      where: { id: data.demandId },
    });
    if (!demand) throw new Error("Demanda não encontrada");

    const action = await prisma.action.create({
      data: {
        descricao: data.descricao,
        tipo: data.tipo as any, // enum ActionType
        demandId: data.demandId,
        tecnicoId: data.tecnicoId ?? null,
      },
      include: {
        tecnico: { select: { id: true, name: true } },
        demand: { select: { id: true, titulo: true } },
      },
    });

    return action;
  }

  async listActions(demandId: string) {
    return prisma.action.findMany({
      where: { demandId },
      orderBy: { executadaEm: "desc" },
      include: {
        tecnico: { select: { id: true, name: true } },
      },
    });
  }
}
