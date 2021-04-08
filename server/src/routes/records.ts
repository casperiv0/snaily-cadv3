import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";
import usePermission from "../hooks/usePermission";
const router: Router = Router();

router.post(
  "/create-warrant",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { fullName, status, details } = req.body;

    if (fullName && status && details) {
      const citizen = await processQuery("SELECT `id` FROM `citizens` WHERE `full_name` = ?", [
        fullName,
      ]);

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      const id = uuidv4();
      await processQuery(
        "INSERT INTO `warrants` (`id`, `name`, `citizen_id`, `reason`, `status`) VALUES (?, ?, ?, ?, ?)",
        [id, fullName, citizen[0].id, details, status],
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  },
);

router.post(
  "/create-written-warning",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { name, officer_name, infractions, postal, notes } = req.body;
    const date = Date.now();

    if (name && officer_name && infractions && postal && notes) {
      const id = uuidv4();
      const citizen = await processQuery("SELECT `id` FROM `citizens` WHERE `full_name` = ?", [
        name,
      ]);

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `written_warnings` (`id`, `name`, `citizen_id`, `date`, `infractions`, `officer_name`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, name, citizen[0].id, date, infractions, officer_name, notes, postal],
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  },
);

router.post(
  "/create-arrest-report",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { name, officer_name, charges, postal, notes } = req.body;
    const date = Date.now();

    if (name && officer_name && charges && postal && notes) {
      const id = uuidv4();
      const citizen = await processQuery("SELECT `id` FROM `citizens` WHERE `full_name` = ?", [
        name,
      ]);

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `arrest_reports` (`id`, `name`, `citizen_id`, `date`, `charges`, `officer_name`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, name, citizen[0].id, date, charges, officer_name, notes, postal],
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  },
);

router.post(
  "/create-ticket",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { name, officer_name, violations, postal, notes } = req.body;
    const date = Date.now();

    if (name && officer_name && violations && postal && notes) {
      const id = uuidv4();
      const citizen = await processQuery("SELECT `id` FROM `citizens` WHERE `full_name` = ?", [
        name,
      ]);

      if (!citizen[0]) {
        return res.json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      await processQuery(
        "INSERT INTO `leo_tickets` (`id`, `name`, `citizen_id`, `violations`, `officer_name`, `date`, `notes`, `postal`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, name, citizen[0].id, violations, officer_name, date, notes, postal],
      );

      return res.json({ status: "success" });
    } else {
      return res.json({
        error: "Please fill in all fields",
        status: "error",
      });
    }
  },
);

router.delete(
  "/:type/:id/:citizenId",
  useAuth,
  usePermission(["leo", "dispatch"]),
  async (req: IRequest, res: Response) => {
    const { type, id, citizenId } = req.params;

    let citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizenId]);

    switch (type) {
      case "ticket": {
        await processQuery("DELETE FROM `leo_tickets` WHERE `id` = ?", [id]);
        break;
      }
      case "arrest_report": {
        await processQuery("DELETE FROM `arrest_reports` WHERE `id` = ?", [id]);
        break;
      }
      case "written_warning": {
        await processQuery("DELETE FROM `written_warnings` WHERE `id` = ?", [id]);
        break;
      }
      case "warrant": {
        citizen = await processQuery("SELECT * FROM `citizens` WHERE `full_name` = ?", [citizenId]);
        await processQuery("DELETE FROM `warrants` WHERE `id` = ?", [id]);
        break;
      }
      default: {
        return res
          .json({
            error: "invalid type",
            status: "error",
          })
          .status(400);
      }
    }

    const [vehicles, weapons, warnings, arrestReports, tickets, warrants] = await Promise.all([
      processQuery("SELECT * FROM `registered_cars` WHERE `citizen_id` = ?", [citizenId]),
      processQuery("SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?", [citizenId]),
      processQuery("SELECT * FROM `written_warnings` WHERE `citizen_id` = ?", [citizenId]),
      processQuery("SELECT * FROM `arrest_reports` WHERE `citizen_id` = ?", [citizenId]),
      processQuery("SELECT * FROM `leo_tickets` WHERE `citizen_id` = ?", [citizenId]),
      processQuery("SELECT * FROM `warrants` WHERE `citizen_id` = ?", [citizenId]),
    ]);

    return res.json({
      citizen: citizen[0],
      writtenWarnings: warnings,
      vehicles,
      weapons,
      arrestReports,
      tickets,
      warrants,
      status: "success",
    });
  },
);

export default router;
