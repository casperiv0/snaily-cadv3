import { Bolo } from "types/Bolo";

export interface IBolos {
  type: "GET_BOLOS" | "DELETE_BOLO" | "CREATE_BOLO" | "UPDATE_BOLOS";
  bolos: Bolo[];
}

export type Actions = IBolos;
