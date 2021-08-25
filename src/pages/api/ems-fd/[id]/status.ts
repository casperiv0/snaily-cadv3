import { NextApiResponse } from "next";
import useAuth from "hooks/useAuth";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import { usePermission } from "hooks/usePermission";
import { formatRequired } from "lib/utils.server";
import { Code10 } from "types/Code10";
import { useCookie } from "hooks/useCookie";
import { Deputy } from "types/Deputy";

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
    await usePermission(req, ["ems_fd", "dispatch"]);
  } catch (e) {
    return res.status(e?.code ?? 401).json({
      status: "error",
      error: e,
    });
  }

  switch (req.method) {
    case "PUT": {
      try {
        const { status2, status } = req.body;

        const [code] = await processQuery<Code10>("SELECT * FROM `10_codes` WHERE `code` = ?", [
          status2,
        ]);

        if (!status2 || !status) {
          return res.status(400).json({
            error: formatRequired(["status", "status2"], req.body),
            status: "error",
          });
        }

        await processQuery("UPDATE `ems-fd` SET `status` = ?, `status2` = ? WHERE `id` = ?", [
          code?.should_do === "set_off_duty" ? "off-duty" : status,
          code?.should_do === "set_off_duty" ? "--------" : status2,
          req.query.id,
        ]);

        const [updated] = await processQuery<Deputy>("SELECT * FROM `ems-fd` WHERE `id` = ?", [
          req.query.id,
        ]);

        if (code?.should_do === "set_off_duty") {
          useCookie(res, "", "active-deputy", new Date(Date.now()));
        } else {
          useCookie(res, updated?.id ?? "", "active-deputy");
        }

        return res.json({ status: "success", deputy: updated });
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
