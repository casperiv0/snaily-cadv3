import { Router } from "express";
import authRouter from "./routes/auth";
import truckLogs from "./routes/trucklogs";
const api: Router = Router();

api.use("/auth", authRouter);
api.use("/truck-logs", truckLogs);

export default api;
