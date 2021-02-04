import { Response, Router } from "express";
import { processQuery } from "../lib/database";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
// import { v4 } from "uuid";
import { useAdminAuth } from "./values";
import IUser from "../interfaces/IUser";
import Citizen from "../interfaces/Citizen";
import Logger from "../lib/Logger";
import Officer from "../interfaces/Officer";
const router: Router = Router();

interface Item {
  value: string;
  label: string;
}

/* Cad settings */
router.put("/cad-settings", useAuth, async (req: IRequest, res: Response) => {
  const user = await processQuery<IUser[]>("SELECT `rank` from `users` WHERE `id` = ?", [
    req.user?.id,
  ]);

  if (user[0].rank !== "owner") {
    return res.json({ error: "Forbidden", status: "error" }).status(403);
  }

  const {
    cad_name,
    aop,
    tow_whitelisted,
    whitelisted,
    company_whitelisted,
    webhook_url,
  } = req.body;

  if (cad_name && aop && tow_whitelisted && whitelisted && company_whitelisted) {
    await processQuery(
      "UPDATE `cad_info` SET `cad_name` = ?, `AOP` = ?, `tow_whitelisted` = ?, `whitelisted` = ?, `company_whitelisted` = ?, `webhook_url`= ?",
      [cad_name, aop, tow_whitelisted, whitelisted, company_whitelisted, webhook_url]
    );

    return res.json({ status: "success" });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

/* members */
router.get("/members", useAuth, useAdminAuth, async (_req: IRequest, res: Response) => {
  const members = await processQuery<IUser[]>(
    "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`  FROM `users` ORDER BY `username` ASC"
  );

  return res.json({ status: "success", members });
});

router.get("/members/:id", useAuth, useAdminAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const member = await processQuery<IUser[]>(
    "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status` FROM `users` WHERE `id` = ?",
    [id]
  );

  return res.json({ status: "success", member: member[0] });
});

router.put("/members/:id", useAuth, useAdminAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { rank, leo, dispatch, emsFd, tow } = req.body;

  if (rank && leo && dispatch && emsFd && tow) {
    await processQuery(
      "UPDATE `users` SET `rank` = ?, `leo` = ?, `dispatch` = ?, `ems_fd` = ?, `tow` = ? WHERE `id` = ?",
      [rank, leo, dispatch, emsFd, tow, id]
    );

    const updated = await processQuery<IUser[]>(
      "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status` FROM `users` WHERE `id` = ?",
      [id]
    );

    return res.json({ status: "success", member: updated[0] });
  } else {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }
});

router.put("/members/:path/:id", useAuth, useAdminAuth, async (req: IRequest, res: Response) => {
  const { path, id } = req.params;
  const { ban_reason } = req.body;

  switch (path) {
    case "ban": {
      if (ban_reason) {
        if (req.user?.id === id) {
          return res.json({ error: "You  can't ban yourself", status: "error" });
        }

        await processQuery("UPDATE `users` SET `banned` = ?, `ban_reason` = ? WHERE `id` = ?", [
          "1",
          ban_reason,
          id,
        ]);
      } else {
        return res.json({ error: "Please provide a ban reason", status: "error" });
      }
      break;
    }
    case "unban": {
      await processQuery("UPDATE `users` SET `banned` = ?, `ban_reason` = ? WHERE `id` = ?", [
        "0",
        "",
        id,
      ]);
      break;
    }
    case "accept": {
      await processQuery("UPDATE `users` SET `whitelist_status` = ? WHERE `id` = ?", [
        "accepted",
        id,
      ]);
      break;
    }
    case "decline": {
      await processQuery("DELETE FROM `users` WHERE `id` = ?", [id]);
      break;
    }
    default: {
      return res.json({ error: "Invalid path", status: "error" });
    }
  }

  const members = await processQuery<IUser[]>(
    "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`  FROM `users`"
  );

  const updated = await processQuery<IUser[]>(
    "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status` FROM `users` WHERE `id` = ?",
    [id]
  );

  return res.json({ status: "success", member: updated[0], members });
});

/* citizens */
router.get("/citizens", useAuth, useAdminAuth, async (_req: IRequest, res: Response) => {
  const citizens = await processQuery("SELECT * FROM `citizens`");

  await citizens.forEach(async (citizen: Citizen & { user: { username: string } }) => {
    const user = await processQuery("SELECT `username` FROM `users` WHERE `id` = ?", [
      citizen.user_id,
    ]);

    citizen.user = user[0];

    return citizen;
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  return res.json({ citizens, status: "success" });
});

router.get("/expungement-requests", useAuth, useAdminAuth, async (_req, res: Response) => {
  const requests = await processQuery("SELECT * FROM `court_requests`");

  return res.json({
    status: "success",
    requests: requests.map((request: any) => {
      request.warrants = JSON.parse(request.warrants);
      request.arrestReports = JSON.parse(request.arrest_reports);
      request.tickets = JSON.parse(request.tickets);
      return request;
    }),
  });
});

router.put(
  "/expungement-requests/:requestId/:type",
  useAuth,
  useAdminAuth,
  async (req: IRequest, res: Response) => {
    const { requestId, type } = req.params;

    switch (type) {
      case "accept": {
        // value to remove from the citizen
        const { warrants, arrestReports, tickets } = req.body;

        warrants.forEach(async (warrant: Item) => {
          await processQuery("DELETE FROM `warrants` WHERE `id` = ?", [warrant.value]);
        });
        arrestReports.forEach(async (arr: Item) => {
          await processQuery("DELETE FROM `arrest_reports` WHERE `id` = ?", [arr.value]);
        });
        tickets.forEach(async (ticket: Item) => {
          await processQuery("DELETE FROM `leo_tickets` WHERE `id` = ?", [ticket.value]);
        });

        await processQuery("DELETE FROM `court_requests` WHERE `id` = ?", [requestId]);
        break;
      }
      case "decline": {
        await processQuery("DELETE FROM `court_requests` WHERE `id` = ?", [requestId]);
        break;
      }
      default: {
        return res.json({
          error: "invalid type",
          status: "error",
        });
      }
    }

    const updated = await processQuery("SELECT * FROM `court_requests`");

    return res.json({
      status: "success",
      requests: updated.map((request: any) => {
        request.warrants = JSON.parse(request.warrants);
        request.arrestReports = JSON.parse(request.arrest_reports);
        request.tickets = JSON.parse(request.tickets);
        return request;
      }),
    });
  }
);

router.delete("/citizens/:id", useAuth, useAdminAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  await processQuery("DELETE FROM `citizens` WHERE `id` = ?", [id]);

  const citizens = await processQuery("SELECT * FROM `citizens`");

  return res.json({ citizens, status: "success" });
});

/* companies */
router.get("/companies", useAuth, async (_req: IRequest, res: Response) => {
  const companies = await processQuery("SELECT * FROM `businesses`");

  await companies.forEach(async (company: any) => {
    const user = await processQuery("SELECT `username` FROM `users` WHERE `id` = ?", [
      company.user_id,
    ]);

    company.user = user[0];

    return company;
  });

  await new Promise((resolve) => setTimeout(resolve, 500));

  return res.json({ companies, status: "success" });
});

router.delete("/companies/:id", useAuth, useAdminAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  const employees = await processQuery<Citizen[]>(
    "SELECT * FROM `citizens` WHERE `business_id` = ?",
    [id]
  );

  employees?.forEach(async (em: Citizen) => {
    await processQuery(
      "UPDATE `citizens` SET `business_id` = ?, `business` = ?, `rank` = ?, `vehicle_reg` = ?, `posts` = ?, `b_status` = ? WHERE `id` = ?",
      ["", "none", "", "1", "1", "", em.id]
    );
  });

  await processQuery("DELETE FROM `businesses` WHERE `id` = ?", [id]);

  const companies = await processQuery("SELECT * FROM `businesses`");

  return res.json({ companies, status: "success" });
});

router.get("/officers", useAuth, useAdminAuth, async (_req: IRequest, res: Response) => {
  try {
    const officers = await processQuery<Officer[]>("SELECT * FROM `officers`");

    return res.json({ status: "success", officers });
  } catch (e) {
    Logger.error("UPDATE_CALLSIGN", e);
    return res.json({ status: "error", error: "An unexpected error occurred" });
  }
});

router.get("/officers/:id", useAuth, useAdminAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;

  try {
    const officer = await processQuery<Officer[]>("SELECT * FROM `officers` WHERE `id` = ?", [id]);

    return res.json({ status: "success", officer: officer[0] });
  } catch (e) {
    Logger.error("GET_OFFICER_BY_ID", e);
    return res.json({ error: "An unexpected error occurred", status: "error" });
  }
});

router.put("/officers/:officerId", useAuth, useAdminAuth, async (req: IRequest, res: Response) => {
  const { officerId } = req.params;
  const callsign = req.body.callsign;

  if (!callsign) {
    return res.json({
      error: "callsign must be provided",
      status: "error",
    });
  }

  try {
    await processQuery("UPDATE `officers` SET `callsign` = ? WHERE `id` = ?", [
      callsign,
      officerId,
    ]);

    return res.json({ status: "success" });
  } catch (e) {
    Logger.error("UPDATE_CALLSIGN", e);
    return res.json({ status: "error", error: "An unexpected error occurred" });
  }
});

export default router;
