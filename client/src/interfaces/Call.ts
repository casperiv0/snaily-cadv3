import { XYZ } from "../components/dispatch/map/interfaces";

interface Call {
  id: string;
  description: string;
  name: string;
  location: string;
  status: string;
  assigned_unit: Unit[];
  pos: XYZ;
}

export interface Unit {
  value: string;
  label: string;
}

export default Call;
