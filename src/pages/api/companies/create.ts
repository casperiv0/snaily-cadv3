import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Company } from "types/Company";
import { formatRequired } from "@lib/utils.server";
import { Citizen } from "types/Citizen";
import { v4 } from "uuid";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (method) {
    case "POST": {
      const { name, address, whitelist, owner_id } = req.body;

      if (!name || !address || !whitelist || !owner_id) {
        return res.status(400).json({
          error: formatRequired(["name", "address", "whitelist", "owner_id"], req.body),
          status: "error",
        });
      }
      const [exists] = await processQuery<Company>(
        "SELECT `id` FROM `businesses` WHERE `name` = ?",
        [name],
      );

      if (exists) {
        return res.status(400).json({
          error: "Name is already in use",
          status: "error",
        });
      }

      const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        owner_id,
      ]);
      const businessId = v4();

      await processQuery(
        "UPDATE `citizens` SET `business` = ?, `business_id` = ?, `rank` = ?, `b_status` = ? WHERE `id` = ?",
        [name, businessId, "owner", "accepted", citizen?.id],
      );
      await processQuery(
        "INSERT INTO `businesses` (`id`, `name`, `owner`, `user_id`, `citizen_id`, `whitelisted`, `address`) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [businessId, name, citizen?.full_name, req.userId, citizen?.id, whitelist, address],
      );

      return res.json({
        status: "success",
        companyId: businessId,
        citizenId: citizen?.id,
      });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
