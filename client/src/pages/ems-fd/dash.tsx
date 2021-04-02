import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import socket from "../../lib/socket";
import lang from "../../language.json";
import Statuses from "../../components/ems-fd/Statuses";
import NotepadModal from "../../components/modals/notepad";
import SelectEmsFdModal from "../../components/modals/ems-fd/selectEmsFdModal";
import SearchMedicalRecord from "../../components/modals/ems-fd/searchMedicalRecords";
import Active911Calls from "../../components/active-911-calls";
import Deputy from "../../interfaces/Deputy";
import { get10Codes } from "../../lib/actions/admin";
import AddMedicalRecordModal from "../../components/modals/ems-fd/addMedicalRecordModal";
import useDocTitle from "../../hooks/useDocTitle";
import { notify, playSound } from "../../lib/functions";
import { SOCKET_EVENTS } from "../../lib/types";

interface Props {
  aop: string | null;
  activeDeputy: Deputy | null;
  get10Codes: () => void;
}

const EmsFdDash: React.FC<Props> = (props) => {
  const { get10Codes } = props;
  const location = useLocation();
  const [aop, setAop] = React.useState<string>(props?.aop ?? "");
  useDocTitle(lang.ems_fd.ems_dash);

  React.useEffect(() => {
    const handler = (newAop: string) => setAop(newAop);

    socket.on(SOCKET_EVENTS.UPDATE_AOP, handler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_AOP, handler);
    };
  }, []);

  React.useEffect(() => {
    const successSound = playSound("/sounds/success.mp3");

    const unitsHandler = (unitIds: string[]) => {
      if (location.pathname !== "/ems-fd/dash") return;
      if (props.activeDeputy && unitIds.includes(props.activeDeputy?.id)) {
        notify(window.lang.global.assigned_to_call).success();
        successSound.play();
      }
    };

    socket.on(SOCKET_EVENTS.UPDATE_ASSIGNED_UNITS, unitsHandler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_ASSIGNED_UNITS, unitsHandler);
      successSound.stop();
    };
  }, [props.activeDeputy, location]);

  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  return (
    <Layout fluid>
      <div className="card bg-dark mb-4">
        <div className="card-header">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
        </div>

        <div className="card-body row gap-2 px-4">
          {props.activeDeputy ? (
            <h5 style={{ marginLeft: "-10px" }}>
              {window.lang.global.currently_active_as} {props.activeDeputy?.name}
            </h5>
          ) : null}
          <Link className="btn btn-primary col-md-3" to="/ems-fd/deputies">
            {lang.ems_fd.my_ems_fd}
          </Link>
          <button
            className="btn btn-secondary col-md-3"
            data-bs-target="#searchMedicalRecordsModal"
            data-bs-toggle="modal"
          >
            {lang.global.medical_search}
          </button>

          <button
            type="button"
            className="btn btn-secondary col-md-3"
            data-bs-toggle="modal"
            data-bs-target="#addMedicalRecord"
          >
            {window.lang.ems_fd.add_medical_record}
          </button>

          <button
            className="btn btn-secondary col-md-3"
            data-bs-target="#notepad"
            data-bs-toggle="modal"
          >
            {lang.global.notepad}
          </button>
        </div>

        <div className="card-footer row gap-2 px-4">
          <Statuses />
        </div>
      </div>

      <Active911Calls />

      <SearchMedicalRecord />
      <SelectEmsFdModal />
      <NotepadModal />
      <AddMedicalRecordModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  activeDeputy: state.ems_fd.activeDeputy,
});

export default connect(mapToProps, { get10Codes })(EmsFdDash);
