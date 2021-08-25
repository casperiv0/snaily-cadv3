import * as React from "react";
import J from "jquery";
import { connect } from "react-redux";
import { getActiveUnits } from "actions/dispatch/DispatchActions";
import { State } from "types/State";
import { socket } from "hooks/useSocket";
import { Officer } from "types/Officer";
import { Deputy } from "types/Deputy";
import { UpdateStatusModal } from "../modals/dispatch/UpdateStatus";
import { ModalIds } from "types/ModalIds";
import { SocketEvents } from "types/Socket";
import lang from "src/language.json";

interface Props {
  officers: Officer[];
  ems_fd: Deputy[];
  getActiveUnits: () => void;
}

const ActiveUnitsMap: React.FC<Props> = ({ ems_fd, officers, getActiveUnits }) => {
  const [tempUnit, setTempUnit] = React.useState<any>(null);

  React.useEffect(() => {
    getActiveUnits();
  }, [getActiveUnits]);

  React.useEffect(() => {
    const handler = () => getActiveUnits();
    socket.on(SocketEvents.UpdateActiveUnits, handler);

    return () => {
      socket.off(SocketEvents.UpdateActiveUnits, handler);
    };
  }, [getActiveUnits]);

  function updateZIndex(unit: any) {
    J("#modal-portal").css("z-index", 999);

    setTempUnit(unit);
  }

  return (
    <div className="map-calls-container active-units">
      <h1 className="h4">{lang.dispatch.active_units}</h1>

      {[...ems_fd, ...officers].length <= 0 ? lang.dispatch.no_units : null}

      {[...ems_fd, ...officers].map((value) => {
        return (
          <div key={value.id} title="Click to expand" className="p-2">
            <div className="d-flex justify-content-between">
              <div>
                {"officer_name" in value ? (
                  <>
                    <strong>{lang.dispatch.leo}: </strong>
                    {value.callsign} {value.officer_name}
                  </>
                ) : (
                  <>
                    <strong>{lang.dispatch.ems_fd}: </strong>
                    {value.name}
                  </>
                )}{" "}
                | {value.status2}
              </div>
              <button
                data-bs-toggle="modal"
                data-bs-target={`#${ModalIds.UpdateStatus}`}
                className="active-units-edit"
                onClick={() => updateZIndex(value)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-pencil-square"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path
                    fillRule="evenodd"
                    d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      <UpdateStatusModal
        type={tempUnit && "officer_name" in tempUnit ? "officers" : "ems-fd"}
        data={tempUnit}
      />
    </div>
  );
};

const mapToProps = (state: State) => ({
  officers: state.dispatch.officers,
  ems_fd: state.dispatch.ems_fd,
});

const Memoized = React.memo(ActiveUnitsMap);

export const ActiveMapUnits = connect(mapToProps, { getActiveUnits })(Memoized);
