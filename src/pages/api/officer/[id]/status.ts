import { v4 } from "uuid";
import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "types/IRequest";
import { formatRequired, getWebhookData, postWebhook } from "@lib/utils.server";
import { usePermission } from "@hooks/usePermission";
import { User } from "types/User";
import { Officer, OfficerLog } from "types/Officer";
import { Cad } from "types/Cad";
import { Code10 } from "types/Code10";
import { useCookie } from "@hooks/useCookie";

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
        const { status, status2, timeMs } = req.body;

        const [user] = await processQuery<User>(
          "SELECT `leo`, `dispatch` FROM `users` WHERE `id` = ?",
          [req.userId],
        );
        const [officer] = await processQuery<Officer>(
          "SELECT `id`, `user_id`, `suspended` FROM `officers` WHERE `id` = ?",
          [req.query.id],
        );

        if (!status || !status2 || !timeMs) {
          return res.status(400).json({
            error: formatRequired(["status", "status2", "timeMs"], req.body),
            status: "error",
          });
        }

        if (!officer) {
          return res.status(404).json({
            error: "officer was not found",
            status: "error",
          });
        }

        if (user?.dispatch === "0" && user?.leo === "1" && officer.user_id !== req.userId) {
          return res.status(400).json({
            error: "This officer is not associated with your account.",
            status: "error",
          });
        }

        await processQuery(
          "UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `user_id` = ?",
          ["off-duty", "--------", req.userId],
        );

        const [cadInfo] = await processQuery<Cad>("SELECT * FROM `cad_info`");

        const [code] = await processQuery<Code10>("SELECT * FROM `10_codes` WHERE `code` = ?", [
          status2,
        ]);

        if (code?.should_do !== "set_off_duty" && officer?.suspended === "1") {
          return res.status(403).json({
            error: "This officer is currently suspended",
            status: "error",
          });
        }

        const [officerLog] = await processQuery<OfficerLog>(
          "SELECT * FROM `officer_logs` WHERE `officer_id` = ? AND `active` = ?",
          [req.query.id, "1"],
        );

        if (status2 === cadInfo?.on_duty_status) {
          if (!officerLog) {
            await processQuery(
              "INSERT INTO `officer_logs` (`id`, `officer_id`, `started_at`, `ended_at`, `active`, `user_id`) VALUES (?, ?, ?, ?, ?, ?)",
              [v4(), req.query.id, timeMs, 0, "1", req.userId],
            );
          }
        } else {
          if (code?.should_do === "set_off_duty" || !code) {
            await processQuery(
              "UPDATE `officer_logs` SET `active` = ?, `ended_at` = ? WHERE `id` = ?",
              ["0", timeMs, officerLog?.id],
            );
          }
        }

        await processQuery("UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `id` = ?", [
          code?.should_do === "set_off_duty" ? "off-duty" : status,
          code?.should_do === "set_off_duty" ? "--------" : status2,
          req.query.id,
        ]);

        const [updatedOfficer] = await processQuery<Officer>(
          "SELECT * FROM `officers` WHERE `id` = ?",
          [req.query.id],
        );

        if (code?.should_do === "set_off_duty") {
          useCookie(res, "", "active-officer", new Date(Date.now()));
        } else {
          useCookie(res, updatedOfficer?.id ?? "", "active-officer");
        }

        if (cadInfo?.webhook_url) {
          sendWebhook(cadInfo.webhook_url!, status2, updatedOfficer);
        }

        return res.json({ status: "success", officer: updatedOfficer });
      } catch (e) {
        logger.error("set_status", e);

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

async function sendWebhook(url: string, status2: string, officer: Officer | undefined) {
  const webhook = url && (await getWebhookData(url));
  if (!webhook) return;

  postWebhook(webhook, {
    username: webhook.name,
    avatar_url: webhook.avatar,
    embeds: [
      {
        title: "Status Change",
        type: "rich",
        description: `Officer **${officer?.callsign} ${officer?.officer_name}** of the ${officer?.officer_dept} department has changed their status to ${status2}`,
        fields: [
          {
            name: "ON/OFF duty",
            value: officer?.status ?? "",
            inline: true,
          },
          {
            name: "Status",
            value: officer?.status2 ?? "",
            inline: true,
          },
        ],
      },
    ],
  });
}
