import * as React from "react";
import { connect } from "react-redux";
import Call from "../../interfaces/Call";
import { Item, Span } from "../../pages/citizen/citizen-info";
import Update911Call from "../modals/dispatch/Update911Call";
import { end911Call, getActive911Calls } from "../../lib/actions/911-calls";
import State from "../../interfaces/State";
import socket from "../../lib/socket";

interface CallItemProps {
  call: Call;
  end911Call: (id: string) => void;
}

const CallItem: React.FC<CallItemProps> = ({ call, end911Call }) => {
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

  return (
    <div title="Click to expand" className="py-2">
      <div
        className="map-call-container"
        data-bs-toggle="collapse"
        data-bs-target={`#collapse-${call.id}`}
      >
        <Item id="call_location">
          <Span>Call: </Span>
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
      <div id={`collapse-${call.id}`} className="collapse mt-2">
        <div className="map-column">
          <Item id="caller">
            <Span>Caller:</Span> {call.name}
          </Item>
          <Item id="description">
            <Span>Description:</Span> {call.description}
          </Item>
          <Item id="location">
            <Span>Location:</Span> {call.location}
          </Item>
          <Item id="location">
            <Span>Assigned units: </Span>
            {assignedUnits.length <= 0 ? "None" : assignedUnits}
          </Item>

          <div className="d-flex gap-2 mt-2">
            <button
              data-bs-toggle="modal"
              data-bs-target={`#update911CallMap-call-${call.id}`}
              className="btn btn-success w-50"
            >
              Edit call
            </button>
            <button onClick={() => end911Call(call.id)} className="btn btn-danger w-50">
              End call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface Props {
  calls: Call[];
  getActive911Calls: () => void;
  end911Call: (id: string) => void;
}

const Active911MapCalls: React.FC<Props> = ({ calls, getActive911Calls, end911Call }) => {
  React.useEffect(() => {
    getActive911Calls();

    socket.on("UPDATE_911_CALLS", () => getActive911Calls());
  }, [getActive911Calls]);

  return (
    <div className="map-calls-container">
      <h1 className="h4">Active Calls</h1>
      {calls.length <= 0 ? (
        <p>No active calls</p>
      ) : (
        calls.map((call: Call) => {
          return <CallItem end911Call={end911Call} key={call.id} call={call} />;
        })
      )}

      {calls.map((call: Call) => {
        return <Update911Call id={`Map-call-${call.id}`} key={call.id} call={call} />;
      })}
    </div>
  );
};
const mapToProps = (state: State) => ({
  calls: state.calls.calls_911,
});

export default connect(mapToProps, { end911Call, getActive911Calls })(Active911MapCalls);
