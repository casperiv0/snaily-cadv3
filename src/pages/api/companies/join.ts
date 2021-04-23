import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Company } from "types/Company";
import { createNotification, formatRequired } from "@lib/utils.server";
import { Citizen } from "types/Citizen";

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
      const { company_id, citizen_id } = req.body;

      if (!company_id || !citizen_id) {
        return res.status(400).json({
          error: formatRequired(["company_id", "citizen_id"], req.body),
          status: "error",
        });
      }

      const [citizen] = await processQuery<Citizen>(
        "SELECT `id`, `full_name` FROM `citizens` WHERE `id` = ? AND `user_id` = ?",
        [citizen_id, req.userId],
      );
      const [company] = await processQuery<Company>("SELECT * FROM `businesses` WHERE `id` = ?", [
        company_id,
      ]);

      if (!citizen) {
        return res.status(404).json({
          error: "Citizen was not found",
          status: "error",
        });
      }

      if (!company) {
        return res.status(404).json({
          error: "Company was not found",
          status: "error",
        });
      }

      const bStatus = company.whitelisted === "0" ? "accepted" : "pending";

      await processQuery(
        "UPDATE `citizens` SET `business` = ?, `business_id` = ?, `b_status` = ?, `rank` = ?  WHERE `id` = ?",
        [company.name, company.id, bStatus, "employee", citizen.id],
      );

      if (company.whitelisted === "1") {
        await createNotification(
          "Company request",
          `Citizen: ${citizen.full_name} would like to join your company!`,
          `/company/${company.citizen_id}/${company.id}/manage#pending_citizens`,
          req.userId,
        );

        return res.status(401).json({
          error:
            "This citizen is still pending access for this company. You'll be able to view it once you have been accepted!",
          status: "error",
        });
      }

      return res.json({
        status: "success",
        companyId: company.id,
        citizenId: citizen.id,
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
