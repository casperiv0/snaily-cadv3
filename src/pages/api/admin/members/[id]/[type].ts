import { NextApiResponse } from "next";
import { AnError } from "@lib/consts";
import { processQuery } from "@lib/database";
import { logger } from "@lib/logger";
import { IRequest } from "src/interfaces/IRequest";
import useAuth from "@hooks/useAuth";
import { usePermission } from "@hooks/usePermission";
import { User } from "types/User";
import { formatRequired } from "@lib/utils.server";

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
    case "POST": {
      try {
        const { reason } = req.body;
        const { type, id } = req.query;

        if (type === "ban" && !reason) {
          return res.status(400).json({
            error: formatRequired(["reason"], req.body),
            status: "error",
          });
        }

        const [member] = await processQuery<User>(
          "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `supervisor`, `edit_passwords` FROM `users` WHERE `id` = ?",
          [id],
        );

        if (!member) {
          return res.status(400).json({
            error: "Member was not found",
            status: "error",
          });
        }

        if (member.rank === "owner") {
          return res.status(401).json({
            error: "Cannot ban the owner",
            status: "error",
          });
        }

        if (member.id === req.userId) {
          return res.status(400).json({
            error: "cannot ban yourself",
            status: "error",
          });
        }

        switch (type) {
          case "ban": {
            await processQuery("UPDATE `users` SET `banned` = ?, `ban_reason` = ? WHERE `id` = ?", [
              "1",
              reason,
              id,
            ]);
            break;
          }
          case "unban": {
            await processQuery("UPDATE `users` SET `banned` = ?, `ban_reason` = ? WHERE `id` = ?", [
              "0",
              "",
              id,
            ]);
            break;
          }
          case "accept": {
            await processQuery("UPDATE `users` SET `whitelist_status` = ? WHERE `id` = ?", [
              "accepted",
              id,
            ]);
            break;
          }
          case "decline": {
            await processQuery("DELETE FROM `users` WHERE `id` = ?", [id]);
            break;
          }
          case "remove": {
            await processQuery("DELETE FROM `users` WHERE `id` = ?", [id]);
            break;
          }
          default: {
            return res.status(400).json({ error: "Invalid path", status: "error" });
          }
        }

        const members = await processQuery(
          "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `edit_passwords`  FROM `users`",
        );
        const [
          updated,
        ] = await processQuery(
          "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `edit_passwords` FROM `users` WHERE `id` = ?",
          [req.query.id],
        );

        return res.json({ status: "success", member: updated, members });
      } catch (e) {
        logger.error("get_members", e);

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
