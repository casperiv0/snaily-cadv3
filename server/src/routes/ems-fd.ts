import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import { v4 as uuidv4 } from "uuid";
import IRequest from "../interfaces/IRequest";
import usePermission from "../hooks/usePermission";
import Citizen from "../interfaces/Citizen";
const router: Router = Router();

router.get(
  "/my-deputies",
  useAuth,
  usePermission(["ems_fd"]),
  async (req: IRequest, res: Response) => {
    const deputies = await processQuery("SELECT * FROM `ems-fd` WHERE `user_id` = ?", [
      req.user?.id,
    ]);

    return res.json({ deputies, status: "success" });
  },
);

router.post(
  "/my-deputies",
  useAuth,
  usePermission(["ems_fd"]),
  async (req: IRequest, res: Response) => {
    const { name } = req.body;
    const id = uuidv4();

    if (name) {
      await processQuery(
        "INSERT INTO `ems-fd` (`id`, `name`, `user_id`, `status`, `status2`) VALUES (?, ?, ?, ?, ?)",
        [id, name, req.user?.id, "off-duty", "--------"],
      );

      return res.json({ status: "success" });
    } else {
      return res.json({ status: "error", error: "Please fill in all fields" });
    }
  },
);

router.delete(
  "/my-deputies/:id",
  useAuth,
  usePermission(["ems_fd"]),
  async (req: IRequest, res: Response) => {
    const { id } = req.params;

    await processQuery("DELETE FROM `ems-fd` WHERE `id` = ?", [id]);

    const deputies = await processQuery("SELECT * FROM `ems-fd` WHERE `user_id` = ?", [
      req.user?.id,
    ]);

    return res.json({ status: "success", deputies });
  },
);

router.get(
  "/status/:id",
  useAuth,
  usePermission(["ems_fd"]),
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const deputy = await processQuery("SELECT * FROM `ems-fd` WHERE `id` = ?", [id]);

    return res.json({ status: "success", deputy: deputy[0] });
  },
);

router.put(
  "/status/:id",
  useAuth,
  usePermission(["ems_fd"]),
  async (req: IRequest, res: Response) => {
    const { id } = req.params;
    const { status2, status } = req.body;
    await processQuery("UPDATE `ems-fd` SET `status` = ?, `status2` = ? WHERE `id` = ?", [
      status2 === "10-42" ? "off-duty" : status,
      status2 === "10-42" ? "--------" : status2,
      id,
    ]);

    const updated = await processQuery("SELECT * FROM `ems-fd` WHERE `id` = ?", [id]);

    return res.json({ status: "success", deputy: updated[0] });
  },
);

router.get(
  "/medical-records/:name",
  useAuth,
  usePermission(["ems_fd"]),
  async (req: IRequest, res: Response) => {
    const { name } = req.params;

    const citizen = await processQuery(
      "SELECT `dead`, `dead_on` FROM `citizens` WHERE `full_name` = ?",
      [name],
    );

    if (!citizen[0]) {
      return res.json({
        error: "Citizen was not found",
        status: "error",
      });
    }

    const medicalRecords = await processQuery("SELECT * FROM `medical_records` WHERE `name` = ?", [
      name,
    ]);

    if (medicalRecords.length <= 0) {
      return res.json({
        status: "error",
        error: "Citizen doesn't have any medical-records",
      });
    }

    return res.json({ status: "success", medicalRecords, citizen: citizen[0] });
  },
);

router.put(
  "/declare/:citizenId",
  useAuth,
  usePermission(["ems_fd"]),
  async (req: IRequest, res: Response) => {
    const { citizenId } = req.params;
    // alive | dead
    const { declare } = req.query;

    if (!declare) {
      return res.json({
        error: "Please provide a `declare` query",
        status: "error",
      });
    }

    const citizen = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
      citizenId,
    ]);

    if (!citizen[0]) {
      return res.json({
        error: "citizen was not found",
        status: "error",
      });
    }

    switch (`${declare}`.toLowerCase()) {
      case "alive": {
        await processQuery("UPDATE `citizens` SET `dead` = ?, `dead_on` = ? WHERE `id` = ?", [
          "0",
          "",
          citizen[0].id,
        ]);
        break;
      }
      case "dead": {
        await processQuery("UPDATE `citizens` SET `dead` = ?, `dead_on` = ? WHERE `id` = ?", [
          "1",
          Date.now(),
          citizen[0].id,
        ]);
        break;
      }
      default: {
        return res.json({
          error: "Invalid type",
          status: "error",
        });
      }
    }

    return res.json({
      status: "success",
    });
  },
);

export default router;
