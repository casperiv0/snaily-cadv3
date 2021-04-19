import * as React from "react";
import { connect } from "react-redux";
import { Layout } from "@components/Layout";
import { GetServerSideProps } from "next";
import { ModalButtons } from "@components/dispatch/ModalButtons";
import lang from "../../language.json";
import { Nullable, State } from "types/State";
import { UpdateAOP } from "@components/dispatch/UpdateAop";
import { ActiveUnits } from "@components/dispatch/ActiveUnits";
import { ActiveCalls } from "@components/dispatch/ActiveCalls";
import { ActiveBolos } from "@components/ActiveBolos/ActiveBolos";
import { NotepadModal } from "@components/modals/NotepadModal";
import { PlateSearchModal } from "@components/modals/leo/PlateSearchModal";
import { NameSearchModal } from "@components/modals/leo/NameSearchModal";
import { AddressSearchModal } from "@components/modals/dispatch/AddressSearchModal";
import { WeaponSearchModal } from "@components/modals/leo/WeaponSearchModal";
import { CreateBoloModal } from "@components/modals/leo/CreateBoloModal";
import { Officer } from "types/Officer";
import { playSound } from "@lib/utils";
import { Cad } from "types/Cad";
import { Perm } from "types/Perm";
import { DismissAlertBtn } from "@components/AlertMessage/AlertMessage";
import { SocketEvents } from "types/Socket";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { Create911Modal } from "@components/modals/Create911Modal";
import { socket } from "@hooks/useSocket";
import { Seo } from "@components/Seo";
import { getBolos } from "@actions/bolos/BoloActions";
import { getCalls } from "@actions/calls/CallActions";
import { getActiveUnits } from "@actions/dispatch/DispatchActions";
import { useDashTime } from "@hooks/useDashTime";

interface Props {
  aop: Nullable<string>;
  cadInfo: Nullable<Cad>;
}

const DispatchDash: React.FC<Props> = (props) => {
  const [aop, setAop] = React.useState<string>(props?.aop ?? "");
  const [panic, setPanic] = React.useState<Officer | null>(null);
  const [signal100, setSignal100] = React.useState<Perm>(props.cadInfo?.signal_100 ?? "0");
  const time = useDashTime();

  React.useEffect(() => {
    setSignal100(props.cadInfo?.signal_100 ?? "0");
  }, [props.cadInfo]);

  React.useEffect(() => {
    const panicSound = playSound("/sounds/panic-button.mp3");
    const signal100Sound = playSound("/sounds/signal-100.wav");

    const aopHandler = (newAop: string) => setAop(newAop);
    const panicButtonHandler = (officer: Officer) => {
      setPanic(officer);
      panicSound.play();
    };
    const signal100Handler = (value: Perm) => {
      if (value === "1") {
        signal100Sound.play();
      }
      setSignal100(value);
    };

    socket.on(SocketEvents.UpdateAop, aopHandler);
    socket.on(SocketEvents.PanicButton, panicButtonHandler);
    socket.on(SocketEvents.Signal100, signal100Handler);

    return () => {
      socket.off(SocketEvents.UpdateAop, aopHandler);
      socket.off(SocketEvents.PanicButton, panicButtonHandler);
      socket.off(SocketEvents.Signal100, signal100Handler);

      panicSound.stop();
      signal100Sound.stop();
    };
  }, []);

  return (
    <Layout fluid>
      <Seo title="Dispatch Dashboard" />

      {panic !== null ? (
        <div role="alert" className="alert alert-danger alert-dismissible">
          {panic.officer_name} {lang.global.panic_button}
          <DismissAlertBtn onClick={() => setPanic(null)} />
        </div>
      ) : null}
      {signal100 === "1" ? (
        <div role="alert" className="alert alert-danger alert-dismissible">
          {lang.global.signal_100}
          <DismissAlertBtn onClick={() => setSignal100("0")} />
        </div>
      ) : null}

      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} {props.cadInfo?.show_aop === "1" ? `- AOP: ${aop}` : null}
          </h4>
          <span>{time}</span>
        </div>
        <div className="card-body row gap-2 px-4">
          <ModalButtons />
        </div>
      </div>

      <div className="row mt-2">
        <div className={props.cadInfo?.show_aop === "1" ? "col-md-8" : "col"}>
          <ActiveUnits />
        </div>
        {props.cadInfo?.show_aop === "1" ? (
          <div className="col-md-4">
            <UpdateAOP />
          </div>
        ) : null}
      </div>

      <ActiveCalls />
      <ActiveBolos />

      <NotepadModal />
      <AddressSearchModal />
      <NameSearchModal />
      <PlateSearchModal />
      <WeaponSearchModal />
      <CreateBoloModal />
      <Create911Modal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getBolos(req.headers)(store.dispatch);
  await getCalls("911", req.headers)(store.dispatch);
  await getActiveUnits(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps)(React.memo(DispatchDash));
