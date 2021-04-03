import IRequest from "../../interfaces/IRequest";
import { useAuth } from "../../hooks";
import { Router, Response } from "express";
import { processQuery } from "../../lib/database";
import { v4 as uuidv4 } from "uuid";
import { createNotification } from "../notifications";
const router: Router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const companies = await processQuery("SELECT `id`, `name` FROM `businesses`");
  const citizens = await processQuery("SELECT * FROM `citizens` WHERE `user_id` = ?", [req.userId]);

  return res.json({ citizens, companies, status: "success" });
});

router.post("/join", useAuth, async (req: IRequest, res: Response) => {
  const { company_id, citizen_id } = req.body;

  if (!company_id || !citizen_id) {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }

  const citizen = await processQuery("SELECT `id`, `full_name` FROM `citizens` WHERE `id` = ?", [
    citizen_id,
  ]);
  const company = await processQuery("SELECT * FROM `businesses` WHERE `id` = ?", [company_id]);

  if (!citizen[0]) {
    return res.json({
      error: "Citizen was not found",
      status: "error",
    });
  }

  if (!company[0]) {
    return res.json({
      error: "Company was not found",
      status: "error",
    });
  }

  const bStatus = company[0].whitelisted === "0" ? "accepted" : "pending";

  await processQuery(
    "UPDATE `citizens` SET `business` = ?, `business_id` = ?, `b_status` = ?, `rank` = ?  WHERE `id` = ?",
    [company[0].name, company[0].id, bStatus, "employee", citizen[0].id],
  );

  if (company[0].whitelisted === "1") {
    await createNotification(
      "Company request",
      `Citizen: ${citizen[0].full_name} would like to join your company!`,
      `/company/${company[0].citizen_id}/${company[0].id}/manage#pending_citizens`,
      req.userId,
    );
  }

  return res.json({
    status: "success",
    companyId: company[0].id,
    citizenId: citizen[0].id,
  });
});

router.post("/create", useAuth, async (req: IRequest, res: Response) => {
  const { name, address, whitelist, owner_id } = req.body;

  if (!name || !address || !whitelist || !owner_id) {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }

  const exists = await processQuery("SELECT `id` FROM `businesses` WHERE `name` = ?", [name]);

  if (exists[0]) {
    return res.json({
      error: "Name is already in use",
      status: "error",
    });
  }

  const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [owner_id]);
  const businessId = uuidv4();

  await processQuery(
    "UPDATE `citizens` SET `business` = ?, `business_id` = ?, `rank` = ?, `b_status` = ? WHERE `id` = ?",
    [name, businessId, "owner", "accepted", citizen[0].id],
  );
  await processQuery(
    "INSERT INTO `businesses` (`id`, `name`, `owner`, `user_id`, `citizen_id`, `whitelisted`, `address`) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [businessId, name, citizen[0].full_name, req.userId, citizen[0].id, whitelist, address],
  );

  return res.json({
    status: "success",
    companyId: businessId,
    citizenId: citizen[0].id,
  });
});

router.post("/post", useAuth, async (req: IRequest, res: Response) => {
  const { title, description, company_id, citizen_id } = req.body;

  if (!title || !description || !company_id || !citizen_id) {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }

  const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizen_id]);
  const company = await processQuery("SELECT * FROM `businesses` WHERE `id` = ?", [company_id]);

  if (!citizen[0]) {
    return res.json({
      error: "Citizen was not found",
      status: "error",
    });
  }

  if (!company[0]) {
    return res.json({
      error: "Company was not found",
      status: "error",
    });
  }

  if (citizen[0].business_id !== company[0].id) {
    return res.json({
      error: "You are not working at this company",
      status: "error",
    });
  }

  if (citizen[0].posts === "0") {
    return res.json({
      error: "You are not allowed to create posts for this company",
      status: "error",
    });
  }

  const postId = uuidv4();
  const uploadedAt = Date.now();

  await processQuery(
    "INSERT INTO `posts` (`id`, `business_id`, `title`, `description`, `citizen_id`, `uploaded_at`, `uploaded_by`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
    [
      postId,
      company_id,
      title,
      description,
      citizen[0].id,
      uploadedAt,
      citizen[0].full_name,
      req.userId,
    ],
  );

  const updated = await processQuery(
    "SELECT * FROM `posts` WHERE `business_id` = ? ORDER BY `uploaded_at` DESC",
    [company_id],
  );
  return res.json({
    status: "success",
    companyId: company_id,
    citizenId: citizen_id,
    posts: updated,
  });
});

router.post("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const { citizenId } = req.body;

  if (!citizenId) {
    return res.json({
      error: "Please provide a citizenId",
      status: "error",
    });
  }

  const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizenId]);

  if (!citizen[0]) {
    return res.json({
      error: "Citizen was not found",
      status: "error",
    });
  }

  if (citizen[0].b_status === "pending") {
    return res.json({
      error: "You are still awaiting access to this company",
      status: "error",
    });
  }

  const company = await processQuery("SELECT * FROM `businesses` WHERE `id` = ?", [id]);

  if (!company[0]) {
    return res.json({
      error: "Company was not found",
      status: "error",
    });
  }

  const posts = await processQuery(
    "SELECT * FROM `posts` WHERE `business_id` = ? ORDER BY `uploaded_at` DESC",
    [id],
  );
  const employees = await processQuery("SELECT * FROM `citizens` WHERE `business_id` = ?", [id]);
  const vehicles = await processQuery("SELECT * FROM `registered_cars` WHERE `business_id` = ?", [
    id,
  ]);

  return res.json({
    company: company[0],
    posts,
    employees,
    vehicles,
    status: "success",
  });
});

/**
 * Update the settings of the business
 */
router.put("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { name, whitelisted, address } = req.body;
  const { id } = req.params;

  if (!name || !whitelisted || !address) {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }

  const company = await processQuery("SELECT * FROM `businesses` WHERE `id` = ?", [id]);

  if (name.toLowerCase() !== company[0].name.toLowerCase()) {
    const existing = await processQuery("SELECT * FROM `businesses` WHERE `name` = ?", [name]);

    if (existing[0]) {
      return res.json({
        error: "Name is already in use",
        status: "error",
      });
    }
  }

  await processQuery(
    "UPDATE `businesses` SET `name` = ?, `address` = ?, `whitelisted` = ? WHERE `id` = ?",
    [name, address, whitelisted, id],
  );

  return res.json({ status: "success" });
});

router.put("/:companyId/:employeeId/:type", useAuth, async (req: IRequest, res: Response) => {
  const { companyId, employeeId, type } = req.params;
  const { rank, citizenId, posts, can_reg_veh } = req.body;

  if (!citizenId) {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }

  const company = await processQuery("SELECT * FROM `businesses` WHERE `id` = ?", [companyId]);
  const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizenId]);
  const employee = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [employeeId]);

  if (!company[0]) {
    return res.json({
      error: "Company was not found",
      status: "error",
    });
  }

  if (!citizen[0]) {
    return res.json({
      error: "Citizen was not found",
      status: "error",
    });
  }

  if (!employee[0]) {
    return res.json({
      error: "Employee was not found",
      status: "error",
    });
  }

  if (citizen[0].business_id !== company[0].id) {
    return res.json({
      error: "Forbidden, you are not working here!",
      status: "error",
    });
  }

  if (!["owner", "manager"].includes(citizen[0].rank)) {
    return res.json({
      error: "Forbidden, You need to be manager or up",
      status: "error",
    });
  }

  switch (type) {
    case "UPDATE": {
      if (can_reg_veh && posts && rank) {
        if (rank.toLowerCase() === "owner") {
          return res.json({
            error: "Cannot set rank to `owner`",
            status: "error",
          });
        }

        await processQuery(
          "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ? WHERE `id` = ?",
          [rank, can_reg_veh, posts, employeeId],
        );
      } else {
        return res.json({
          error: "Please fill in all fields",
          status: "error",
        });
      }
      break;
    }
    case "FIRE": {
      await processQuery(
        "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ?, business = ?, `business_id` = ?  WHERE `id` = ?",
        ["", "1", "1", "none", "", employeeId],
      );
      break;
    }
    case "ACCEPT":
      await processQuery(
        "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ?, `b_status` = ?  WHERE `id` = ?",
        ["employee", "1", "1", "accepted", employeeId],
      );
      break;
    case "DECLINE":
      await processQuery(
        "UPDATE `citizens` SET `rank` = ?, `vehicle_reg` = ?, `posts` = ?, `b_status` = ?, business = ?, `business_id` = ?  WHERE `id` = ?",
        ["", "1", "1", "declined", "none", "", employeeId],
      );
      break;
    default: {
      return res.json({
        error: "type does not exist",
        status: "error",
      });
    }
  }

  const employees = await processQuery("SELECT * FROM `citizens` WHERE `business_id` = ?", [
    companyId,
  ]);

  return res.json({
    status: "success",
    employees,
  });
});

router.delete("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { citizenId } = req.body;
  const { id } = req.params;

  if (!citizenId) {
    return res.json({
      error: "Please fill in all fields",
      status: "error",
    });
  }

  const citizen = await processQuery("SELECT * FROM `citizens` WHERE `id` = ?", [citizenId]);

  if (!citizen[0]) {
    return res.json({
      error: "Citizen was not found",
      status: "error",
    });
  }

  if (citizen[0].rank !== "owner") {
    return res.json({
      error: "Forbidden",
      status: "error",
    });
  }

  await processQuery(
    "UPDATE `citizens` SET `business` = ?, `business_id` = ?, `rank` = ? WHERE `business_id` = ?",
    ["none", "", "", id],
  );

  await processQuery("DELETE FROM `businesses` WHERE `id` = ?", [id]);

  return res.json({ status: "success" });
});

export default router;
