import { Citizen } from "types/Citizen";
import { Company } from "types/Company";
import { MedicalRecord } from "types/MedicalRecord";
import { Nullable } from "types/State";
import { Vehicle } from "types/Vehicle";
import { Weapon } from "types/Weapon";

export interface GetUserCitizens {
  type: "GET_USER_CITIZENS";
  citizens: Citizen[];
}

export interface CreateCitizen {
  type: "CREATE_CITIZEN";
}

export interface GetCitizenById {
  type: "GET_CITIZEN_BY_ID";
  citizen: Citizen;
}

export interface ICitizenWeapons {
  type: "GET_CITIZEN_WEAPONS" | "DELETE_WEAPON_BY_ID" | "UPDATE_WEAPON_BY_ID";
  weapons: Weapon[];
}
export interface RegisterWeapon {
  type: "REGISTER_WEAPON";
  weapons: Weapon[];
}
export interface ICitizenVehicles {
  type:
    | "GET_CITIZEN_VEHICLES"
    | "DELETE_VEHICLE_BY_ID"
    | "UPDATE_VEHICLE_BY_ID"
    | "REGISTER_VEHICLE"
    | "TRANSFER_VEHICLE";
  vehicles: Vehicle[];
}

export interface UpdateCitizenLicenses {
  type: "UPDATE_CITIZEN_LICENSES";
  citizen: Nullable<Citizen>;
}

export interface DeleteCitizenById {
  type: "DELETE_CITIZEN_BY_ID";
}

export interface IMedicalRecords {
  type: "GET_MEDICAL_RECORDS" | "DELETE_MEDICAL_RECORDS" | "CREATE_MEDICAL_RECORD";
  medicalRecords: MedicalRecord[];
}

export interface GetUserCompanies {
  type: "GET_USER_COMPANIES";
  companies: (Citizen & { company: Company })[];
}

export type Actions =
  | GetUserCitizens
  | GetCitizenById
  | RegisterWeapon
  | ICitizenVehicles
  | ICitizenWeapons
  | UpdateCitizenLicenses
  | DeleteCitizenById
  | IMedicalRecords
  | GetUserCompanies;
