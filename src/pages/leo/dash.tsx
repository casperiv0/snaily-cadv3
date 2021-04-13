import { GetServerSideProps } from "next";
import { connect } from "react-redux";
import * as React from "react";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getBolos } from "@actions/bolos/BoloActions";
import { getCalls } from "@actions/calls/CallActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { getActiveOfficer } from "@actions/officer/OfficerActions";
import { initializeStore } from "@state/useStore";

import { Active911Calls } from "@components/Active911Calls/Active911Calls";
import { Nullable, State } from "types/State";
import lang from "../../language.json";
import { ModalButtons } from "@components/leo/ModalButtons";
import { Statuses } from "@components/leo/Statuses";
import { ActiveBolos } from "@components/ActiveBolos/ActiveBolos";
// import { SelectOfficerModal } from "@components/modals/leo/selectOfficerModal";
// import { CreateWarrant } from "@components/leo/CreateWarrant";
import { socket } from "@hooks/useSocket";
import { NotepadModal } from "../../components/modals/NotepadModal";
import { CreateBoloModal } from "@components/modals/leo/CreateBoloModal";
import { PlateSearchModal } from "@components/modals/leo/PlateSearchModal";
// import { NameSearchModal } from "@components/modals/leo/NameSearchModal";
import { WeaponSearchModal } from "@components/modals/leo/WeaponSearchModal";
// import { CreateWrittenWarningModal } from "@components/modals/leo/CreateWrittenWarningModal";
// import { CreateArrestReportModal } from "@components/modals/leo/CreateArrestReportModal";
// import { CreateTicketModal } from "@components/modals/leo/CreateTicketModal";
import { Officer } from "types/Officer";
import { isUnitAlreadyAssigned, notify, playSound } from "@lib/utils";
import { getPenalCodes } from "@actions/admin/AdminActions";
import { User } from "types/User";
import { Cad } from "types/Cad";
import { DismissAlertBtn } from "@components/AlertMessage/AlertMessage";
import { SocketEvents } from "types/Socket";
import { Call } from "types/Call";
import { Perm } from "types/Perm";
import { Layout } from "@components/Layout";
import { useRouter } from "next/router";

interface Props {
  aop: Nullable<string>;
  activeOfficer: Nullable<Officer>;
  cadInfo: Nullable<Cad>;
  user: User | null;
  calls: Call[];
  getPenalCodes: () => void;
}

const LeoDash: React.FC<Props> = (props) => {
  const router = useRouter();
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

    socket.on(SocketEvents.UpdateAop, aopHandler);
    socket.on(SocketEvents.PanicButton, panicButtonHandler);
    socket.on(SocketEvents.Signal100, signal100Handler);

    return () => {
      socket.off(SocketEvents.UpdateAop, aopHandler);
      socket.off(SocketEvents.PanicButton, panicButtonHandler);
      socket.off(SocketEvents.Signal100, signal100Handler);

      panicSound.stop;
      signal100Sound.stop();
    };
  }, []);

  React.useEffect(() => {
    const successSound = playSound("/sounds/success.mp3");

    const unitsHandler = (unitIds: string[]) => {
      if (router.pathname !== "/leo/dash") return;
      if (props.activeOfficer && unitIds.includes(props.activeOfficer?.id)) {
        /* If the officer is already assigned to a call, don't notify them. */
        const alreadyAssigned = isUnitAlreadyAssigned(props.activeOfficer.id, props.calls);
        if (alreadyAssigned) return;

        notify.success(lang.global.assigned_to_call);
        successSound.play();
      }
    };

    socket.on(SocketEvents.UpdateAssignedUnits, unitsHandler);

    return () => {
      socket.off(SocketEvents.UpdateAssignedUnits, unitsHandler);
      successSound.stop();
    };
  }, [props.activeOfficer, router, props.calls]);

  return (
    <Layout fluid>
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
        <div className="col-md-3 mt-2">{/* <CreateWarrant /> */}</div>
      </div>

      {/* <SelectOfficerModal /> */}
      <NotepadModal />
      <CreateBoloModal />
      <WeaponSearchModal />
      <PlateSearchModal />
      {/* <NameSearchModal /> */}
      {/* <CreateWrittenWarningModal /> */}
      {/* <CreateArrestReportModal /> */}
      {/* <CreateTicketModal /> */}
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  activeOfficer: state.officers.activeOfficer,
  cadInfo: state.global.cadInfo,
  user: state.auth.user,
  calls: state.calls.calls,
});

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getBolos(req.headers)(store.dispatch);
  await getCalls("911", req.headers)(store.dispatch);
  await getActiveOfficer(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

export default connect(mapToProps, { getPenalCodes })(React.memo(LeoDash));
