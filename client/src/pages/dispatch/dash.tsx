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
import AlertMessage from "../../components/alert-message";
import Message from "../../interfaces/Message";

interface Props {
  aop: string;
  message: Message;
}

const DispatchDash: React.FC<Props> = (props) => {
  const [time, setTime] = React.useState<Date>(new Date());
  const [aop, setAop] = React.useState<string>(props.aop);

  React.useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 900);
  }, [time]);

  React.useEffect(() => {
    socket.on("UPDATE_AOP", (newAop: any) => {
      setAop(newAop);
    });
  }, []);

  return (
    <Layout fluid classes="pb-5 mt-5">
      {props.message ? <AlertMessage message={props.message} dismissible /> : null}
      <div className="card bg-dark border-dark mt-4">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
          <span>{time.toLocaleString()}</span>
        </div>
        <div className="card-body">
          <ModalButtons />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-8">
          <ActiveUnits />
        </div>
        <div className="col-md-4">
          <UpdateAOP />
        </div>
      </div>

      <ActiveCalls />
      <ActiveBolos />

      {/* modals */}
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
  message: state.global.message,
});

export default connect(mapToProps)(React.memo(DispatchDash));
