import * as React from "react";
import { connect } from "react-redux";
import { logout } from "actions/auth/AuthActions";

interface Props {
  logout: () => void;
}

const LogoutPage = ({ logout }: Props) => {
  React.useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default connect(null, { logout })(LogoutPage);
