import Bleet from "./Bleet";
import Call from "./Call";
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
    bleet: Bleet;
    loading: boolean;
    error: string;
  };
  global: {
    cadInfo: object;
    aop: string;
  };
  calls: {
    calls: Call[];
  };
  officers: {
    status: string;
    status2: string;
  };
}

export default State;
