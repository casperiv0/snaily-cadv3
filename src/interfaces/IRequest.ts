import { NextApiRequest } from "next";

export interface IRequest extends NextApiRequest {
  userId: string;
  parsedPath: string;
}
