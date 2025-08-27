import { Router } from "express";
import { ActionController } from "../controllers/ActionController";

const router = Router();
const actionController = new ActionController();

// POST /actions → cria nova ação
router.post("/", (req, res) => actionController.create(req, res));

// GET /actions/:demandId → lista ações de uma demanda
router.get("/:demandId", (req, res) => actionController.list(req, res));

export { router as actionRoutes };
