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
      const citizen = await processQuery(
        "SELECT `id` FROM `citizens` WHERE `full_name` = ?",
        [fullName]
      );

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      const id = uuidv4();
      await processQuery(
        "INSERT INTO `warrants` (`id`, `name`, `citizen_id`, `reason`, `status`) VALUES (?, ?, ?, ?, ?)",
        [id, fullName, citizen[0].id, details, status]
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

router.post(
  "/create-written-warning",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { name, officer_name, infractions, postal, notes } = req.body;
    const date = Date.now();

    if (name && officer_name && infractions && postal && notes) {
      const id = uuidv4();
      const citizen = await processQuery(
        "SELECT `id` FROM `citizens` WHERE `full_name` = ?",
        [name]
      );

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `written_warnings` (`id`, `name`, `citizen_id`, `date`, `infractions`, `officer_name`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          id,
          name,
          citizen[0].id,
          date,
          infractions,
          officer_name,
          notes,
          postal,
        ]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  }
);

router.post(
  "/create-arrest-report",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { name, officer_name, charges, postal, notes } = req.body;
    const date = Date.now();

    if (name && officer_name && charges && postal && notes) {
      const id = uuidv4();
      const citizen = await processQuery(
        "SELECT `id` FROM `citizens` WHERE `full_name` = ?",
        [name]
      );

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `arrest_reports` (`id`, `name`, `citizen_id`, `date`, `charges`, `officer_name`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, name, citizen[0].id, date, charges, officer_name, notes, postal]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  }
);

router.post(
  "/create-ticket",
  useAuth,
  useOfficerAuth,
  async (req: IRequest, res: Response) => {
    const { name, officer_name, violations, postal, notes } = req.body;
    const date = Date.now();

    if (name && officer_name && violations && postal && notes) {
      const id = uuidv4();
      const citizen = await processQuery(
        "SELECT `id` FROM `citizens` WHERE `full_name` = ?",
        [name]
      );

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `leo_tickets` (`id`, `name`, `citizen_id`, `violations`, `officer_name`, `date`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, name, citizen[0].id, violations, officer_name, date, notes, postal]
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  }
);

export default router;
