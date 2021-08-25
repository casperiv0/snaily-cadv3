import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired } from "lib/utils.server";
import { usePermission } from "hooks/usePermission";
import { Officer } from "types/Officer";

export async function parseOfficers(officers: (Officer | undefined)[]) {
  const arr: Officer[] = [];

  await Promise.all(
    officers.map(async (officer) => {
      if (officer?.citizen_id) {
        const [citizen] = await processQuery<{ full_name: string }>(
          "SELECT `full_name` FROM `citizens` WHERE `id` = ?",
          [officer.citizen_id],
        );

        if (citizen) {
          officer.citizen = citizen;
          return arr.push(officer);
        }
      }

      return arr.push(officer!);
    }),
  );

  return arr;
}

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
    await usePermission(req, ["leo"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }
  switch (req.method) {
    case "GET": {
      try {
        const officers = await processQuery<Officer>(
          "SELECT * FROM `officers` WHERE `user_id` = ?",
          [req.userId],
        );

        return res.json({ officers: await parseOfficers(officers), status: "success" });
      } catch (e) {
        logger.error("name_search", e);

        return res.status(500).json(AnError);
      }
    }
    case "POST": {
      try {
        const { name, department, callsign, citizen_id } = req.body;
        const id = v4();

        if (!name || !department || !callsign) {
          return res.status(400).json({
            error: formatRequired(["name", "department", "callsign"], req.body),
            status: "error",
          });
        }

        if (citizen_id) {
          const [existing] = await processQuery(
            "SELECT `id` FROM `officers` WHERE `citizen_id` = ?",
            [citizen_id],
          );

          if (existing) {
            return res.status(400).json({
              error: "Citizen is already linked to another officer",
              status: "error",
            });
          }

          const [citizen] = await processQuery("SELECT `id` from `citizens` WHERE `id` = ?", [
            citizen_id,
          ]);

          if (!citizen) {
            return res.status(404).json({
              error: "Citizen was not found",
              status: "error",
            });
          }
        }

        await processQuery(
          "INSERT INTO `officers` (`id`, `officer_name`,`officer_dept`,`callsign`,`user_id`,`status`,`status2`,`rank`,`citizen_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [id, name, department, callsign, req.userId, "off-duty", "", "officer", citizen_id],
        );

        const officers = await processQuery<Officer>(
          "SELECT * FROM `officers` WHERE `user_id` = ?",
          [req.userId],
        );
        return res.json({ status: "success", officers: await parseOfficers(officers) });
      } catch (e) {
        logger.error("name_search", e);

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
