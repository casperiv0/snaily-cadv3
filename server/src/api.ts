import { Router } from "express";
import authRouter from "./routes/auth";
import truckLogs from "./routes/trucklogs";
import bleeterRouter from "./routes/bleeter";
import globalRouter from "./routes/global";
import officerRouter from "./routes/officer";
import recordsRouter from "./routes/records";
const api: Router = Router();

api.use("/auth", authRouter);
api.use("/truck-logs", truckLogs);
api.use("/bleeter", bleeterRouter);
api.use("/global", globalRouter);
api.use("/officer", officerRouter);
api.use("/records", recordsRouter);

export default api;
