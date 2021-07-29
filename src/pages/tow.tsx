import { connect } from "react-redux";
import * as React from "react";
import { verifyAuth } from "@actions/auth/AuthActions";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { Layout } from "src/components/Layout";
import { Nullable, State } from "types/State";
import { Seo } from "@components/Seo";
import { ModalIds } from "types/ModalIds";
import { getCadInfo } from "@actions/global/GlobalActions";
import { SocketEvents } from "types/Socket";
import { socket } from "@hooks/useSocket";
import { getCalls, endCall, updateCall } from "@actions/calls/CallActions";
import lang from "../language.json";
import { Call } from "types/Call";
import { NotepadModal } from "@components/modals/NotepadModal";
import { CallTypes } from "@actions/calls/CallTypes";
import { Cad } from "types/Cad";

interface Props {
  calls: Call[];
  aop: Nullable<string>;
  cadInfo: Nullable<Cad>;
  updateCall: (type: CallTypes, id: string, data: Partial<Call>) => void;
  endCall: (type: CallTypes, id: string) => void;
  getCalls: (type: CallTypes) => void;
}

const TowDashPage = ({ calls, cadInfo, endCall, getCalls, ...rest }: Props) => {
  const [aop, setAop] = React.useState(rest.aop);

  React.useEffect(() => {
    const handler = (newAop: string) => setAop(newAop);
    const callHandler = () => getCalls("tow");

    socket.on(SocketEvents.UpdateAop, handler);
    socket.on(SocketEvents.UpdateTowCalls, callHandler);

    return () => {
      socket.off(SocketEvents.UpdateAop, handler);
      socket.off(SocketEvents.UpdateTowCalls, callHandler);
    };
  }, [getCalls]);

  function handleClaimCall(id: string) {
    updateCall("tow", id, { claimed: "1" });
  }

  return (
    <Layout>
      <Seo title={lang.tow.tow_dashboard} />

      <h3>
        {lang.tow.tow_dashboard} {cadInfo?.show_aop === "1" ? `- AOP: ${aop}` : null}
      </h3>

      <ul className="list-group">
        <li className="list-group-item bg-secondary d-flex justify-content-between text-white">
          <h4>{lang.tow.active_tow_calls}</h4>

          <button
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.Notepad}`}
            className="btn btn-dark"
          >
            {lang.global.notepad}
          </button>
        </li>
        {!calls[0] ? (
          <li className="list-group-item bg-dark border-secondary text-white">
            {lang.tow.no_calls}
          </li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>{lang.global.location}</th>
                <th>{lang.global.caller}</th>
                <th>{lang.global.description}</th>
                <th>{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call: Call, idx: number) => {
                return (
                  <tr id={`${idx}`} key={idx}>
                    <th scope="row">{++idx}</th>
                    <td>{call.location}</td>
                    <td>{call.name}</td>
                    <td>{call.description}</td>
                    <td style={{ display: "flex", flexDirection: "column" }}>
                      <button onClick={() => endCall("tow", call.id)} className="btn btn-success">
                        {lang.tow.end_call}
                      </button>
                      <button
                        disabled={call.claimed === "1"}
                        onClick={() => handleClaimCall(call.id)}
                        className="btn btn-success"
                      >
                        {call.claimed === "1" ? lang.tow.claimed : lang.tow.claim_call}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </ul>

      <NotepadModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getCalls("tow", req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  calls: state.calls.calls,
  aop: state.global.aop,
  cadInfo: state.global.cadInfo,
});

export default connect(mapToProps, { getCalls, endCall, updateCall })(TowDashPage);
