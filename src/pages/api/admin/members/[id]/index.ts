import { NextApiResponse } from "next";
import { AnError } from "lib/consts";
import { processQuery } from "lib/database";
import { logger } from "lib/logger";
import { IRequest } from "types/IRequest";
import useAuth from "hooks/useAuth";
import { usePermission } from "hooks/usePermission";
import { User } from "types/User";
import { formatRequired } from "lib/utils.server";

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
        const [member] = await processQuery<User>(
          "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `supervisor`, `edit_passwords` FROM `users` WHERE `id` = ?",
          [req.query.id],
        );

        return res.json({ status: "success", member });
      } catch (e) {
        logger.error("get_members", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      const body = req.body;

      if (!body.rank || !body.leo || !body.dispatch || !body.emsFd || !body.supervisor) {
        return res.status(400).json({
          error: formatRequired(["rank", "leo", "dispatch", "emsFd", "supervisor"], req.body),
          status: "error",
        });
      }

      const [previous] = await processQuery<User>(
        "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `supervisor`, `edit_passwords` FROM `users` WHERE `id` = ?",
        [req.query.id],
      );

      if (!previous) {
        return res.status(404).json({
          error: "Member was not found",
          status: "error",
        });
      }

      if (previous.rank === "owner" && body.rank?.toLowerCase() !== "owner") {
        return res.status(400).json({
          error: "Cannot change the owner's rank",
          status: "error",
        });
      } else if (previous.rank !== "owner" && body.rank?.toLowerCase() === "owner") {
        return res.status(400).json({
          error: "Rank cannot be set to `owner`",
          status: "error",
        });
      }

      await processQuery(
        "UPDATE `users` SET `rank` = ?, `leo` = ?, `dispatch` = ?, `ems_fd` = ?, `tow` = ?, `supervisor` = ?, `steam_id` = ?, `edit_passwords` = ? WHERE `id` = ?",
        [
          body.rank,
          body.leo ?? previous,
          body.dispatch,
          body.emsFd,
          body.tow,
          body.supervisor,
          body.steam_id ?? previous[0].steam_id,
          ["admin", "owner"].includes(body.rank) ? body.edit_passwords : "0",
          req.query.id,
        ],
      );

      const [updated] = await processQuery<User>(
        "SELECT `id`, `username`, `rank`, `leo`, `ems_fd`, `dispatch`, `tow`, `banned`, `ban_reason`, `whitelist_status`, `steam_id`, `avatar_url`, `supervisor`, `edit_passwords`  FROM `users` WHERE `id` = ?",
        [req.query.id],
      );

      return res.json({ status: "success", member: updated });
    }
    default: {
      return res.status(405).json({
        error: "Method not allowed",
        status: "error",
      });
    }
  }
}
