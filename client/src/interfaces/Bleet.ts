import User from "./User";

interface Bleet {
  id: string;
  title: string;
  body: string;
  markdown: string;
  file_dir: string;
  likes: string;
  uploaded_by: User;
}

export default Bleet;
