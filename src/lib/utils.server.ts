import { NextApiResponse } from "next";
import { IRequest } from "types/IRequest";
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

    if (!item) {
      arr.push(`\`${v}\``);
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

export function generateString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const allChars = chars;

  for (let i = 0; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return result;
}
