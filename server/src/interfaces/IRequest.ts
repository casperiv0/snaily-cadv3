import { Request } from "express";
import IUser from "./IUser";

interface IRequest extends Request {
  user?: IUser;
  parsedPath?: string;
  [key: string]: any;
}

export default IRequest;
