import * as React from "react";
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
import Message from "../../interfaces/Message";

interface Props {
  aop: string;
  message: Message;
}

const EmsFdDash: React.FC<Props> = (props) => {
  const [aop, setAop] = React.useState<string>(props.aop);

  React.useEffect(() => {
    socket.on("UPDATE_AOP", (newAop: string) => {
      setAop(newAop);
    });
  }, []);

  React.useEffect(() => {
    document.title = "EMS-FD Dashboard";
  }, []);

  return (
    <Layout fluid classes="mt-5">
      <div className="card bg-dark mb-4">
        <div className="card-header">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
        </div>

        <div className="card-body row gap-2 px-4">
          <a className="btn btn-primary col-md-3" href="/ems-fd/deputies">
            {lang.ems_fd.my_ems_fd}
          </a>
          <button
            className="btn btn-secondary col-md-3"
            data-bs-target="#searchMedicalRecordsModal"
            data-bs-toggle="modal"
          >
            {lang.global.medical_search}
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

      {/* Modals */}
      <SearchMedicalRecord />
      <SelectEmsFdModal />
      <NotepadModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  message: state.global.message,
});

export default connect(mapToProps)(EmsFdDash);
