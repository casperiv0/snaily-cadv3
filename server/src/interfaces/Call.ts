interface Call {
  id: string;
  description: string;
  name: string;
  location: string;
  status: string;
  assigned_unit: string | string[];
}

export default Call;
