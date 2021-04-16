import { Value } from "types/Value";
import { ValuePaths } from "types/ValuePaths";

export interface IValues {
  type: "GET_VALUES" | "DELETE_VALUE_BY_ID" | "UPDATE_VALUE_BY_ID" | "ADD_VALUE";
  values: Value[];
  path: ValuePaths;
}

export type Actions = IValues;
