import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { Citizen } from "types/Citizen";
import { Whitelist } from "@lib/consts";
import { Company } from "types/Company";
import { formatRequired } from "@lib/utils.server";

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
      const companyId = req.query?.id;
      const citizenId = req.query?.citizenId;
      const { title, description } = req.body;

      if (!citizenId) {
        return res.status(400).json({
          error: "`citizenId` must be provided",
          status: "error",
        });
      }

      if (!title || !description) {
        return res.status(400).json({
          error: formatRequired(["name", "description"], req.body),
          status: "error",
        });
      }

      const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
        citizenId,
      ]);
      const [company] = await processQuery<Company>("SELECT * FROM `businesses` WHERE `id` = ?", [
        companyId,
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

      if (citizen.b_status === Whitelist.Pending) {
        return res.status(404).json({
          error: "You are still awaiting access to this company",
          status: "error",
        });
      }

      if (citizen.business_id !== company.id) {
        return res.status(401).json({
          error: "You are not working at this company!",
          status: "error",
        });
      }

      if (citizen.posts === "0") {
        return res.status(401).json({
          error: "You are not allowed to create posts for this company",
          status: "error",
        });
      }

      const postId = v4();
      const uploadedAt = Date.now();

      await processQuery(
        "INSERT INTO `posts` (`id`, `business_id`, `title`, `description`, `citizen_id`, `uploaded_at`, `uploaded_by`, `user_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
        [
          postId,
          companyId,
          title,
          description,
          citizen.id,
          uploadedAt,
          citizen.full_name,
          req.userId,
        ],
      );

      const updated = await processQuery(
        "SELECT * FROM `posts` WHERE `business_id` = ? ORDER BY `uploaded_at` DESC",
        [companyId],
      );

      return res.json({
        posts: updated,
        status: "success",
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
