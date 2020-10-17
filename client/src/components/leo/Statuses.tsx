import * as React from "react";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import { getCurrentOfficer } from "../../lib/actions/officer";

const statuses: string[] = [
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
}

const Statuses: React.FC<Props> = ({
  status: currentStatus,
  status2,
  getCurrentOfficer,
}) => {
  const officerId = String(localStorage.getItem("on-duty-officer"));

  React.useEffect(() => {
    getCurrentOfficer(officerId);
  }, [getCurrentOfficer, officerId]);

  function updateStatus(e: any) {
    const value = e.target.value;

    //   setOfficerStatus(officerId, value)
  }

  return (
    <>
      <button
        type="button"
        data-toggle="modal"
        date-target="#selectOfficerModal"
        className={
          status2 === currentStatus
            ? "btn btn-primary col-sm-1 mr-2 "
            : "btn btn-secondary col-sm-1 mr-2 "
        }
      >
        10-8
      </button>
      {statuses.map((status: string, idx: number) => {
        return (
          <button
            disabled={!currentStatus}
            className={
              status2 === currentStatus
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

export default connect(mapToProps, { getCurrentOfficer })(Statuses);
