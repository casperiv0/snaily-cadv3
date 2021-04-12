export interface Deputy {
  id: string;
  name: string;
  user_id: string;
  status: "on-duty" | "off-duty";
  status2: string;
}
