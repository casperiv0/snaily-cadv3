import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
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
    await usePermission(req, ["ems_fd"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      try {
        const { citizenId, type } = req.query;

        if (!citizenId || !type) {
          return res.status(400).json({
            error: "`citizenId` & `type` are not provided",
            status: "error",
          });
        }

        const [citizen] = await processQuery<Citizen>("SELECT * FROM `citizens` WHERE `id` = ?", [
          citizenId,
        ]);

        if (!citizen) {
          return res.status(404).json({
            error: "citizen was not found",
            status: "error",
          });
        }

        switch (`${type}`.toLowerCase()) {
          case "alive": {
            await processQuery("UPDATE `citizens` SET `dead` = ?, `dead_on` = ? WHERE `id` = ?", [
              "0",
              "",
              citizen.id,
            ]);
            break;
          }
          case "dead": {
            await processQuery("UPDATE `citizens` SET `dead` = ?, `dead_on` = ? WHERE `id` = ?", [
              "1",
              Date.now(),
              citizen.id,
            ]);
            break;
          }
          default: {
            return res.status(400).json({
              error: "Invalid type",
              status: "error",
            });
          }
        }

        return res.json({
          status: "success",
        });
      } catch (e) {
        logger.error("declare_citizen_dead_alive", e);
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
