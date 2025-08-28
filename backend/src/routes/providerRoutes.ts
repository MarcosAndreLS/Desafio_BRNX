import { Router } from "express";
import { ProviderController } from "../controllers/ProviderController";

const router = Router();
const providerController = new ProviderController();

router.post("/", (req, res) => providerController.create(req, res));
router.get("/", (req, res) => providerController.list(req, res));
router.delete("/:id", (req, res) => providerController.delete(req, res));
router.patch("/:id", (req, res) => providerController.update(req, res));
router.get("/:id", (req, res) => providerController.getById(req, res));

export default router;
