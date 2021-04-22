import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { GetServerSideProps } from "next";
import { Layout } from "@components/Layout";
import { Nullable, State } from "types/State";
import { socket } from "@hooks/useSocket";
import lang from "src/language.json";
import { Statuses } from "@components/ems-fd/Statuses";
import { NotepadModal } from "@components/modals/NotepadModal";
import { SelectEmsFdModal } from "@components/modals/ems-fd/SelectEmsFdModal";
import { SearchMedicalRecordsModal } from "@components/modals/ems-fd/SearchMedicalRecords";
import { Active911Calls } from "@components/Active911Calls/Active911Calls";
import { Deputy } from "types/Deputy";
import { get10Codes } from "@actions/admin/AdminActions";
import { AddMedicalRecordModal } from "@components/modals/ems-fd/AddMedicalRecordModal";
import { notify, playSound } from "@lib/utils";
import { SocketEvents } from "types/Socket";
import { ModalIds } from "types/ModalIds";
import { Seo } from "@components/Seo";
import { initializeStore } from "@state/useStore";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getActiveEmsFd } from "@actions/ems-fd/EmsFdActions";
import { Cad } from "types/Cad";
import { useDashTime } from "@hooks/useDashTime";

interface Props {
  aop: Nullable<string>;
  activeDeputy: Nullable<Deputy>;
  cadInfo: Nullable<Cad>;
  get10Codes: () => void;
}

const EmsFdDash: React.FC<Props> = (props) => {
  const { get10Codes } = props;
  const router = useRouter();
  const time = useDashTime();
  const [aop, setAop] = React.useState<string>(props?.aop ?? "");

  React.useEffect(() => {
    const handler = (newAop: string) => setAop(newAop);
    socket.on(SocketEvents.UpdateAop, handler);

    return () => {
      socket.off(SocketEvents.UpdateAop, handler);
    };
  }, []);

  React.useEffect(() => {
    const successSound = playSound("/sounds/success.mp3");

    const unitsHandler = (unitIds: string[]) => {
      if (router.pathname !== "/ems-fd/dash") return;
      if (props.activeDeputy && unitIds.includes(props.activeDeputy?.id)) {
        notify.success(lang.global.assigned_to_call);
        successSound.play();
      }
    };

    socket.on(SocketEvents.UpdateAssignedUnits, unitsHandler);

    return () => {
      socket.off(SocketEvents.UpdateAssignedUnits, unitsHandler);
      successSound.stop();
    };
  }, [props.activeDeputy, router]);

  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  return (
    <Layout fluid>
      <Seo title={lang.ems_fd.ems_dash} />

      <div className="card bg-dark mb-4">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} {props.cadInfo?.show_aop === "1" ? `- AOP: ${aop}` : null}
          </h4>

          <span>{time}</span>
        </div>

        <div className="card-body row gap-2 px-4">
          {props.activeDeputy ? (
            <h5 style={{ marginLeft: "-10px" }}>
              {lang.global.currently_active_as} {props.activeDeputy?.name}
            </h5>
          ) : null}
          <Link href="/ems-fd/deputies">
            <a className="btn btn-primary col-md-3">{lang.ems_fd.my_ems_fd}</a>
          </Link>
          <button
            className="btn btn-secondary col-md-3"
            data-bs-target={`#${ModalIds.SearchMedicalRecords}`}
            data-bs-toggle="modal"
          >
            {lang.global.medical_search}
          </button>

          <button
            type="button"
            className="btn btn-secondary col-md-3"
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.AddMedicalRecord}`}
          >
            {lang.ems_fd.add_medical_record}
          </button>

          <button
            className="btn btn-secondary col-md-3"
            data-bs-target={`#${ModalIds.Notepad}`}
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

      <SearchMedicalRecordsModal />
      <SelectEmsFdModal />
      <NotepadModal />
      <AddMedicalRecordModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getActiveEmsFd(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
  cadInfo: state.global.cadInfo,
  activeDeputy: state.ems_fd.activeDeputy ?? null,
});

export default connect(mapToProps, { get10Codes })(EmsFdDash);
