import { Citizen } from "types/Citizen";
import { Vehicle } from "types/Vehicle";
import { Weapon } from "types/Weapon";

export interface GetUserCitizens {
  type: "GET_USER_CITIZENS";
  citizens: Citizen[];
}

export interface GetCitizenById {
  type: "GET_CITIZEN_BY_ID";
  citizen: Citizen;
}

export interface RegisterWeapon {
  type: "REGISTER_WEAPON";
  weapons: Weapon[];
}

export interface RegisterVehicle {
  type: "REGISTER_VEHICLE";
  vehicles: Vehicle[];
}

export type Actions = GetUserCitizens | GetCitizenById | RegisterVehicle | RegisterWeapon;
