import fetch from "node-fetch";
import Officer from "../interfaces/Officer";
import { processQuery } from "./database";
import Logger from "./Logger";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
import { io } from "../server";
import { WhitelistedChars } from "./constants";
import { WebHook, WebHookData } from "../interfaces/Discord";

export function generateString(length: number): string {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

export function checkForInvalidChars(username: string) {
  return !WhitelistedChars.test(username);
}

export function serializeUsername(username: string) {
  return username.replace(" ", "");
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
    Logger.error("GET_WEBHOOK_DATA", e);
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
    Logger.error("POST_WEBHOOK", e);
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
          const officerLog = await processQuery(
            "SELECT * FROM `officer_logs` WHERE `officer_id` = ? AND `active` = ?",
            [item.id, "1"],
          );

          if (officerLog[0]) {
            await processQuery(
              "UPDATE `officer_logs` SET `active` = ?, `ended_at` = ? WHERE `id` = ?",
              ["0", Date.now(), officerLog[0]?.id],
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

  io.sockets.emit("UPDATE_ACTIVE_UNITS");
}
