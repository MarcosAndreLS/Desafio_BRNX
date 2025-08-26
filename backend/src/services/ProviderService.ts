import { ProviderRepository } from "../repositories/ProviderRepository";

const providerRepository = new ProviderRepository();

export class ProviderService {
  async createProvider(
    nomeFantasia: string,
    responsavel?: string,
    email?: string,
    telefone?: string
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
}
