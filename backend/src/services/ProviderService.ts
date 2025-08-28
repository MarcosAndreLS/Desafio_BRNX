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
    // Inclui o array completo de demandas para cada provedor
    return prisma.provider.findMany({
      include: {
        demandas: true, // Isso busca todas as demandas relacionadas a cada provedor
      },
    });
}

  async deleteProvider(id: string) {
    const existing = await providerRepository.findById(id);
    if (!existing) throw new Error("Provedor não encontrado");

    // remove demandas vinculadas
    await prisma.demand.deleteMany({ where: { providerId: id } });

    return providerRepository.deleteById(id);
  }

  async updateProvider(id: string, data: { nomeFantasia?: string; responsavel?: string; email?: string; telefone?: string }) {
    const existing = await providerRepository.findById(id);
    if (!existing) {
      throw new Error("Provedor não encontrado");
    }

    // Verifica se o email está sendo alterado para um já existente
    if (data.email && data.email !== existing.email) {
      const emailExists = await providerRepository.findByEmail(data.email);
      if (emailExists) {
        throw new Error("Email já está em uso por outro provedor");
      }
    }

    return providerRepository.updateById(id, data);
  }
}
