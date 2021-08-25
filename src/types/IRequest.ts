import { NextApiRequest } from "next";
import { UploadedFile } from "express-fileupload";
import { ParsedPath } from "hooks/useValidPath";

export interface IRequest extends NextApiRequest {
  userId: string;
  parsedPath: ParsedPath;
  files?: {
    image?: UploadedFile;
    [key: string]: UploadedFile | undefined;
  };
}
