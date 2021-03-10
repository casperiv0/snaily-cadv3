import { Request } from "express";
import IUser from "./IUser";

interface IRequest extends Request {
  user?: IUser;
  parsedPath?: string;
}

export default IRequest;
