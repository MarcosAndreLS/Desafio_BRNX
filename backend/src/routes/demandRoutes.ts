import { Router } from "express";
import { DemandController } from "../controllers/DemandController";

const router = Router();
const demandController = new DemandController();

router.post("/", (req, res) => demandController.create(req, res));
router.get("/", (req, res) => demandController.list(req, res)); // suporta ?status=
router.patch("/:id/status", (req, res) => demandController.changeStatus(req, res));
router.get("/:id", (req, res) => demandController.getById(req, res));

export default router;
