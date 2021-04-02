import * as React from "react";
import { connect } from "react-redux";
import Call911Modal from "../../components/modals/call911Modal";
import Layout from "../../components/Layout";
import ModalButtons from "../../components/dispatch/ModalButtons";
import lang from "../../language.json";
import State from "../../interfaces/State";
import UpdateAOP from "../../components/dispatch/UpdateAOP";
import ActiveUnits from "../../components/dispatch/ActiveUnits";
import socket from "../../lib/socket";
import ActiveCalls from "../../components/dispatch/ActiveCalls";
import ActiveBolos from "../../components/active-bolos";
import NotepadModal from "../../components/modals/notepad";
import PlateSearchModal from "../../components/modals/leo/plateSearchModal";
import NameSearchModal from "../../components/modals/leo/nameSearchModal";
import AddressSearchModal from "../../components/modals/dispatch/addressSearchModal";
import WeaponSearchModal from "../../components/modals/leo/weaponSearchModal";
import CreateBoloModal from "../../components/modals/leo/createBoloModal";
import Officer from "../../interfaces/Officer";
import { playSound } from "../../lib/functions";
import CadInfo from "../../interfaces/CadInfo";
import { Perm } from "../../interfaces/User";
import useDocTitle from "../../hooks/useDocTitle";
import { DismissAlertBtn } from "../../components/alert-message";
import { SOCKET_EVENTS } from "../../lib/types";

interface Props {
  aop: string | null;
  cadInfo: CadInfo | null;
}

const DispatchDash: React.FC<Props> = (props) => {
  const [time, setTime] = React.useState<Date>(new Date());
  const [aop, setAop] = React.useState<string>(props?.aop ?? "");
  const [panic, setPanic] = React.useState<Officer | null>(null);
  const [signal100, setSignal100] = React.useState<Perm>(props.cadInfo?.signal_100 ?? "0");
  useDocTitle("Dispatch Dashboard");

  React.useEffect(() => {
    setSignal100(props.cadInfo?.signal_100 ?? "0");
  }, [props.cadInfo]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 900);

    return () => clearInterval(interval);
  }, [time]);

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

    socket.on(SOCKET_EVENTS.UPDATE_AOP, aopHandler);
    socket.on(SOCKET_EVENTS.PANIC_BUTTON, panicButtonHandler);
    socket.on(SOCKET_EVENTS.SIGNAL_100, signal100Handler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_AOP, aopHandler);
      socket.off(SOCKET_EVENTS.PANIC_BUTTON, panicButtonHandler);
      socket.off(SOCKET_EVENTS.SIGNAL_100, signal100Handler);

      panicSound.stop();
      signal100Sound.stop();
    };
  }, []);

  return (
    <Layout fluid classes="pb-5 mt-5">
      {panic !== null ? (
        <div role="alert" className="alert alert-danger alert-dismissible">
          {panic.officer_name} {window.lang.global.panic_button}
          <DismissAlertBtn onClick={() => setPanic(null)} />
        </div>
      ) : null}
      {signal100 === "1" ? (
        <div role="alert" className="alert alert-danger alert-dismissible">
          {window.lang.global.signal_100}
          <DismissAlertBtn onClick={() => setSignal100("0")} />
        </div>
      ) : null}

      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
          <span>{time.toLocaleString()}</span>
        </div>
        <div className="card-body row gap-2 px-4">
          <ModalButtons />
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-md-8">
          <ActiveUnits />
        </div>
        <div className="col-md-4">
          <UpdateAOP />
        </div>
      </div>

      <ActiveCalls />
      <ActiveBolos />

      <NotepadModal />
      <AddressSearchModal />
      <NameSearchModal />
      <PlateSearchModal />
      <WeaponSearchModal />
      <CreateBoloModal />
      <Call911Modal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps)(React.memo(DispatchDash));
