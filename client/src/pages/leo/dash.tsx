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
import AlertMessage from "../../components/alert-message";
import CreateBoloModal from "../../components/modals/leo/createBoloModal";
import PlateSearchModal from "../../components/modals/leo/plateSearchModal";
import NameSearchModal from "../../components/modals/leo/nameSearchModal";
import WeaponSearchModal from "../../components/modals/leo/weaponSearchModal";
import { connect } from "react-redux";

interface Props {
  aop: string;
  message: string;
}

const LeoDash: React.FC<Props> = (props) => {
  const [time, setTime] = React.useState<Date>(new Date());
  const [aop, setAop] = React.useState<string>(props.aop);

  React.useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 900);
  }, [time]);

  React.useEffect(() => {
    document.title = "LEO Dashboard";
  });

  React.useEffect(() => {
    socket.on("UPDATE_AOP", (newAop: any) => {
      setAop(newAop);
    });
  }, []);

  return (
    <Layout fluid classes="mt-5">
      {props.message ? <AlertMessage type="success" message={props.message} /> : null}
      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
          <span>{new Date(time).toLocaleString()}</span>
        </div>
        <div className="card-body">
          <ModalButtons />
        </div>
        <div className="card-footer">
          <Statuses />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-9">
          <Active911Calls />
          <ActiveBolos />
        </div>
        <CreateWarrant />
      </div>

      {/* Modals */}
      <SelectOfficerModal />
      <NotepadModal />
      <CreateBoloModal />
      <WeaponSearchModal />
      <PlateSearchModal />
      <NameSearchModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  message: state.global.message,
});

export default connect(mapToProps)(React.memo(LeoDash));
