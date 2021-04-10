export interface Field {
  type: "text" | "email" | "file";
  value: string;
  onChange: (e: any) => void;
  label: string;
  id: string;
  select?: boolean;
  selectLabel?: string;
  data?: any[];
  disabled?: boolean;
}
