import { Deputy } from "types/Deputy";
import { MedicalRecord } from "types/MedicalRecord";

export interface IEmsFd {
  type: "GET_DEPUTIES" | "DELETE_DEPUTY" | "CREATE_DEPUTY";
  deputies: Deputy[];
}

export interface GetActiveDeputy {
  type: "GET_ACTIVE_DEPUTY";
  deputy: Deputy;
}

export interface SetEmsFdStatus {
  type: "SET_EMS_FD_STATUS";
  deputy: Deputy;
}

export interface SearchMedicalRecords {
  type: "SEARCH_MEDICAL_RECORDS";
  medicalRecords: MedicalRecord[];
}

export type Actions = IEmsFd | SearchMedicalRecords | SetEmsFdStatus | GetActiveDeputy;
