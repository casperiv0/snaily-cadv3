import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Code10 from "../../interfaces/Code10";
import State from "../../interfaces/State";
import { get10Codes } from "../../lib/actions/admin";
import { getCurrentOfficer, setStatus } from "../../lib/actions/officer";
import socket from "../../lib/socket";

interface Props {
  status: string | null;
  status2: string | null;
  getCurrentOfficer: (id: string) => void;
  setStatus: (id: string, status: "on-duty" | "off-duty", status2: string) => void;
  statuses: Code10[];
  get10Codes: () => void;
}

const Statuses: React.FC<Props> = ({
  status: currentStatus,
  status2,
  getCurrentOfficer,
  setStatus,
  statuses,
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
        data-bs-toggle="modal"
        data-bs-target="#selectOfficerModal"
        className={status2 === "10-8" ? "btn btn-primary col-sm-1" : "btn btn-secondary col-sm-1"}
      >
        10-8
      </button>
      {statuses.length <= 0 ? (
        <p>
          You can now have custom 10 codes for your CAD!{" "}
          <Link to="/admin/manage/10-codes">If you&apos;re an admin, please add them here</Link>
        </p>
      ) : (
        <>
          {statuses
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
});

const Memoized = React.memo(Statuses);

export default connect(mapToProps, { getCurrentOfficer, setStatus, get10Codes })(Memoized);
