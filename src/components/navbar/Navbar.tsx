import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import { State } from "types/State";

interface Props {
  isAuth: boolean;
  loading: boolean;
}

const NavbarC = ({ isAuth, loading }: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuth) {
      router.push("/auth/login");
    }
  }, [isAuth, loading, router]);

  return <div></div>;
};

const mapToProps = (state: State) => ({
  isAuth: state.auth.isAuth,
  loading: state.auth.loading,
});

export const Navbar = connect(mapToProps)(NavbarC);
