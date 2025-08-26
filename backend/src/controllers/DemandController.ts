import { Request, Response } from "express";
import { DemandService } from "../services/DemandService";

const demandService = new DemandService();

export class DemandController {
  async create(req: Request, res: Response) {
    try {
      const { titulo, descricao, tipo, prioridade, providerId } = req.body;
      const demand = await demandService.createDemand(titulo, descricao, tipo, prioridade, providerId);
      return res.status(201).json(demand);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    const demands = await demandService.listDemands();
    return res.json(demands);
  }
}
