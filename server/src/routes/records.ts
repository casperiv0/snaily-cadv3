import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import { useOfficerAuth } from "./officer";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";
const router: Router = Router();

router.post(
  "/create-warrant",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { fullName, status, details } = req.body;

    if (fullName && status && details) {
      const id = uuidv4();
      await processQuery(
        "INSERT INTO `warrants` (`id`, `name`, `reason`, `status`) VALUES (?, ?, ?, ?)",
        [id, fullName, details, status]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Pleas fill in all fields",
        status: "error",
      });
    }
  }
);

export default router;
