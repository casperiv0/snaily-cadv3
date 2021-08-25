import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { connect } from "react-redux";
import * as React from "react";
import dynamic from "next/dynamic";

import { verifyAuth } from "actions/auth/AuthActions";
import { getBolos } from "actions/bolos/BoloActions";
import { getCalls } from "actions/calls/CallActions";
import { getCadInfo } from "actions/global/GlobalActions";
import { getActiveOfficer, searchNames } from "actions/officer/OfficerActions";
import { getPenalCodes } from "actions/admin/AdminActions";
import { initializeStore } from "state/useStore";
import { Active911Calls } from "components/Active911Calls/Active911Calls";
import { Nullable, State } from "types/State";
import lang from "../../language.json";
import { ModalButtons } from "components/leo/ModalButtons";
import { Statuses } from "components/leo/Statuses";
import { ActiveBolos } from "components/ActiveBolos/ActiveBolos";
import { CreateWarrant } from "components/leo/CreateWarrant";
import { socket } from "hooks/useSocket";
import { Officer } from "types/Officer";
import { isUnitAlreadyAssigned, notify, playSound } from "lib/utils";
import { User } from "types/User";
import { Cad } from "types/Cad";
import { DismissAlertBtn } from "components/AlertMessage/AlertMessage";
import { SocketEvents } from "types/Socket";
import { Call } from "types/Call";
import { Perm } from "types/Perm";
import { Layout } from "components/Layout";
import { Seo } from "components/Seo";
import { useDashTime } from "hooks/useDashTime";
import { useClientPerms } from "hooks/useClientPerms";

const MugshotsModal = dynamic(
  async () => (await import("components/modals/leo/MugshotsModal")).MugshotsModal,
);
const NotepadModal = dynamic(
  async () => (await import("components/modals/NotepadModal")).NotepadModal,
);
const CreateBoloModal = dynamic(
  async () => (await import("components/modals/leo/CreateBoloModal")).CreateBoloModal,
);
const PlateSearchModal = dynamic(
  async () => (await import("components/modals/leo/PlateSearchModal")).PlateSearchModal,
);
const NameSearchModal = dynamic(
  async () => (await import("components/modals/leo/NameSearchModal")).NameSearchModal,
);
const WeaponSearchModal = dynamic(
  async () => (await import("components/modals/leo/WeaponSearchModal")).WeaponSearchModal,
);
const CreateWrittenWarningModal = dynamic(
  async () =>
    (await import("components/modals/leo/CreateWrittenWarningModal")).CreateWrittenWarningModal,
);
const CreateArrestReportModal = dynamic(
  async () =>
    (await import("components/modals/leo/CreateArrestReportModal")).CreateArrestReportModal,
);
const CreateTicketModal = dynamic(
  async () => (await import("components/modals/leo/CreateTicketModal")).CreateTicketModal,
);
const SelectOfficerModal = dynamic(
  async () => (await import("components/modals/leo/SelectOfficerModal")).SelectOfficerModal,
);
const UploadMugshotsModal = dynamic(
  async () => (await import("components/modals/leo/UploadMugshotsModal")).UploadMugshotsModal,
);

interface Props {
  aop: Nullable<string>;
  activeOfficer: Nullable<Officer>;
  cadInfo: Nullable<Cad>;
  user: User | null;
  calls: Call[];

  searchNames: () => void;
  getPenalCodes: () => void;
}

const LeoDash: React.FC<Props> = (props) => {
  const router = useRouter();
  const { getPenalCodes, searchNames } = props;
  const [aop, setAop] = React.useState<string>(props?.aop ?? "");
  const [panic, setPanic] = React.useState<Officer | null>(null);
  const [signal100, setSignal100] = React.useState<Perm>(props.cadInfo?.signal_100 ?? "0");
  const time = useDashTime();
  useClientPerms("leo");

  React.useEffect(() => {
    const handler = () => {
      searchNames();
    };

    socket.on(SocketEvents.UpdateNameSearchNames, handler);

    return () => {
      socket.off(SocketEvents.UpdateNameSearchNames, handler);
    };
  }, [searchNames]);

  React.useEffect(() => {
    setSignal100(props.cadInfo?.signal_100 ?? "0");
  }, [props.cadInfo]);

  React.useEffect(() => {
    getPenalCodes();
    searchNames();
  }, [getPenalCodes, searchNames]);

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
        /* if the officer is already assigned to a call, don't notify them. */
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
      <Seo title="LEO Dashboard" />

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

      <SelectOfficerModal />
      <NotepadModal />
      <CreateBoloModal />
      <WeaponSearchModal />
      <PlateSearchModal />
      <NameSearchModal />
      <CreateWrittenWarningModal />
      <CreateArrestReportModal />
      <CreateTicketModal />
      <UploadMugshotsModal />
      <MugshotsModal />
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

export default connect(mapToProps, { getPenalCodes, searchNames })(React.memo(LeoDash));
