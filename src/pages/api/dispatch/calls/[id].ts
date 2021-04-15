import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "@hooks/usePermission";
import { Call } from "types/Call";
import { mapCalls } from "../../calls/[type]";

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
    case "PUT": {
      try {
        const { location, assigned_unit, pos, hidden, type } = req.body;
        const description = req.body.description || "No description provided";

        let status = "";

        if (!location) {
          return res.status(400).json({
            error: "`location` must be provided",
            status: "error",
          });
        }

        const [call] = await processQuery<Call>("SELECT `pos` FROM `911calls` WHERE `id` = ?", [
          req.query.id,
        ]);

        let position = {};

        try {
          position = JSON.parse(`${(call as any).pos}`);
        } catch {
          position = { x: null, y: null, z: null };
        }

        if (assigned_unit.length > 0) {
          status = "Assigned";

          assigned_unit?.forEach(async (unit: { value: string; label: string }) => {
            await processQuery("UPDATE `officers` SET `status2` = ? WHERE `id` = ?", [
              "10-97",
              unit.value,
            ]);
          });
        } else {
          status = "Not Assigned";
        }

        if (pos) {
          position = pos;
        }

        // TODO: add socket
        // io.sockets.emit("UPDATE_ACTIVE_UNITS");
        await processQuery(
          "UPDATE `911calls` SET `location` = ?, `description` = ?, `assigned_unit` = ?, `status` = ?, `pos` = ?, `hidden` = ?, `type` = ? WHERE `id` = ?",
          [
            location,
            description,
            JSON.stringify(assigned_unit),
            status,
            JSON.stringify(position),
            hidden || "0",
            type,
            req.query.id,
          ],
        );

        const calls = await processQuery<Call>("SELECT * FROM `911calls`");
        const mappedCalls = await mapCalls(calls as Call[]);

        return res.json({ status: "success", calls: mappedCalls });
      } catch (e) {
        logger.error("update_call", e);
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