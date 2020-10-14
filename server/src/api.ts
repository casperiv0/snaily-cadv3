import { Router } from "express";
import authRouter from "./routes/auth";
import truckLogs from "./routes/trucklogs";
import bleeterRouter from "./routes/bleeter";
const api: Router = Router();

api.use("/auth", authRouter);
api.use("/truck-logs", truckLogs);
api.use("/bleeter", bleeterRouter);

export default api;
