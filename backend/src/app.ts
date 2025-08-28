import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import providerRoutes from "./routes/providerRoutes";
import demandRoutes from "./routes/demandRoutes";
import { actionRoutes } from "./routes/actionRoutes";
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

app.use("/providers", providerRoutes);
app.use("/demands", demandRoutes);
app.use("/actions", actionRoutes);
app.use('/users', userRoutes);

export default app;
