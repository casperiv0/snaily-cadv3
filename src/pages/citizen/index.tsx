import { connect } from "react-redux";
import Link from "next/link";
import * as React from "react";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getUserCitizens } from "@actions/citizen/CitizenActions";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { Layout } from "src/components/Layout";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { Seo } from "@components/Seo";
import { ModalIds } from "types/ModalIds";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { isCadFeatureEnabled } from "@lib/utils";
import { Cad } from "types/Cad";
import { getCadInfo } from "@actions/global/GlobalActions";
import { SocketEvents } from "types/Socket";
import { CreateTaxiCallModal } from "@components/modals/CreateTaxiCallModal";
import { CreateTowCallModal } from "@components/modals/CreateTowCallModal";
import { Create911Modal } from "@components/modals/Create911Modal";
import { useSocket } from "@hooks/useSocket";
import { RegisterWeaponModal } from "@components/modals/citizen/RegisterWeaponModal";
import { RegisterVehicleModal } from "@components/modals/citizen/RegisterVehicleModal";

interface Props {
  citizens: Citizen[];
  aop: Nullable<string>;
  cadInfo: Nullable<Cad>;
}

const CitizenPage = ({ citizens, cadInfo, ...rest }: Props) => {
  const [aop, setAop] = React.useState(rest.aop);
  const socket = useSocket();

  React.useEffect(() => {
    const handler = (newAop: string) => setAop(newAop);
    socket?.on(SocketEvents.UpdateAop, handler);

    return () => {
      socket?.off(SocketEvents.UpdateAop, handler);
    };
  }, [socket]);

  return (
    <Layout>
      <Seo title="Citizen - View all your citizens" />

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

      <div className="d-flex mt-1">
        <Link href="/citizen/create">
          <a className="col btn btn-primary">{lang.citizen.create_new_citizen}</a>
        </Link>
        <button
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.RegisterVehicle}`}
          className="col ms-1 btn btn-primary"
        >
          {lang.citizen.reg_new_vehicle}
        </button>
        <button
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.RegisterWeapon}`}
          className="col ms-1 btn btn-primary"
        >
          {lang.citizen.reg_new_weapon}
        </button>
      </div>

      <div className="d-flex mt-1">
        {isCadFeatureEnabled(cadInfo?.features, "company") ? (
          <Link href="/citizen/manage-companies">
            <a className="col btn ms-0 mx-1 btn-primary">{lang.citizen.employment_status}</a>
          </Link>
        ) : null}

        {isCadFeatureEnabled(cadInfo?.features, "tow") ? (
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.CallTow}`}
            className="col btn btn-primary"
          >
            {lang.citizen.call_tow}
          </button>
        ) : null}

        <button
          data-bs-toggle="modal"
          data-bs-target={`#${ModalIds.Create911}`}
          className="col ms-1 btn btn-primary"
        >
          {lang.citizen.call_911}
        </button>

        {isCadFeatureEnabled(cadInfo?.features, "taxi") ? (
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.CallTaxi}`}
            className="col ms-1 btn btn-primary"
          >
            {lang.taxi.create_taxi_call}
          </button>
        ) : null}
      </div>

      <ul className="list-group mt-3">
        {!citizens[0] ? (
          <AlertMessage message={{ msg: lang.citizen.no_citizens_found, type: "warning" }} />
        ) : (
          citizens.map((citizen: Citizen, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              >
                {citizen.full_name}

                <Link href={`/citizen/${citizen.id}`}>
                  <a className="btn btn-primary">{lang.citizen.more_info}</a>
                </Link>
              </li>
            );
          })
        )}
      </ul>

      {isCadFeatureEnabled(cadInfo?.features, "taxi") ? <CreateTaxiCallModal /> : null}
      {isCadFeatureEnabled(cadInfo?.features, "tow") ? <CreateTowCallModal /> : null}
      <Create911Modal />
      <RegisterWeaponModal />
      <RegisterVehicleModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers.cookie)(store.dispatch);
  await verifyAuth(req.headers.cookie)(store.dispatch);
  await getUserCitizens(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  citizens: state.citizen.citizens,
  aop: state.global.aop,
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps)(CitizenPage);
