import IUser from "./IUser";

interface Bleet {
  id: string;
  title: string;
  body: string;
  markdown: string;
  uploaded_by: IUser;
}

export default Bleet;
