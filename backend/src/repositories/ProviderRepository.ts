import { PrismaClient, Provider } from '../generated/prisma'

const prisma = new PrismaClient();

export class ProviderRepository {
  async create(data: Omit<Provider, "id" | "createdAt" | "updatedAt">) {
    return prisma.provider.create({ data });
  }

  async findAll() {
    return prisma.provider.findMany();
  }

  async findById(id: string) {
    return prisma.provider.findUnique({
      where: { id },
      include: { demandas: true }, 
    });
  }


  async findByEmail(email: string) {
    return prisma.provider.findUnique({ where: { email } });
  }

  async deleteById(id: string) {
    return prisma.provider.delete({
      where: { id },
    });
  }

  async updateById(id: string, data: Partial<Omit<Provider, "id" | "createdAt" | "updatedAt">>) {
    return prisma.provider.update({
      where: { id },
      data,
    });
  }
}
