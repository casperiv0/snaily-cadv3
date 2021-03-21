import { Router, json } from "express";

import healthRouter from "./routes/monitoring/health";

const api: Router = Router();

api.use(json());
api.use("/health", healthRouter);

export default api;
