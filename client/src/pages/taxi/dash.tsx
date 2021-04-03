import * as React from "react";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import TowCall from "../../interfaces/TowCall";
import socket from "../../lib/socket";
import lang from "../../language.json";
import { connect } from "react-redux";
import { endTaxiCall, getTaxiCalls } from "../../lib/actions/taxi-calls";
import NotepadModal from "../../components/modals/NotepadModal";
import useDocTitle from "../../hooks/useDocTitle";
import { SOCKET_EVENTS } from "../../lib/types";

interface Props {
  calls: TowCall[];
  aop: string | null;
  getTaxiCalls: () => void;
  endTaxiCall: (id: string) => void;
}

const TaxiDash: React.FC<Props> = (props) => {
  useDocTitle("Taxi Dashboard");
  const { calls, getTaxiCalls, endTaxiCall } = props;
  const [aop, setAop] = React.useState(props.aop);

  React.useEffect(() => {
    getTaxiCalls();
  }, [getTaxiCalls]);

  React.useEffect(() => {
    const handler = (newAop: string) => {
      setAop(newAop);
    };
    const taxiHandler = () => getTaxiCalls();

    socket.on(SOCKET_EVENTS.UPDATE_AOP, handler);
    socket.on(SOCKET_EVENTS.UPDATE_TAXI_CALLS, taxiHandler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_AOP);
      socket.off(SOCKET_EVENTS.UPDATE_TAXI_CALLS, taxiHandler);
    };
  }, [getTaxiCalls]);

  return (
    <Layout fluid>
      <h3>
        {window.lang.taxi.dash} - AOP: {aop}
      </h3>

      <ul className="list-group">
        <li className="list-group-item bg-secondary d-flex justify-content-between">
          <h4>{window.lang.taxi.active_calls}</h4>

          <button data-bs-toggle="modal" data-bs-target="#notepad" className="btn btn-dark">
            {lang.global.notepad}
          </button>
        </li>
        {!calls[0] ? (
          <li className="list-group-item bg-dark border-secondary">{lang.tow.no_calls}</li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th>#</th>
                <th>{lang.global.caller}</th>
                <th>{lang.global.location}</th>
                <th>{lang.global.description}</th>
                <th>{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call: TowCall, idx: number) => {
                return (
                  <tr id={`${idx}`} key={idx}>
                    <th scope="row">{++idx}</th>
                    <td>{call.name}</td>
                    <td>{call.location}</td>
                    <td>{call.description}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => endTaxiCall(call.id)}>
                        {lang.tow.end_call}
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

const mapToProps = (state: State) => ({
  calls: state.calls.taxi_calls,
  aop: state.global.aop,
});

export default connect(mapToProps, { getTaxiCalls, endTaxiCall })(TaxiDash);
