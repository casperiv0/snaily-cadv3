import { Citizen } from "types/Citizen";

export interface GetUserCitizens {
  type: "GET_USER_CITIZENS";
  citizens: Citizen[];
}

export interface GetCitizenById {
  type: "GET_CITIZEN_BY_ID";
  citizen: Citizen;
}

export type Actions = GetUserCitizens | GetCitizenById;
