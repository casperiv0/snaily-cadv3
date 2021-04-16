import { ExpungementRequest } from "types/ExpungementRequest";
import { ArrestReport, Ticket, Warrant } from "types/Record";

export interface CourtResult {
  warrants: Warrant[];
  arrestReports: ArrestReport[];
  tickets: Ticket[];
  citizenId: string;
}

export interface RequestExpungement {
  type: "REQUEST_EXPUNGEMENT";
}

export interface SearchCitizen {
  type: "SEARCH_CITIZEN";
  courtResult: CourtResult;
}

export interface GetExpungementRequests {
  type: "GET_EXPUNGEMENT_REQUESTS";
  expungementRequests: ExpungementRequest[];
}

export type Actions = RequestExpungement | SearchCitizen | GetExpungementRequests;
