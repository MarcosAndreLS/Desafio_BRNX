import { PrismaClient, Demand, DemandStatus } from '../generated/prisma';

const prisma = new PrismaClient();

export class DemandRepository {
  async create(data: Omit<Demand, "id" | "createdAt" | "updatedAt">) {
    return prisma.demand.create({ data });
  }

  async findAll(status?: DemandStatus) {
  return prisma.demand.findMany({
    where: status ? { status } : undefined,
    include: {
      provider: true, // Já estava presente
      actions: true,  // Adicionado para incluir as ações
    },
    orderBy: {
      createdAt: 'desc', // Adiciona ordenação para que as demandas mais recentes apareçam primeiro
    }
  });
}

  async findById(id: string) {
    return prisma.demand.findUnique({ where: { id }, include: { provider: true } });
  }

  async updateStatus(id: string, status: DemandStatus) {
    return prisma.demand.update({
      where: { id },
      data: { status },
    });
  }
}