import { NextFunction, Response } from "express";
import IRequest from "../interfaces/IRequest";

const paths: string[] = [
  "departments",
  "ethnicities",
  "genders",
  "legal-statuses",
  "vehicles",
  "weapons",
];

export default function useValidPath(req: IRequest, res: Response, next: NextFunction): void {
  const { path } = req.params;

  if (!paths.includes(path.toLowerCase())) {
    res.json({ error: "Invalid path", status: "error" });
    return;
  }

  const parsedPath = path.replace("-", "_");

  req.parsedPath = parsedPath;
  next();
}
