import { connect } from "react-redux";
import Link from "next/link";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getUserCitizens } from "@actions/citizen/CitzenActions";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { Layout } from "src/components/Layout";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import lang from "../../language.json";

interface Props {
  citizens: Citizen[];
  aop: Nullable<string>;
}

const CitizenPage = ({ citizens, aop }: Props) => {
  return (
    <Layout>
      <h3>
        {lang.auth.welcome} - AOP: {aop}
      </h3>

      <div className="d-flex">
        <Link href="/logout">
          <a className="btn btn-danger col">{lang.auth.logout}</a>
        </Link>
        <Link href="/account">
          <a className="ms-1 col btn btn-primary">{lang.auth.account.account}</a>
        </Link>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers.cookie)(store.dispatch);
  await getUserCitizens(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  citizens: state.citizen.citizens,
  aop: state.global.aop,
});

export default connect(mapToProps)(CitizenPage);
