export interface IRecord {
  type: "CREATE_WARRANT" | "CREATE_ARREST_REPORT" | "CREATE_WRITTEN_WARNING" | "CREATE_TICKET";
}

export type Actions = IRecord;
