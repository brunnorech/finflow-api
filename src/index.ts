import express, { RequestHandler } from "express";
import cors from "cors";
import transactionRoutes from "./routes/transaction.routes";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import metadataRoutes from "./routes/metadata.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import accountRoutes from "./routes/account.routes";

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const rootHandler: RequestHandler = (_, res) => {
  res.json({ ok: true });
};
app.get("/", rootHandler);

app.use("/transactions", transactionRoutes);
app.use("/categories", categoryRoutes);
app.use("/auth", authRoutes);

app.use("/metadata", metadataRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/account", accountRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
