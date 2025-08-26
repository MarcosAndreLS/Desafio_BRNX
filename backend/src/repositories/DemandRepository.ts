import { PrismaClient, Demand } from '../generated/prisma';

const prisma = new PrismaClient();

export class DemandRepository {
  async create(data: Omit<Demand, "id" | "createdAt" | "updatedAt">) {
    return prisma.demand.create({ data });
  }

  async findAll() {
    return prisma.demand.findMany({ include: { provider: true } });
  }

  async findById(id: string) {
    return prisma.demand.findUnique({ where: { id }, include: { provider: true } });
  }
}