import { Request, Response } from "express";
import { ProviderService } from "../services/ProviderService";

const providerService = new ProviderService();

export class ProviderController {
  async create(req: Request, res: Response) {
    try {
      const { nomeFantasia, responsavel, email, telefone } = req.body; // nomes corretos
      const provider = await providerService.createProvider(nomeFantasia, responsavel, email, telefone);
      return res.status(201).json(provider);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    const providers = await providerService.listProviders();
    return res.json(providers);
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await providerService.deleteProvider(id);
      return res.status(200).json({ message: "Provedor excluído com sucesso" });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
