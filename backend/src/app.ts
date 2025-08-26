import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import providerRoutes from "./routes/providerRoutes";
import demandRoutes from "./routes/demandRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

app.use("/providers", providerRoutes);
app.use("/demands", demandRoutes);

export default app;
