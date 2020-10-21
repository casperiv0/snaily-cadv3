import * as React from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import { getCurrentOfficer, setStatus } from "../../lib/actions/officer";
import socket from "../../lib/socket";

export const statuses: string[] = [
  "10-7",
  "10-6",
  "10-5",
  "10-4",
  "10-15",
  "10-17",
  "10-97",
  "code 5",
  "code 6",
];

interface Props {
  status: string;
  status2: string;
  getCurrentOfficer: (id: string) => void;
  setStatus: (
    id: string,
    status: "on-duty" | "off-duty",
    status2: string
  ) => void;
}

const Statuses: React.FC<Props> = ({
  status: currentStatus,
  status2,
  getCurrentOfficer,
  setStatus,
}) => {
  const officerId = String(localStorage.getItem("on-duty-officerId"));

  React.useEffect(() => {
    getCurrentOfficer(officerId);
  }, [getCurrentOfficer, officerId]);

  React.useEffect(() => {
    socket.on("UPDATE_ACTIVE_UNITS", () => {
      getCurrentOfficer(officerId);
    });
  }, [officerId, getCurrentOfficer]);

  function updateStatus(e: any) {
    const status = e.target.value;

    /* little spam protection */
    if (status === status2) return;

    setStatus(officerId, "on-duty", status);
  }

  return (
    <>
      <button
        type="button"
        data-toggle="modal"
        data-target="#selectOfficerModal"
        className={
          status2 === "10-8"
            ? "btn btn-primary col-sm-1 mr-2 "
            : "btn btn-secondary col-sm-1 mr-2 "
        }
      >
        10-8
      </button>
      {statuses.map((status: string, idx: number) => {
        return (
          <button
            disabled={currentStatus === "off-duty"}
            className={
              status2 === status
                ? "btn btn-primary col-sm-1 mr-2 "
                : "btn btn-secondary col-sm-1 mr-2 "
            }
            type="button"
            id={`${idx}`}
            key={idx}
            onClick={updateStatus}
            value={status}
          >
            {status}
          </button>
        );
      })}
    </>
  );
};

const mapToProps = (state: State) => ({
  status: state.officers.status,
  status2: state.officers.status2,
});

const Memoized = React.memo(Statuses);

export default connect(mapToProps, { getCurrentOfficer, setStatus })(Memoized);
