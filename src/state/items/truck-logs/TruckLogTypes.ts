import { TruckLog } from "types/TruckLog";

export interface GetTruckLogs {
  type: "GET_TRUCK_LOGS";
  logs: TruckLog[];
}

export interface CreateTruckLog {
  type: "CREATE_TRUCK_LOG";
  logs: TruckLog[];
}

export interface DeleteTruckLog {
  type: "DELETE_TRUCK_LOG";
  logs: TruckLog[];
}

export type Actions = GetTruckLogs | CreateTruckLog | DeleteTruckLog;
