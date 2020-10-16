import { Dispatch } from "react";
import User from "../../interfaces/User";

interface IDispatch {
  loading: boolean;
  user: User;
  isAuth: boolean;
}

export const checkAuth = () => (dispatch: Dispatch<IDispatch>) => {};
