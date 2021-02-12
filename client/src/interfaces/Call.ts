import { LatLng, XYZ } from "../components/dispatch/map/interfaces";

interface Call {
  id: string;
  description: string;
  name: string;
  location: string;
  status: string;
  assigned_unit: Unit[];
  pos: XYZ | LatLng;
}

export interface Unit {
  value: string;
  label: string;
}

export default Call;
