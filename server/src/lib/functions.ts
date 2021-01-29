import fetch from "node-fetch";
import Logger from "./Logger";
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateSerialNumber(): string {
  let result = "";
  const length = chars.length;

  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * length));
  }

  return result;
}

export function generateVinNumber(): string {
  let result = "";
  const length = chars.length;

  for (let i = 0; i < 17; i++) {
    result += chars.charAt(Math.floor(Math.random() * length));
  }

  return result;
}

export interface WebHook {
  id: string;
  token: string;
  avatar: string | null;
  name: string;
  channel_id: string;
  guild_id: string;
  user?: any;
  type?: number;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: any;
  type?: string;
  footer?: {
    text: string;
    icon_url: string;
  };
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
}

export interface WebHookData {
  content?: string;
  username: string;
  avatar_url?: string | null;
  embeds?: DiscordEmbed[];
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
