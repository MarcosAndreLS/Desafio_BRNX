// controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

const userService = new UserService();

export class UserController {

  async listConsultors(req: Request, res: Response) {
    try {
      const consultors = await userService.listConsultors();
      return res.json(consultors);
    } catch (error: any) {
      return res.status(500).json({ error: 'Erro ao listar consultores.' });
    }
  }
}