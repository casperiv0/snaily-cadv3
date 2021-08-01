export interface Field {
  type: "text" | "email" | "file" | "date";
  value: string;
  label: string;
  id: string;
  select?: boolean;
  selectLabel?: string;
  data?: any[];

  onChange: (e: any) => void;
  disabled?: boolean;
}
