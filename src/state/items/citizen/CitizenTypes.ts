import { Citizen } from "types/Citizen";

export interface GetUserCitizens {
  type: "GET_USER_CITIZENS";
  citizens: Citizen[];
}

export type Actions = GetUserCitizens;
