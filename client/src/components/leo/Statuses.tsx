import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Code10 from "../../interfaces/Code10";
import Officer from "../../interfaces/Officer";
import State from "../../interfaces/State";
import { get10Codes } from "../../lib/actions/admin";
import { getCurrentOfficer, setStatus } from "../../lib/actions/officer";
import { filterCodes } from "../../lib/functions";
import socket from "../../lib/socket";
import { SOCKET_EVENTS } from "../../lib/types";

interface Props {
  status: string | null;
  status2: string | null;
  statuses: Code10[];
  activeOfficer: Officer | null;
  getCurrentOfficer: (id: string) => void;
  setStatus: (id: string, status: "on-duty" | "off-duty", status2: string) => void;
  get10Codes: () => void;
}

const Statuses: React.FC<Props> = ({
  status: currentStatus,
  status2,
  statuses,
  activeOfficer,
  getCurrentOfficer,
  setStatus,
  get10Codes,
}) => {
  const officerId = String(localStorage.getItem("on-duty-officerId"));

  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  React.useEffect(() => {
    getCurrentOfficer(officerId);
  }, [getCurrentOfficer, officerId]);

  React.useEffect(() => {
    const handler = () => getCurrentOfficer(officerId);

    socket.on(SOCKET_EVENTS.UPDATE_ACTIVE_UNITS, handler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_ACTIVE_UNITS, handler);
    };
  }, [officerId, getCurrentOfficer]);

  function updateStatus(e: any) {
    const status = e.target.value;

    /* little spam protection */
    if (status === status2) return;

    setStatus(officerId, "on-duty", status);
  }

  return (
    <>
      {activeOfficer ? (
        <button
          className={status2 === "10-8" ? "btn btn-primary col-sm-1" : "btn btn-secondary col-sm-1"}
          type="button"
          onClick={updateStatus}
          value="10-8"
        >
          10-8
        </button>
      ) : (
        <button
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#selectOfficerModal"
          className={status2 === "10-8" ? "btn btn-primary col-sm-1" : "btn btn-secondary col-sm-1"}
        >
          10-8
        </button>
      )}

      {statuses.length <= 0 ? (
        <p>
          You can now have custom 10 codes for your CAD!{" "}
          <Link to="/admin/manage/10-codes">If you&apos;re an admin, please add them here</Link>
        </p>
      ) : (
        <>
          {filterCodes(statuses)
            .filter((code) => {
              const values = code.what_pages.map((page) => {
                return page.value;
              });

              return values.includes("leo");
            })
            .map((code: Code10, idx: number) => {
              return (
                <button
                  disabled={currentStatus === "off-duty"}
                  className={
                    status2 === code.code
                      ? "btn btn-primary col-sm-1"
                      : `btn ${code.color} col-sm-1`
                  }
                  type="button"
                  id={`${idx}`}
                  key={idx}
                  onClick={updateStatus}
                  value={code.code}
                >
                  {code.code}
                </button>
              );
            })}
        </>
      )}
    </>
  );
};

const mapToProps = (state: State) => ({
  status: state.officers.status,
  status2: state.officers.status2,
  statuses: state.admin.codes,
  activeOfficer: state.officers.activeOfficer,
});

const Memoized = React.memo(Statuses);

export default connect(mapToProps, { getCurrentOfficer, setStatus, get10Codes })(Memoized);
