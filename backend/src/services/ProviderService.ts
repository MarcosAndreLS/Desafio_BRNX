import { ProviderRepository } from "../repositories/ProviderRepository";
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const providerRepository = new ProviderRepository();

export class ProviderService {
  async createProvider(
    nomeFantasia: string,
    responsavel: string,
    email: string,
    telefone: string
  ) {
    // verifica se o email já está cadastrado
    if (email) {
      const existing = await providerRepository.findByEmail(email);
      if (existing) {
        throw new Error("Provedor já cadastrado");
      }
    }

    return providerRepository.create({ nomeFantasia, responsavel, email, telefone });
  }

  async listProviders() {
    return providerRepository.findAll();
  }

  async deleteProvider(id: string) {
  const existing = await providerRepository.findById(id);
  if (!existing) throw new Error("Provedor não encontrado");

  // remove demandas vinculadas
  await prisma.demand.deleteMany({ where: { providerId: id } });

  return providerRepository.deleteById(id);
}
}
