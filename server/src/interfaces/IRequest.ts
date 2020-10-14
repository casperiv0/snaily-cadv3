import { Request } from "express";
import IUser from "./IUser";

interface IRequest extends Request {
  user?: IUser;
  [key: string]: any;
}

export default IRequest;
