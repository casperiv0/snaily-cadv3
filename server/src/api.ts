import { Router } from "express";
import authRouter from "./routes/auth";
const api: Router = Router();

api.use("/auth", authRouter);

export default api;
