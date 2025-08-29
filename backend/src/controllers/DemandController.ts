import { Request, Response } from "express";
import { DemandService } from "../services/DemandService";
import { DemandStatus } from "../generated/prisma";

const demandService = new DemandService();

export class DemandController {
  async create(req: Request, res: Response) {
    try {
      const { titulo, descricao, tipo, prioridade, providerId, atendenteId } = req.body; 
      const demand = await demandService.createDemand(titulo, descricao, tipo, prioridade, providerId, atendenteId); 
      return res.status(201).json(demand);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { status } = req.query;

      if (status && !Object.values(DemandStatus).includes(status as DemandStatus)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const demands = await demandService.listDemands(status as DemandStatus | undefined);
      return res.json(demands);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !Object.values(DemandStatus).includes(status as DemandStatus)) {
        return res.status(400).json({ error: "Status inválido" });
      }

      const updated = await demandService.changeStatus(id, status as DemandStatus);
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const demand = await demandService.getDemandDetails(id); 
      if (!demand) {
        return res.status(404).json({ error: "Demanda não encontrada." });
      }

      return res.json(demand);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await demandService.deleteDemand(id);
      return res.status(204).send(); // Status 204 indica sucesso sem conteúdo
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}