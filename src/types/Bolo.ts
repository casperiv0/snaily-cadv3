export interface Bolo {
  id: string;
  type: "person" | "vehicle";
  description: string;
  plate: string;
  name: string;
  color: string;
  officer_name: string;
}
