import { Router, json } from "express";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./routes/auth";
import truckLogs from "./routes/trucklogs";
import bleeterRouter from "./routes/bleeter";
import globalRouter from "./routes/global";
import officerRouter from "./routes/officer";
import recordsRouter from "./routes/records";
import dispatchRouter from "./routes/dispatch";
import towCallsRouter from "./routes/tow";
import emsFdRouter from "./routes/ems-fd";
import valuesRouter from "./routes/values/index";
import citizenRouter from "./routes/citizen/index";
import managementRouter from "./routes/management";
import taxiCallsRouter from "./routes/taxi";
import notificationsRouter from "./routes/notifications";

const api: Router = Router();

api.use(json());
api.use(fileUpload());
api.use(
  cors({
    origin: process.env.IS_DEV === "true" ? process.env.CLIENT_URL : "same-site",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
api.use(cookieParser());
api.use(helmet());

api.use("/auth", authRouter);
api.use("/truck-logs", truckLogs);
api.use("/bleeter", bleeterRouter);
api.use("/global", globalRouter);
api.use("/officer", officerRouter);
api.use("/records", recordsRouter);
api.use("/dispatch", dispatchRouter);
api.use("/tow-calls", towCallsRouter);
api.use("/taxi-calls", taxiCallsRouter);
api.use("/ems-fd", emsFdRouter);
api.use("/values", valuesRouter);
api.use("/admin/management", managementRouter);
api.use("/notifications", notificationsRouter);
api.use("/citizen", citizenRouter);

export default api;
