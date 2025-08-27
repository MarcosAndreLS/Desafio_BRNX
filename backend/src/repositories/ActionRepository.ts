import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class ActionRepository {
  async findByDemandId(demandId: string) {
    return prisma.action.findMany({
      where: { demandId },
      orderBy: { executadaEm: "desc" },
      include: { tecnico: { select: { id: true, name: true } } },
    });
  }

  async create(data: {
    descricao: string;
    tipo: string;
    demandId: string;
    tecnicoId?: string;
  }) {
    return prisma.action.create({
      data: {
        descricao: data.descricao,
        tipo: data.tipo as any,
        demandId: data.demandId,
        tecnicoId: data.tecnicoId ?? null,
      },
      include: {
        tecnico: { select: { id: true, name: true } },
        demand: { select: { id: true, titulo: true } },
      },
    });
  }

  async findDemandById(id: string) {
    return prisma.demand.findUnique({ where: { id } });
  }
}
