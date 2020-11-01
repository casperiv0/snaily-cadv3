import IRequest from "../../interfaces/IRequest";
import { useAuth } from "../../hooks";
import { Router, Response } from "express";
import { processQuery } from "../../lib/database";
import { v4 as uuidv4 } from "uuid";
const router: Router = Router();

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const companies = await processQuery("SELECT `id`, `name` FROM `businesses`");
  const citizens = await processQuery(
    "SELECT * FROM `citizens` WHERE `user_id` = ?",
    [req.user?.id]
  );

  return res.json({ citizens, companies, status: "success" });
});

router.get("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const company = await processQuery(
    "SELECT * FROM `businesses` WHERE `id` = ?",
    [id]
  );
  const posts = await processQuery(
    "SELECT * FROM `posts` WHERE `business_id` = ?",
    [id]
  );

  return res.json({ company: company[0], posts, status: "success" });
});

router.post("/join", useAuth, async (req: IRequest, res: Response) => {
  const { company_id, citizen_id } = req.body;

  if (company_id && citizen_id) {
    const citizen = await processQuery(
      "SELECT `id`, `full_name` FROM `citizens` WHERE `id` = ?",
      [citizen_id]
    );
    const company = await processQuery(
      "SELECT * FROM `businesses` WHERE `id` = ?",
      [company_id]
    );

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
      "UPDATE `citizens` SET `business` = ?, `business_id` = ?, `b_status` = ? WHERE `id` = ?",
      [company[0].name, company[0].id, bStatus, citizen[0].id]
    );

    return res.json({
      status: "success",
      companyId: company[0].id,
      citizenId: citizen[0].id,
    });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

router.post("/create", useAuth, async (req: IRequest, res: Response) => {
  const { name, address, whitelist, owner_id } = req.body;

  if (name && address && whitelist && owner_id) {
    const exists = await processQuery(
      "SELECT `id` FROM `businesses` WHERE `name` = ?",
      [name]
    );

    if (exists[0]) {
      return res.json({
        error: "Name is already in use",
        status: "error",
      });
    }

    const citizen = await processQuery(
      "SELECT * FROM `citizens` WHERE `id` = ?",
      [owner_id]
    );
    const businessId = uuidv4();

    await processQuery(
      "UPDATE `citizens` SET `business` = ?, `business_id` = ? WHERE `id` = ?",
      [name, businessId, citizen[0].id]
    );
    await processQuery(
      "INSERT INTO `businesses` (`id`, `name`, `owner`, `user_id`, `citizen_id`, `whitelisted`, `address`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        businessId,
        name,
        citizen[0].full_name,
        req.user?.id,
        citizen[0].id,
        whitelist,
        address,
      ]
    );

    return res.json({
      status: "success",
      companyId: businessId,
      citizenId: citizen[0].id,
    });
  } else {
    return res.json({ error: "Please fill in all fields", status: "error" });
  }
});

export default router;
