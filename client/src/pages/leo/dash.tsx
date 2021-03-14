import * as React from "react";
import Active911Calls from "../../components/active-911-calls";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import lang from "../../language.json";
import ModalButtons from "../../components/leo/ModalButtons";
import Statuses from "../../components/leo/Statuses";
import ActiveBolos from "../../components/active-bolos";
import SelectOfficerModal from "../../components/modals/leo/selectOfficerModal";
import CreateWarrant from "../../components/leo/CreateWarrant";
import socket from "../../lib/socket";
import NotepadModal from "../../components/modals/notepad";
import CreateBoloModal from "../../components/modals/leo/createBoloModal";
import PlateSearchModal from "../../components/modals/leo/plateSearchModal";
import NameSearchModal from "../../components/modals/leo/nameSearchModal";
import WeaponSearchModal from "../../components/modals/leo/weaponSearchModal";
import CreateWrittenWarningModal from "../../components/modals/leo/createWrittenWarningModal";
import CreateArrestReportModal from "../../components/modals/leo/createArrestReportModal";
import CreateTicketModal from "../../components/modals/leo/createTicketModal";
import { connect } from "react-redux";
import Officer from "../../interfaces/Officer";
import { playSound } from "../../lib/functions";
import { getPenalCodes } from "../../lib/actions/admin";
import { useLocation } from "react-router-dom";
import User, { Perm } from "../../interfaces/User";
import CadInfo from "../../interfaces/CadInfo";
import useDocTitle from "../../hooks/useDocTitle";
import { DismissAlertBtn } from "../../components/alert-message";

interface Props {
  aop: string | null;
  activeOfficer: Officer | null;
  cadInfo: CadInfo | null;
  user: User | null;
  getPenalCodes: () => void;
}

const LeoDash: React.FC<Props> = (props) => {
  useDocTitle("LEO Dashboard");
  const location = useLocation();
  const { getPenalCodes } = props;
  const [time, setTime] = React.useState<Date>(new Date());
  const [aop, setAop] = React.useState<string>(props?.aop ?? "");
  const [panic, setPanic] = React.useState<Officer | null>(null);
  const [signal100, setSignal100] = React.useState<Perm>(props.cadInfo?.signal_100 ?? "0");

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
    document.title = "LEO Dashboard";
    getPenalCodes();
  }, [getPenalCodes]);

  React.useEffect(() => {
    const panicSound = playSound("/sounds/panic-button.mp3");
    const signal100Sound = playSound("/sounds/signal-100.wav");

    const aopHandler = (newAop: string) => setAop(newAop);
    const panicButtonHandler = (officer: Officer) => {
      panicSound.play();
      setPanic(officer);
    };
    const signal100Handler = (value: Perm) => {
      if (value === "1") {
        signal100Sound.play();
      }
      setSignal100(value);
    };

    socket.on("UPDATE_AOP", aopHandler);
    socket.on("PANIC_BUTTON", panicButtonHandler);
    socket.on("SIGNAL_100", signal100Handler);

    return () => {
      socket.off("UPDATE_AOP", aopHandler);
      socket.off("PANIC_BUTTON", panicButtonHandler);
      socket.off("SIGNAL_100", signal100Handler);

      panicSound.stop;
      signal100Sound.stop();
    };
  }, []);

  React.useEffect(() => {
    const successSound = playSound("/sounds/success.mp3");

    const unitsHandler = (unitIds: string[]) => {
      if (location.pathname !== "/leo/dash") return;
      if (props.activeOfficer && unitIds.includes(props.activeOfficer?.id)) {
        successSound.play();
      }
    };

    socket.on("UPDATE_ASSIGNED_UNITS", unitsHandler);

    return () => {
      socket.off("UPDATE_ASSIGNED_UNITS", unitsHandler);
      successSound.stop();
    };
  }, [props.activeOfficer, location]);

  return (
    <Layout fluid>
      {panic !== null ? (
        <div role="alert" className="alert alert-danger alert-dismissible">
          {panic.officer_name} has activated panic button
          <DismissAlertBtn onClick={() => setPanic(null)} />
        </div>
      ) : null}
      {signal100 === "1" ? (
        <div role="alert" className="alert alert-danger alert-dismissible">
          Signal 100 is in effect
          <DismissAlertBtn onClick={() => setSignal100("0")} />
        </div>
      ) : null}

      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
          <span>{new Date(time).toLocaleString()}</span>
        </div>
        <div className="card-body row gap-2 px-4">
          <ModalButtons user={props.user} activeOfficer={props.activeOfficer} />
        </div>
        <div className="card-footer row gap-2 pl-2 px-4">
          <Statuses />
        </div>
      </div>

      <div className="row">
        <div className="col-md-9 mt-2">
          <Active911Calls />
          <ActiveBolos />
        </div>
        <div className="col-md-3 mt-2">
          <CreateWarrant />
        </div>
      </div>

      {/* Modals */}
      <div id="modals">
        <SelectOfficerModal />
        <NotepadModal />
        <CreateBoloModal />
        <WeaponSearchModal />
        <PlateSearchModal />
        <NameSearchModal />
        <CreateWrittenWarningModal />
        <CreateArrestReportModal />
        <CreateTicketModal />
      </div>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  activeOfficer: state.officers.activeOfficer,
  cadInfo: state.global.cadInfo,
  user: state.auth.user,
});

export default connect(mapToProps, { getPenalCodes })(React.memo(LeoDash));
