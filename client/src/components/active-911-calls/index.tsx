import * as React from "react";
import { useLocation } from "react-router-dom";
import Call from "../../interfaces/Call";
import State from "../../interfaces/State";
import { connect } from "react-redux";
import { end911Call, getActive911Calls } from "../../lib/actions/911-calls";
import socket from "../../lib/socket";
import { playSound } from "../../lib/functions";
import Officer from "../../interfaces/Officer";
import Deputy from "../../interfaces/Deputy";

interface Props {
  calls: Call[];
  activeOfficer: Officer | null;
  activeDeputy: Deputy | null;
  getActive911Calls: () => void;
  end911Call: (id: string) => void;
}

const Active911Calls: React.FC<Props> = ({
  calls,
  activeOfficer,
  activeDeputy,
  getActive911Calls,
  end911Call,
}) => {
  const location = useLocation();
  const disabled = React.useMemo(() => {
    if (location.pathname === "/ems-fd/dash") {
      return !activeDeputy;
    } else if (location.pathname === "/leo/dash") {
      return !activeOfficer;
    } else {
      return true;
    }
  }, [location.pathname, activeOfficer, activeDeputy]);

  React.useEffect(() => {
    getActive911Calls();
  }, [getActive911Calls]);

  React.useEffect(() => {
    const sound = playSound("/sounds/new-call.mp3");
    const getCallHandler = () => getActive911Calls();
    const newCallHandler = () => {
      if (["/dispatch", "/leo/dash", "/ems/dash"].includes(location.pathname)) {
        sound.play();
      }
    };

    socket.on("UPDATE_911_CALLS", getCallHandler);
    socket.on("NEW_911_CALL", newCallHandler);

    return () => {
      socket.off("NEW_911_CALL", newCallHandler);
      socket.off("UPDATE_911_CALLS", getCallHandler);
      sound.stop();
    };
  }, [getActive911Calls, location]);

  return (
    <ul className="list-group overflow-auto" style={{ maxHeight: "25rem" }}>
      <li className="bg-secondary border-secondary list-group-item sticky-top">
        {window.lang.global.active_erm_calls}
      </li>
      {!calls[0] ? (
        <li className="list-group-item bg-dark">{window.lang.global.no_calls}</li>
      ) : (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{window.lang.dispatch.caller_name}</th>
              <th scope="col">{window.lang.dispatch.caller_location}</th>
              <th scope="col">{window.lang.dispatch.call_desc}</th>
              <th scope="col">{window.lang.dispatch.status}</th>
              <th scope="col">{window.lang.dispatch.assigned_unit}</th>
              <th scope="col">{window.lang.global.actions}</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((call: Call, idx: number) => {
              return (
                <tr id={`${idx}`} key={idx}>
                  <th scope="row">{++idx}</th>
                  <td>{call.name}</td>
                  <td>{call.location}</td>
                  <td>{call.description}</td>
                  <td>{call.status}</td>
                  <td>
                    {call.assigned_unit.map((c, i) => {
                      const comma = i !== call.assigned_unit.length - 1 ? ", " : " ";
                      return (
                        <span key={c.value}>
                          {c.label}
                          {comma}
                        </span>
                      );
                    })}
                  </td>
                  <td>
                    <button
                      disabled={disabled}
                      title={disabled ? "Go on-duty first!" : ""}
                      onClick={() => {
                        end911Call(call.id);
                      }}
                      className="btn btn-success"
                    >
                      {window.lang.dispatch.mark_code_4}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </ul>
  );
};

const mapToProps = (state: State) => ({
  calls: state.calls.calls_911,
  activeOfficer: state.officers.activeOfficer,
  activeDeputy: state.ems_fd.activeDeputy,
});

const Memoized = React.memo(Active911Calls);

export default connect(mapToProps, { getActive911Calls, end911Call })(Memoized);
