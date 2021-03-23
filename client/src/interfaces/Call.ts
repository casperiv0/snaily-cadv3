import { LatLng, XYZ } from "../components/dispatch/map/interfaces";
import CallEvent from "./CallEvent";
import { Perm } from "./User";

interface Call {
  id: string;
  description: string;
  name: string;
  location: string;
  status: string;
  assigned_unit: Unit[];
  pos: XYZ | LatLng;
  hidden: Perm;
  type: string;

  events?: CallEvent[];
}

export interface Unit {
  value: string;
  label: string;
}

export default Call;
