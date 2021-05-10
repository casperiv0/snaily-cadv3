import { IRequest } from "src/interfaces/IRequest";

const paths: string[] = [
  "departments",
  "ethnicities",
  "genders",
  "legal-statuses",
  "cad-licenses",
  "vehicles",
  "weapons",
  "call-types",
];

export type ParsedPath =
  | "departments"
  | "ethnicities"
  | "genders"
  | "legal_statuses"
  | "cad_licenses"
  | "vehicles"
  | "weapons"
  | "call_types";

export function useValidPath(req: IRequest): Promise<string> {
  const path = req.query.path;

  if (!paths.includes((path as string).toLowerCase())) {
    return Promise.reject("invalid path");
  }

  const parsedPath = (path as string).replace("-", "_") as ParsedPath;
  req.parsedPath = parsedPath;

  return Promise.resolve("success");
}
