import { FC, useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../lib/actions/auth";

interface Props {
  logout: () => void;
}

const Logout: FC<Props> = ({ logout }) => {
  useEffect(() => {
    return logout();
  }, [logout]);

  return null;
};

export default connect(null, { logout })(Logout);
