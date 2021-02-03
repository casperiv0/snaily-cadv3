import { NextFunction, Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import penalCodes from "../data/penal-codes";
import IRequest from "../interfaces/IRequest";
import { RanksArr } from "../lib/constants";
import IUser from "../interfaces/IUser";
import Officer from "../interfaces/Officer";
import { useDisLeoAuth } from "./dispatch";
const router: Router = Router();

router.get("/penal-codes", useAuth, useOfficerAuth, (_req: IRequest, res: Response) => {
  return res.json({ penalCodes, status: "success" });
});

router.get("/my-officers", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const officers = await processQuery("SELECT * FROM `officers` WHERE `user_id` = ?", [
    req.user?.id,
  ]);

  return res.json({ officers, status: "success" });
});

router.post("/my-officers", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const { name, department, callsign } = req.body;
  const id = uuidv4();

  if (name && department && callsign) {
    await processQuery(
      "INSERT INTO `officers` (`id`, `officer_name`,`officer_dept`,`callsign`,`user_id`,`status`,`status2`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, name, department, callsign, req.user?.id, "off-duty", ""]
    );

    return res.json({ status: "success" });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.delete("/:id", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  await processQuery("DELETE FROM `officers` WHERE `id` = ?", [id]);

  const officers = await processQuery("SELECT * FROM `officers` WHERE `user_id` = ?", [
    req.user?.id,
  ]);

  return res.json({ status: "success", officers });
});

router.get("/status/:id", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const officer = await processQuery<Officer[]>("SELECT * FROM `officers` WHERE  `id` = ?", [id]);

  return res.json({ officer: officer[0], status: "success" });
});

router.put("/status/:id", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { status, status2 } = req.body;

  if (status && status2) {
    await processQuery("UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `id` = ?", [
      status2 === "10-7" ? "off-duty" : status,
      status2 === "10-7" ? "--------" : status2,
      id,
    ]);

    const updatedOfficer = await processQuery<Officer[]>(
      "SELECT * FROM `officers` WHERE `id` = ?",
      [id]
    );

    return res.json({ status: "success", officer: updatedOfficer[0] });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.get("/departments", useAuth, useOfficerAuth, async (_req: IRequest, res: Response) => {
  const departments = await processQuery("SELECT * FROM `departments`");

  return res.json({ departments, status: "success" });
});

/* searches */
router.post("/search/plate", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const { plate } = req.body;

  if (plate) {
    const result = await processQuery("SELECT * FROM `registered_cars` WHERE `plate` = ?", [plate]);

    return res.json({ plate: result[0] ?? {}, status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/search/name", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const { name } = req.body;

  if (name) {
    const citizen = await processQuery("SELECT * FROM `citizens` WHERE `full_name` = ?", [name]);
    const citizenId = citizen[0]?.id ?? "not_found";

    const vehicles = await processQuery("SELECT * FROM `registered_cars` WHERE `citizen_id` = ?", [
      citizenId,
    ]);
    const weapons = await processQuery(
      "SELECT * FROM `registered_weapons` WHERE `citizen_id` = ?",
      [citizenId]
    );
    const warnings = await processQuery("SELECT * FROM `written_warnings` WHERE `citizen_id` = ?", [
      citizenId,
    ]);
    const arrestReports = await processQuery(
      "SELECT * FROM `arrest_reports` WHERE `citizen_id` = ?",
      [citizenId]
    );
    const tickets = await processQuery("SELECT * FROM `leo_tickets` WHERE `citizen_id` = ?", [
      citizenId,
    ]);
    const warrants = await processQuery("SELECT * FROM `warrants` WHERE `citizen_id` = ?", [
      citizenId,
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
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/search/weapon", useAuth, useOfficerAuth, async (req: IRequest, res: Response) => {
  const { serialNumber } = req.body;

  if (serialNumber) {
    const weapon = await processQuery(
      "SELECT * FROM `registered_weapons` WHERE `serial_number` = ?",
      [serialNumber]
    );

    return res.json({ weapon: weapon[0], status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/note/:citizenId", useAuth, useDisLeoAuth, async (req: IRequest, res: Response) => {
  const { citizenId } = req.params;
  const { note } = req.body;

  if (citizenId && note) {
    await processQuery("UPDATE `citizens` SET `note` = ? WHERE `id` = ?", [note, citizenId]);

    return res.json({ status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

/**
 *
 * Check if the authenticated user has permission to access '/officer' routes
 */
async function useOfficerAuth(
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void | Response> {
  const user: IUser[] = await processQuery(
    "SELECT `leo`, `dispatch`, `rank` from `users` WHERE `id` = ?",
    [req.user?.id]
  );

  if (!user[0]) {
    res.json({
      error: "user not found",
      status: "error",
    });
    return;
  }

  if (user[0].leo === "0" ?? user[0].dispatch === "0" ?? !RanksArr.includes(user[0].rank)) {
    return res.json({
      error: "Forbidden",
      status: "error",
    });
  }

  next();
}

export { useOfficerAuth };
export default router;
