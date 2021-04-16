import * as React from "react";
import J from "jquery";
import { connect } from "react-redux";
import { Call } from "types/Call";
import Update911Call from "../modals/dispatch/Update911Call";
import { endCall, getCalls } from "@actions/calls/CallActions";
import { State } from "types/State";
import { socket } from "@hooks/useSocket";
import { playSound } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { SocketEvents } from "types/Socket";
import lang from "src/language.json";
import { Item, Span } from "@components/Item";
import { CallTypes } from "@actions/calls/CallTypes";

interface CallItemProps {
  call: Call;
  endCall: (type: CallTypes, id: string) => void;
  setMarker: (call: Call, type: "remove" | "place") => void;
  hasMarker: (id: string) => boolean;
  setTempCall: React.Dispatch<React.SetStateAction<Call | null>>;
}

const CallItem: React.FC<CallItemProps> = ({
  call,
  endCall,
  setMarker,
  hasMarker,
  setTempCall,
}) => {
  const assignedUnits = React.useMemo(() => {
    return call.assigned_unit.map((c, i) => {
      const comma = i !== call.assigned_unit.length - 1 ? ", " : " ";
      return (
        <span key={c.value}>
          {c.label}
          {comma}
        </span>
      );
    });
  }, [call]);

  function updateZIndex(call: Call) {
    J("#modal-portal").css("z-index", 999);

    setTempCall(call);
  }

  return (
    <div title="Click to expand" className="py-2">
      <div
        className="map-call-container"
        data-bs-toggle="collapse"
        data-bs-target={`#collapse-${call.id}`}
      >
        <Item id="call_location">
          <Span>{lang.dispatch.call}: </Span>
          {call.location}
        </Item>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-caret-down-fill map-toggle-call"
          viewBox="0 0 16 16"
        >
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </div>
      <div id={`collapse-${call.id}`} className="collapse">
        <div className="map-column">
          <Item id="caller">
            <Span>{lang.dispatch.caller_name}:</Span> {call.name}
          </Item>
          <Item id="description">
            <Span>{lang.dispatch.call_desc}:</Span> {call.description}
          </Item>
          <Item id="location">
            <Span>{lang.dispatch.caller_location}:</Span> {call.location}
          </Item>
          <Item id="type">
            <Span>{lang.citizen.medical.type2}: </Span>
            {call.type === "1" ? lang.dispatch.citizen_call : call.type}
          </Item>
          <Item id="assigned_unit">
            <Span>{lang.dispatch.assigned_unit}: </Span>
            {assignedUnits.length <= 0 ? "None" : assignedUnits}
          </Item>

          <div className="d-flex gap-2 mt-2">
            <button
              data-bs-toggle="modal"
              data-bs-target={`#${ModalIds.Update911Call}`}
              className="btn btn-success w-50"
              onClick={() => updateZIndex(call)}
            >
              {lang.dispatch.update_call}
            </button>
            <button onClick={() => endCall("911", call.id)} className="btn btn-danger w-50">
              {lang.tow.end_call}
            </button>
          </div>
          <button
            onClick={() => setMarker(call, hasMarker(call.id) ? "remove" : "place")}
            className="btn btn-secondary w-100 mt-2"
          >
            {hasMarker(call.id) ? lang.dispatch.remove_marker : lang.dispatch.place_marker}
          </button>
        </div>
      </div>
    </div>
  );
};

interface Props {
  calls: Call[];
  getCalls: (type: CallTypes) => void;
  setMarker: (call: Call, type: "remove" | "place") => void;
  endCall: (type: CallTypes, id: string) => void;
  hasMarker: (id: string) => boolean;
}

const Active911MapCalls: React.FC<Props> = ({ calls, getCalls, endCall, setMarker, hasMarker }) => {
  const [tempCall, setTempCall] = React.useState<Call | null>(null);

  React.useEffect(() => {
    const sound = playSound("/sounds/new-call.mp3");
    const callHandler = () => getCalls("911");
    const newCallHandler = () => sound.play();

    socket.on(SocketEvents.Update911Calls, callHandler);
    socket.on(SocketEvents.New911Call, newCallHandler);

    return () => {
      socket.off(SocketEvents.Update911Calls, callHandler);
      socket.off(SocketEvents.New911Call, newCallHandler);
      sound.stop();
    };
  }, [getCalls]);

  return (
    <div className="map-calls-container active-calls">
      <h1 className="h4">{lang.global.active_erm_calls}</h1>
      {calls.length <= 0 ? (
        <p>{lang.global.no_calls}</p>
      ) : (
        <>
          {calls.map((call) => {
            return (
              <CallItem
                setTempCall={setTempCall}
                hasMarker={hasMarker}
                setMarker={setMarker}
                endCall={endCall}
                key={call.id}
                call={call}
              />
            );
          })}
        </>
      )}
      <Update911Call call={tempCall} />
    </div>
  );
};
const mapToProps = (state: State) => ({
  calls: state.calls.calls,
});

const Memoized = React.memo(Active911MapCalls);
export const ActiveMapCalls = connect(mapToProps, { getCalls, endCall })(Memoized);
