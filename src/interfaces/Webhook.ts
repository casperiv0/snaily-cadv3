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
