import { NextApiRequest } from "next";
import { UploadedFile } from "express-fileupload";

export interface IRequest extends NextApiRequest {
  userId: string;
  parsedPath: string;
  files?: {
    image?: UploadedFile;
  };
}
