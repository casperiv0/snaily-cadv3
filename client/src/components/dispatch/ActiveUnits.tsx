import * as React from "react";
import Officer from "../../interfaces/Officer";
import Deputy from "../../interfaces/Deputy";
import State from "../../interfaces/State";
import lang from "../../language.json";
import socket from "../../lib/socket";
import UpdateStatusModal from "../modals/dispatch/UpdateStatus";
import { connect } from "react-redux";
import { getActiveUnits } from "../../lib/actions/dispatch";

interface Props {
  officers: Officer[];
  ems_fd: Deputy[];
  getActiveUnits: () => void;
}

const ActiveUnits: React.FC<Props> = ({ officers, ems_fd, getActiveUnits }) => {
  React.useEffect(() => {
    getActiveUnits();
  }, [getActiveUnits]);

  React.useEffect(() => {
    socket.on("UPDATE_ACTIVE_UNITS", () => getActiveUnits());
  }, [getActiveUnits]);

  return (
    <>
      {/* Active officers */}
      <div className="list-group overflow-auto" style={{ maxHeight: "25rem" }}>
        <li className="list-group-item bg-secondary border-secondary sticky-top">
          <h5>{lang.global.active_officers}</h5>
        </li>

        {!officers[0] ? (
          <li className="list-group-item bg-dark border-dark mb-3">
            {lang.global.no_officers}
          </li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{lang.dispatch.officer_name}</th>
                <th scope="col">{lang.dispatch.officer_dept}</th>
                <th scope="col">{lang.dispatch.status}</th>
                <th scope="col">{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((officer: Officer, idx: number) => {
                return (
                  <tr key={idx} id={`${idx}`}>
                    <th scope="row">{++idx}</th>
                    <td>{officer.officer_name}</td>
                    <td>{officer.officer_dept}</td>
                    <td>{officer.status2}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target={"#updateStatus" + officer.id}
                      >
                        {lang.dispatch.edit_status}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Active EMS/FD */}
      <div
        className="list-group overflow-auto mt-3"
        style={{ maxHeight: "25rem" }}
      >
        <li className="list-group-item bg-secondary border-secondary sticky-top">
          <h5>{lang.global.active_ems_fd}</h5>
        </li>

        {!ems_fd[0] ? (
          <li className="list-group-item bg-dark border-dark mb-3">
            {lang.global.no_ems_fd}
          </li>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{lang.dispatch.dept_name}</th>
                <th scope="col">{lang.dispatch.status}</th>
                <th scope="col">{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {ems_fd.map((deputy: Deputy, idx: number) => {
                return (
                  <tr key={idx} id={`${idx}`}>
                    <th scope="row">{++idx}</th>
                    <td>{deputy.name}</td>
                    <td>{deputy.status2}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-toggle="modal"
                        data-target={"#updateStatus" + deputy.id}
                      >
                        {lang.dispatch.edit_status}
                      </button>
                    </td>
                    {/* <EditEmsFdStatusModal
                        id={ems_fd.id}
                        status={ems_fd.status}
                        status2={ems_fd.status2}
                      /> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* modals */}
      {officers.map((officer: Officer, idx: number) => {
        return (
          <UpdateStatusModal
          type="officers"
            key={idx}
            id={officer.id}
            status={officer.status}
            status2={officer.status2}
          />
        );
      })}
      {ems_fd.map((deputy: Deputy, idx: number) => {
        return (
          <UpdateStatusModal
            type="ems-fd"
            key={idx}
            id={deputy.id}
            status={deputy.status}
            status2={deputy.status2}
          />
        );
      })}
    </>
  );
};

const mapToProps = (state: State) => ({
  officers: state.dispatch.officers,
  ems_fd: state.dispatch.ems_fd,
});

export default connect(mapToProps, { getActiveUnits })(ActiveUnits);
