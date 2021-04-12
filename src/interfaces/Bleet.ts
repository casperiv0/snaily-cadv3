import { User } from "./User";

export interface Bleet {
  id: string;
  title: string;
  body: string;
  markdown: string;
  image_id: string;
  likes: string;
  user_id: User["id"];
  uploaded_at: number;
  uploadedBy: string;
}
