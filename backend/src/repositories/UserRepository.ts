// repositories/UserRepository.ts
import { PrismaClient, User, UserRole } from '../generated/prisma';

const prisma = new PrismaClient();

export class UserRepository {

  async findAllConsultors() {
    return prisma.user.findMany({
      where: {
        role: UserRole.CONSULTOR,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findAllAtendentes() {
    return prisma.user.findMany({
      where: {
        role: UserRole.ATENDENTE,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}