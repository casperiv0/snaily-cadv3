import { verifyAuth } from "@actions/auth/AuthActions";
import { getBolos } from "@actions/bolos/BoloActions";
import { getCalls } from "@actions/calls/CallActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { getActiveOfficer } from "@actions/officer/OfficerActions";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { connect } from "react-redux";

const LeoDashboard = () => {
  return <div></div>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getBolos(req.headers)(store.dispatch);
  await getCalls("911", req.headers)(store.dispatch);
  await getActiveOfficer(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

export default connect()(LeoDashboard);
