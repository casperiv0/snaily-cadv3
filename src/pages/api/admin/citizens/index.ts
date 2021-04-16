import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { Citizen } from "types/Citizen";
import { User } from "types/User";

export default async function (req: IRequest, res: NextApiResponse) {
  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }
  try {
    await usePermission(req, ["admin", "owner", "moderator"]);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "GET": {
      try {
        const citizens = await processQuery("SELECT * FROM `citizens`");

        const parsedCitizens = async () => {
          const arr: Citizen[] = [];

          await Promise.all(
            // @ts-expect-error ignore
            citizens.map(async (citizen: Citizen) => {
              const [user] = await processQuery<User>(
                "SELECT `username` FROM `users` WHERE `id` = ?",
                [citizen.user_id],
              );

              citizen.user = user;

              arr.push(citizen);
            }),
          );

          return arr;
        };

        return res.json({ citizens: await parsedCitizens(), status: "success" });
      } catch (e) {
        logger.error("get_citizens", e);

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
