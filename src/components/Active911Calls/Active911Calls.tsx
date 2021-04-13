import * as React from "react";
import { Call } from "types/Call";
import { State } from "types/State";
import { connect } from "react-redux";
import { endCall, getCalls } from "@actions/calls/CallActions";
import { update911Call } from "@actions/dispatch/DispatchActions";
import { socket } from "@hooks/useSocket";
import { playSound } from "@lib/utils";
import { Officer } from "types/Officer";
import { Deputy } from "types/Deputy";
import { SocketEvents } from "types/Socket";
import { useRouter } from "next/router";
import { CallTypes } from "@actions/calls/CallTypes";
import lang from "src/language.json";

interface Props {
  calls: Call[];
  activeOfficer: Officer | null;
  activeDeputy: Deputy | null;
  getCalls: (type: CallTypes, headers?: any) => void;
  endCall: (type: CallTypes, id: string) => void;
  update911Call: (id: string, call: Call, notify?: boolean) => void;
}

const Active911CallsC: React.FC<Props> = ({
  calls,
  activeOfficer,
  activeDeputy,
  getCalls,
  endCall,
  update911Call,
}) => {
  const router = useRouter();
  const disabled = React.useMemo(() => {
    if (router.pathname === "/ems-fd/dash") {
      return !activeDeputy;
    } else if (router.pathname === "/leo/dash") {
      return !activeOfficer;
    } else {
      return true;
    }
  }, [router.pathname, activeOfficer, activeDeputy]);

  React.useEffect(() => {
    getCalls("911");
  }, [getCalls]);

  React.useEffect(() => {
    const sound = playSound("/sounds/new-call.mp3");
    const getCallHandler = () => getCalls("911");
    const newCallHandler = () => {
      if (["/dispatch", "/leo/dash", "/ems/dash"].includes(router.pathname)) {
        sound.play();
      }
    };

    socket.on(SocketEvents.New911Call, newCallHandler);
    socket.on(SocketEvents.Update911Calls, getCallHandler);

    return () => {
      socket.off(SocketEvents.New911Call, newCallHandler);
      socket.off(SocketEvents.Update911Calls, getCallHandler);
      sound.stop();
    };
  }, [getCalls, router]);

  return (
    <ul className="list-group overflow-auto" style={{ maxHeight: "25rem" }}>
      <li className="bg-secondary border-secondary list-group-item sticky-top text-white">
        <h6>{lang.global.active_erm_calls}</h6>
      </li>
      {!calls[0] ? (
        <li className="list-group-item bg-dark text-white">{lang.global.no_calls}</li>
      ) : (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{lang.dispatch.caller_name}</th>
              <th scope="col">{lang.dispatch.caller_location}</th>
              <th scope="col">{lang.dispatch.call_desc}</th>
              <th scope="col">{lang.dispatch.status}</th>
              <th scope="col">{lang.citizen.medical.type2}</th>
              <th scope="col">{lang.dispatch.assigned_unit}</th>
              <th scope="col">{lang.global.actions}</th>
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
                  <td>{call.type === "1" ? lang.dispatch.citizen_call : call.type}</td>
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
                        endCall("911", call.id);
                      }}
                      className="btn btn-success"
                    >
                      {lang.dispatch.mark_code_4}
                    </button>
                    <button
                      disabled={disabled}
                      title={disabled ? "Go on-duty first!" : ""}
                      onClick={() => {
                        if (!activeOfficer) return;

                        if (call.assigned_unit.find((u) => u.value === activeOfficer.id)) {
                          return update911Call(call.id, {
                            ...call,
                            assigned_unit: call.assigned_unit.filter(
                              (v) => v.value !== activeOfficer.id,
                            ),
                          });
                        } else {
                          update911Call(
                            call.id,
                            {
                              ...call,
                              assigned_unit: [
                                ...call.assigned_unit,
                                {
                                  label: `${activeOfficer?.callsign} ${activeOfficer?.officer_name}`,
                                  value: activeOfficer?.id,
                                },
                              ],
                            },
                            false,
                          );
                        }
                      }}
                      className="btn btn-success mx-2"
                    >
                      {call.assigned_unit.find((u) => u.value === activeOfficer?.id)
                        ? lang.dispatch.unassign_from_call
                        : lang.dispatch.assign_self_to_call}
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
  calls: state.calls.calls,
  activeOfficer: state.officers.activeOfficer,
  //   activeDeputy: state.ems_fd.activeDeputy,
});

const Memoized = React.memo(Active911CallsC);

export const Active911Calls = connect(mapToProps, { getCalls, endCall, update911Call })(Memoized);
