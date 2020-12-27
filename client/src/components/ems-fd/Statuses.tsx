import * as React from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import { setEmsStatus, getCurrentEmsStatus } from "../../lib/actions/ems-fd";
import socket from "../../lib/socket";

export const statuses: string[] = ["10-7", "10-6", "10-5", "10-97"];

interface Props {
  status: string;
  status2: string;
  setEmsStatus: (id: string, status: "on-duty" | "off-duty" | string, status2: string) => void;
  getCurrentEmsStatus: () => void;
}

const Statuses: React.FC<Props> = ({
  status: currentStatus,
  status2,
  setEmsStatus,
  getCurrentEmsStatus,
}) => {
  const deputyId = String(localStorage.getItem("on-duty-ems-fd"));

  React.useEffect(() => {
    getCurrentEmsStatus();
  }, [getCurrentEmsStatus]);

  React.useEffect(() => {
    socket.on("UPDATE_ACTIVE_UNITS", () => {
      getCurrentEmsStatus();
    });
  }, [getCurrentEmsStatus]);

  function updateStatus(e: any) {
    const status = e.target.value;

    /* little spam protection */
    if (status2 === status) return;

    setEmsStatus(deputyId, "on-duty", status);
  }

  return (
    <>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#selectEmsFdModal"
        className={status2 === "10-8" ? "btn btn-primary col-md-1" : "btn btn-secondary col-md-1"}
      >
        10-8
      </button>
      {statuses.map((status: string, idx: number) => {
        return (
          <button
            disabled={currentStatus === "off-duty"}
            className={
              status2 === status ? "btn btn-primary col-md-1" : "btn btn-secondary col-md-1"
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
  status: state.ems_fd.status,
  status2: state.ems_fd.status2,
});

const Memoized = React.memo(Statuses);

export default connect(mapToProps, { setEmsStatus, getCurrentEmsStatus })(Memoized);
