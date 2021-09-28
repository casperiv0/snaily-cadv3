import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "hooks/usePermission";
import { formatRequired } from "lib/utils.server";
import lang from "src/language.json";

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
    await usePermission(req, ["dispatch", "leo"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }
  switch (req.method) {
    case "PUT": {
      try {
        const { type, licenseType } = req.body;

        if (!type || !licenseType) {
          return res.status(400).json({
            error: formatRequired(["type", "licenseType"], req.body),
            status: "error",
          });
        }

        const dbType = type === "suspend" ? lang.officers.suspended : lang.officers.revoked;
        let sql = "UPDATE `citizens` SET ";
        switch (licenseType) {
          case "dmv": {
            sql += "`dmv` = ?";
            break;
          }
          case "ccw": {
            sql += "`ccw` = ?";
            break;
          }
          case "pilot_license": {
            sql += "`pilot_license` = ?";

            break;
          }
          case "fire_license": {
            sql += "`fire_license` = ?";
            break;
          }
          case "cdl_license": {
            sql += "`cdl_license` = ?";
            break;
          }
          default: {
            return res.status(400).json({
              error: "Invalid type",
              status: "error",
            });
          }
        }

        await processQuery(`${sql}WHERE \`id\` = ?`, [dbType, req.query.citizenId]);

        return res.json({ status: "success" });
      } catch (e) {
        logger.error("suspend_license", e);

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
