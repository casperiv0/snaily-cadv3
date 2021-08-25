import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { IRequest } from "types/IRequest";
import { Citizen } from "types/Citizen";
import { Whitelist } from "lib/consts";
import { Company, CompanyPost } from "types/Company";
import { formatRequired } from "lib/utils.server";

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

      const [citizen] = await global.connection
        .query<Citizen>()
        .select("*")
        .from("citizens")
        .where("id", `${citizenId}`)
        .exec();

      const [company] = await global.connection
        .query<Company>()
        .select("*")
        .from("businesses")
        .where("id", `${companyId}`)
        .exec();

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

      await global.connection
        .query<CompanyPost>()
        .insert("posts", {
          id: postId,
          business_id: `${companyId}`,
          title,
          description,
          citizen_id: citizen.id,
          uploaded_at: `${uploadedAt}`,
          uploaded_by: citizen.full_name,
          user_id: req.userId,
        })
        .exec();

      const updatedPosts = await global.connection
        .query<CompanyPost>()
        .select("*")
        .from("posts")
        .where("business_id", `${companyId}`)
        .order("uploaded_at", "DESC")
        .exec();

      return res.json({
        posts: updatedPosts,
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
