import { NextApiResponse } from "next";
import useAuth from "@hooks/useAuth";
import { processQuery } from "@lib/database";
import { IRequest } from "types/IRequest";
import { logger } from "@lib/logger";
import { AnError, RanksArr } from "@lib/consts";
import { Bleet } from "types/Bleet";
import { User } from "types/User";
import { formatRequired } from "@lib/utils.server";
import { useMarkdown } from "@hooks/useMarkdown";

export default async function handler(req: IRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await useAuth(req);
  } catch (e) {
    return res.status(e?.code ?? 400).json({
      status: "error",
      error: e,
    });
  }

  switch (method) {
    case "GET": {
      try {
        const [bleet] = await processQuery<Bleet>(
          "SELECT * FROM `bleets` WHERE `bleets`.`id` = ?",
          [req.query.id],
        );
        const [uploadedBy] = await processQuery<User>(
          "SELECT `username` FROM `users` WHERE `id` = ?",
          [bleet.user_id],
        );

        return res.json({
          status: "success",
          bleet: { ...bleet, uploadedBy: uploadedBy?.username ?? null },
        });
      } catch (e) {
        logger.error("get_bleets", e);

        return res.status(500).json(AnError);
      }
    }
    case "PUT": {
      try {
        const [bleet] = await processQuery<Bleet>(
          "SELECT * FROM `bleets` WHERE `bleets`.`id` = ?",
          [req.query.id],
        );
        const [uploadedBy] = await processQuery<{ username: string }>(
          "SELECT `username` FROM `users` WHERE `id` = ?",
          [bleet.user_id],
        );

        if (!bleet) {
          return res.json({
            error: "Bleet was not found",
            status: "error",
          });
        }

        if (bleet.user_id !== req.userId) {
          return res.json({
            error: "Forbidden",
            status: "error",
          });
        }

        const { title, body } = req.body;

        if (!title || !body) {
          return res.json({
            error: formatRequired(["title", "body"], req.body),
            status: "error",
          });
        }

        const markdown = useMarkdown(body);
        await processQuery(
          "UPDATE `bleets` SET `title` = ?, `body` = ?, `markdown` = ? WHERE `bleets`.`id` = ?",
          [title, body, markdown, req.query.id],
        );

        const [updated] = await processQuery<Bleet>(
          "SELECT * FROM `bleets` WHERE `bleets`.`id` = ?",
          [req.query.id],
        );
        return res.json({
          status: "success",
          bleet: {
            ...updated,
            uploadedBy: uploadedBy.username,
          },
        });
      } catch (e) {
        logger.error("get_bleets", e);

        return res.status(500).json(AnError);
      }
    }
    case "DELETE": {
      try {
        const [user] = await processQuery<User>("SELECT `rank` FROM `users` WHERE `id` = ?", [
          req.userId,
        ]);
        const rank = user.rank;
        const [bleet] = await processQuery<Bleet>("SELECT * FROM `bleets` WHERE `id` = ?", [
          req.query.id,
        ]);

        if (!bleet) {
          return res.json({ status: "error", error: "Bleet was not found" });
        }

        if (RanksArr.includes(rank) || bleet.user_id === req.userId) {
          await processQuery("DELETE FROM `bleets` WHERE `bleets`.`id` = ?", [req.query.id]);

          return res.json({ status: "success" });
        } else {
          return res.json({ error: "Forbidden", status: "error" });
        }
      } catch (e) {
        logger.error("DELETE_CITIZEN", e);

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