import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import State from "../../interfaces/State";
import { setEmsStatus, getCurrentEmsStatus } from "../../lib/actions/ems-fd";
import socket from "../../lib/socket";
import Code10 from "../../interfaces/Code10";
import { filterCodes } from "../modals/dispatch/UpdateStatus";
import Deputy from "../../interfaces/Deputy";

interface Props {
  status: string | null;
  status2: string | null;
  activeDeputy: Deputy | null;
  statuses: Code10[];
  setEmsStatus: (id: string, status: "on-duty" | "off-duty" | string, status2: string) => void;
  getCurrentEmsStatus: () => void;
}

const Statuses: React.FC<Props> = ({
  status: currentStatus,
  activeDeputy,
  status2,
  setEmsStatus,
  getCurrentEmsStatus,
  statuses,
}) => {
  const deputyId = String(localStorage.getItem("on-duty-ems-fd"));

  React.useEffect(() => {
    getCurrentEmsStatus();
  }, [getCurrentEmsStatus]);

  React.useEffect(() => {
    const handler = () => getCurrentEmsStatus();

    socket.on("UPDATE_ACTIVE_UNITS", handler);

    return () => {
      socket.off("UPDATE_ACTIVE_UNITS", handler);
    };
  }, [getCurrentEmsStatus]);

  function updateStatus(e: any) {
    const status = e.target.value;

    /* little spam protection */
    if (status2 === status) return;

    setEmsStatus(deputyId, "on-duty", status);
  }

  return (
    <>
      {activeDeputy ? (
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
          data-bs-target="#selectEmsFdModal"
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

              return values.includes("ems_fd");
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
  status: state.ems_fd.status,
  status2: state.ems_fd.status2,
  statuses: state.admin.codes,
  activeDeputy: state.ems_fd.activeDeputy,
});

const Memoized = React.memo(Statuses);

export default connect(mapToProps, { setEmsStatus, getCurrentEmsStatus })(Memoized);
