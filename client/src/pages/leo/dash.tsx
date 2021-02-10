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
import AlertMessage, { DismissAlertBtn } from "../../components/alert-message";
import CreateBoloModal from "../../components/modals/leo/createBoloModal";
import PlateSearchModal from "../../components/modals/leo/plateSearchModal";
import NameSearchModal from "../../components/modals/leo/nameSearchModal";
import WeaponSearchModal from "../../components/modals/leo/weaponSearchModal";
import CreateWrittenWarningModal from "../../components/modals/leo/createWrittenWarningModal";
import CreateArrestReportModal from "../../components/modals/leo/createArrestReportModal";
import CreateTicketModal from "../../components/modals/leo/createTicketModal";
import { connect } from "react-redux";
import Message from "../../interfaces/Message";
import Officer from "../../interfaces/Officer";
import { playSound } from "../../lib/functions";
import { getPenalCodes } from "../../lib/actions/admin";
import { useLocation } from "react-router-dom";

interface Props {
  aop: string;
  message: Message;
  activeOfficer: Officer | null;
  getPenalCodes: () => void;
}

const LeoDash: React.FC<Props> = (props) => {
  const location = useLocation();
  const { getPenalCodes } = props;
  const [time, setTime] = React.useState<Date>(new Date());
  const [aop, setAop] = React.useState<string>(props.aop);
  const [panic, setPanic] = React.useState<Officer | null>(null);

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
    socket.on("UPDATE_AOP", (newAop: string) => {
      setAop(newAop);
    });

    socket.on("PANIC_BUTTON", (officer: Officer) => {
      setPanic(officer);
      playSound("/sounds/signal-100.wav");
    });
  }, []);

  React.useEffect(() => {
    socket.on("UPDATE_ASSIGNED_UNITS", (unitIds: string[]) => {
      if (location.pathname !== "/leo/dash") return;
      if (props.activeOfficer && unitIds.includes(props.activeOfficer?.id)) {
        playSound("/sounds/success.mp3");
      }
    });
  }, [props.activeOfficer, location]);

  return (
    <Layout fluid classes="mt-5">
      {panic !== null ? (
        <div role="alert" className="alert alert-danger alert-dismissible">
          {panic.officer_name} has activated panic button
          <DismissAlertBtn onClick={() => setPanic(null)} />
        </div>
      ) : null}
      {props.message ? <AlertMessage message={props.message} dismissible /> : null}

      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
          <span>{new Date(time).toLocaleString()}</span>
        </div>
        <div className="card-body row gap-2 px-4">
          <ModalButtons activeOfficer={props.activeOfficer} />
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
      <SelectOfficerModal />
      <NotepadModal />
      <CreateBoloModal />
      <WeaponSearchModal />
      <PlateSearchModal />
      <NameSearchModal />
      <CreateWrittenWarningModal />
      <CreateArrestReportModal />
      <CreateTicketModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  message: state.global.message,
  activeOfficer: state.officers.activeOfficer,
});

export default connect(mapToProps, { getPenalCodes })(React.memo(LeoDash));
