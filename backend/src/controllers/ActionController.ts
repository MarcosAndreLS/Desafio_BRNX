import { Request, Response } from "express";
import { ActionService } from "../services/ActionService";

const actionService = new ActionService();

export class ActionController {
  async create(req: Request, res: Response) {
    try {
      const { descricao, tipo, demandId, tecnicoId } = req.body;

      if (!descricao || descricao.length < 10) {
        return res.status(400).json({ error: "Descrição inválida" });
      }

      if (!tipo) {
        return res.status(400).json({ error: "Tipo da ação é obrigatório" });
      }

      const action = await actionService.createAction({
        descricao,
        tipo,
        demandId,
        tecnicoId,
      });

      return res.status(201).json(action);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const { demandId } = req.params;

      const actions = await actionService.listActions(demandId);
      return res.json(actions);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
