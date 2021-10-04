import { parse } from "cookie";
import { NextApiResponse } from "next";
import { IRequest } from "types/IRequest";
import { Officer, OfficerLog } from "types/Officer";
import { SocketEvents } from "../types/Socket";
import { WebHook, WebHookData } from "types/Webhook";
import { v4 } from "uuid";
import { processQuery } from "./database";
import { logger } from "./logger";

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
    logger.error("CREATE_NOTIFICATION", e);
  }
}

export function formatRequired(required: string[], body: IRequest["body"]) {
  const arr: string[] = [];

  required.map((v) => {
    const item = body[v];
    const prettyName = v.replace("_", " ").replace("-", " ");

    if (!item) {
      arr.push(`\`${prettyName}\``);
    }
  });

  return `Properties: ${arr.join(", ")} are missing.`;
}

export function runMiddleware(req: IRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export function generateString(length: number, extraChars = "") {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const allChars = chars + extraChars;

  for (let i = 0; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return result;
}

export async function getWebhookData(url: string): Promise<WebHook | undefined> {
  try {
    const res = await fetch(url);

    const header = res.headers.get("Content-Type");
    if (!header) return;
    if (header !== "application/json") return;

    const data = await res.json();

    return {
      id: data.id,
      token: data.token,
      name: data.name,
      avatar: data?.avatar_url ?? null,
      channel_id: data.channel_id,
      guild_id: data.guild_id,
    };
  } catch (e) {
    logger.error("GET_WEBHOOK_DATA", e);
  }
}

export async function postWebhook(webhook: WebHook, data: WebHookData): Promise<void> {
  const discordUrl = "https://discord.com/api/v8";
  try {
    await fetch(`${discordUrl}/webhooks/${webhook.id}/${webhook.token}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    logger.error("POST_WEBHOOK", e);
  }
}

export async function logoutActiveUnits(userId: string | undefined): Promise<void> {
  const officers = await processQuery<Officer>("SELECT * FROM `officers` WHERE `user_id` = ?", [
    userId,
  ]);
  const emsFd = await processQuery<any>("SELECT * FROM `ems-fd` WHERE `user_id` = ?", [userId]);

  await Promise.all(
    [...officers, ...emsFd]
      .filter((o) => o.status === "on-duty")
      .map(async (item) => {
        if ("officer_name" in item) {
          const [officerLog] = await processQuery<OfficerLog>(
            "SELECT * FROM `officer_logs` WHERE `officer_id` = ? AND `active` = ?",
            [item.id, "1"],
          );

          if (officerLog) {
            await processQuery(
              "UPDATE `officer_logs` SET `active` = ?, `ended_at` = ? WHERE `id` = ?",
              ["0", Date.now(), officerLog?.id],
            );
          }

          await processQuery("UPDATE `officers` SET `status` = ?, `status2` = ? WHERE `id` = ?", [
            "off-duty",
            "--------",
            item.id,
          ]);
        } else {
          await processQuery("UPDATE `ems-fd` SET `status` = ?, `status2` = ? WHERE `id` = ?", [
            "off-duty",
            "--------",
            item.id,
          ]);
        }

        return item;
      }),
  );

  global?.io?.sockets?.emit?.(SocketEvents.UpdateActiveUnits);
}

export async function getActiveOfficer(req: IRequest) {
  const id =
    parse(`${req.headers["session"]}`)?.["active-officer"] ||
    parse(`${req.headers["cookie"]}`)?.["active-officer"];

  const [officer] = await processQuery<Officer>(
    "SELECT * FROM `officers` WHERE `user_id` = ? AND `id` = ?",
    [req.userId, id],
  );

  return officer;
}
