import * as React from "react";
import { connect } from "react-redux";
import { Officer } from "types/Officer";
import { Deputy } from "types/Deputy";
import { State } from "types/State";
import lang from "src/language.json";
import { UpdateStatusModal } from "@components/modals/dispatch/UpdateStatus";
import { getActiveUnits } from "@actions/dispatch/DispatchActions";
import { ModalIds } from "types/ModalIds";
import { SocketEvents } from "types/Socket";
import { socket } from "@hooks/useSocket";

interface Props {
  officers: Officer[];
  ems_fd: Deputy[];
  getActiveUnits: () => void;
}

const ActiveUnitsC: React.FC<Props> = ({ officers, ems_fd, getActiveUnits }) => {
  const [tempUnit, setTempUnit] = React.useState<any>(null);

  React.useEffect(() => {
    const handler = () => getActiveUnits();

    socket.on(SocketEvents.UpdateActiveUnits, handler);

    return () => {
      socket.off(SocketEvents.UpdateActiveUnits, handler);
    };
  }, [getActiveUnits]);

  return (
    <>
      {/* Active officers */}
      <ul className="list-group overflow-auto" style={{ maxHeight: "25rem" }}>
        <li className="list-group-item bg-secondary border-secondary sticky-top text-white">
          <h5>{lang.global.active_officers}</h5>
        </li>

        {!officers[0] ? (
          <li className="list-group-item bg-dark border-dark mb-3 text-white">
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
                    <td>{`${officer.callsign} ${officer.officer_name}`}</td>
                    <td>{officer.officer_dept}</td>
                    <td>{officer.status2}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target={`#${ModalIds.UpdateStatus}`}
                        onClick={() => setTempUnit(officer)}
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
      </ul>

      {/* Active EMS/FD */}
      <ul className="list-group overflow-auto mt-0" style={{ maxHeight: "25rem" }}>
        <li className="list-group-item bg-secondary border-secondary sticky-top text-white">
          <h6>{lang.global.active_ems_fd}</h6>
        </li>

        {!ems_fd[0] ? (
          <li className="list-group-item bg-dark border-dark mb-3 text-white">
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
                    <td>{`${deputy.callsign} ${deputy.name}`}</td>
                    <td>{deputy.status2}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target={`#${ModalIds.UpdateStatus}`}
                        onClick={() => setTempUnit(deputy)}
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
      </ul>

      <UpdateStatusModal
        type={tempUnit && "officer_name" in tempUnit ? "officers" : "ems-fd"}
        data={tempUnit}
      />
    </>
  );
};

const mapToProps = (state: State) => ({
  officers: state.dispatch.officers,
  ems_fd: state.dispatch.ems_fd,
});

const Memoized = React.memo(ActiveUnitsC);

export const ActiveUnits = connect(mapToProps, { getActiveUnits })(Memoized);
