import { Router } from "express";
import { ProviderController } from "../controllers/ProviderController";

const router = Router();
const providerController = new ProviderController();

router.post("/", (req, res) => providerController.create(req, res));
router.get("/", (req, res) => providerController.list(req, res));

export default router;
