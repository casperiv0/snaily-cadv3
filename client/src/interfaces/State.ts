import Bleet from "./Bleet";
import User from "./User";

interface State {
  auth: {
    isAuth: boolean;
    loading: boolean;
    user: User;
    error: string;
  };
  bleets: {
    bleets: Bleet[];
    loading: boolean;
  };
}

export default State;
