import { connect } from "react-redux";
import * as React from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { verifyAuth } from "actions/auth/AuthActions";
import { getCadInfo } from "actions/global/GlobalActions";
import { initializeStore } from "state/useStore";
import { AdminLayout } from "components/admin/AdminLayout";
import { Nullable, State } from "types/State";
import { User } from "types/User";
import { RanksArr } from "lib/consts";
import { Seo } from "components/Seo";
import lang from "src/language.json";

interface Props {
  user: Nullable<User>;
}

const AdminPage = ({ user }: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    if (!RanksArr.includes(user?.rank ?? "user")) {
      router.push("/403");
    }
  }, [router, user]);

  return (
    <AdminLayout>
      <Seo title={lang.nav.admin} />
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  user: state.auth.user,
});

export default connect(mapToProps)(AdminPage);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};
