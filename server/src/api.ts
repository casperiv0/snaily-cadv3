import { Router } from "express";
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

const api: Router = Router();

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

api.use("/citizen", citizenRouter);

export default api;
