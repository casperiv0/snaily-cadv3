import { Request } from "express";
import IUser from "./IUser";

interface IRequest extends Request {
  userId?: IUser["id"];
  parsedPath?: string;
}

export default IRequest;
