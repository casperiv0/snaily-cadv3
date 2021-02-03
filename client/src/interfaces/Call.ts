interface Call {
  id: string;
  description: string;
  name: string;
  location: string;
  status: string;
  assigned_unit: Unit[];
}

export interface Unit {
  value: string;
  label: string;
}

export default Call;
