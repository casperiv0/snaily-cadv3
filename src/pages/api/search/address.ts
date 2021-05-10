import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "@lib/utils.server";
import { usePermission } from "@hooks/usePermission";
import { Citizen } from "types/Citizen";

export default async function handler(req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  try {
    await usePermission(req, ["dispatch"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }
  switch (req.method) {
    case "POST": {
      try {
        const { address } = req.body;

        if (!address) {
          return res.status(400).json({
            error: formatRequired(["address"], req.body),
            status: "error",
          });
        }

        const results = await global.connection
          .query<Citizen>()
          .select(["full_name", "address", "id"])
          .from("citizens")
          .whereLike("address", `%${address}%`)
          .exec();

        return res.json({ results, status: "success" });
      } catch (e) {
        logger.error("address_search", e);

        return res.status(500).json(AnError);
      }
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
