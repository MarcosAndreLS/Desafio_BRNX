import { PrismaClient, Demand, DemandStatus } from '../generated/prisma';

const prisma = new PrismaClient();

export class DemandRepository {
  async create(data: Omit<Demand, "id" | "createdAt" | "updatedAt">) {
    return prisma.demand.create({ data });
  }

  async findAll(status?: DemandStatus) {
    return prisma.demand.findMany({
      where: status ? { status } : undefined,
      include: { provider: true },
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