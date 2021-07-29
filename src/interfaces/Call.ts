import { Perm } from "./Perm";

export interface Call {
  id: string;
  description: string;
  name: string;
  location: string;
  status: string;
  assigned_unit: Unit[];
  //   pos: XYZ | LatLng;
  hidden: Perm;
  type: string;

  pos: any;
  events?: CallEvent[];

  /**
   * only available in tow/taxi calls
   */
  claimed: Perm;
}

export interface CallEvent {
  id: string;

  /**
   * timestamp (Milliseconds) of when the event occurred
   */
  date: string;
  text: string;
}

export interface Unit {
  value: string;
  label: string;
}
