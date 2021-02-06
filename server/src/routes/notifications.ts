import { Router, Response } from "express";
import { useAuth } from "../hooks";
import IRequest from "../interfaces/IRequest";
import { processQuery } from "../lib/database";
import Notification from "../interfaces/Notification";
import { v4 } from "uuid";
import Logger from "../lib/Logger";

const router = Router();

export async function createNotification(
  title: string,
  text: string,
  href: string,
  userId: string | undefined,
): Promise<void> {
  if (!userId) return;
  try {
    await processQuery(
      "INSERT INTO `notifications` (`id`, `title`, `text`, `href`, `user_id`) VALUES (?, ?, ?, ?, ?)",
      [v4(), title, text, href, userId],
    );
  } catch (e) {
    Logger.error("CREATE_NOTIFICATION", e);
  }
}

router.get("/", useAuth, async (req: IRequest, res: Response) => {
  const notifications = await processQuery<Notification[]>("SELECT * FROM `notifications` WHERE `user_id` = ?", [
    req.user?.id,
  ]);

  return res.json({
    status: "success",
    notifications,
  });
});

router.delete("/:id", useAuth, async (req: IRequest, res: Response) => {
  const { id } = req.params;
  const notification = await processQuery<Notification[]>("SELECT * FROM `notifications` WHERE `id`= ?", [id]);

  if (!notification[0]) {
    return res.json({
      error: "Notification not found",
      status: "error",
    });
  }

  if (notification[0].user_id !== req.user?.id) {
    return res.json({
      status: "error",
      error: "notification not linked to this account",
    });
  }

  await processQuery("DELETE FROM `notifications` WHERE `id` = ?", [id]);
  const notifications = await processQuery<Notification[]>("SELECT * FROM `notifications` WHERE `user_id` = ?", [
    req.user?.id,
  ]);

  return res.json({
    status: "success",
    notifications,
  });
});

export default router;
