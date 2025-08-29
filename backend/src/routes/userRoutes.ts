// routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const userController = new UserController();
const router = Router();


// Rota para buscar todos os consultores
router.get('/consultors', (req, res) => userController.listConsultors(req, res));
// Rota para buscar todos os atendentes
router.get('/atendentes', (req, res) => userController.listAtendentes(req, res));

export default router;