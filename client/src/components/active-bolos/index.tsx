import * as React from "react";
import { connect } from "react-redux";
import Bolo from "../../interfaces/Bolo";
import State from "../../interfaces/State";
import lang from "../../language.json";
import socket from "../../lib/socket";
import { getActiveBolos, deleteBolo } from "../../lib/actions/bolos";
import { Item, Span } from "../../pages/citizen/citizen-info";
import { ModalIds, SOCKET_EVENTS } from "../../lib/types";
import EditBoloModal from "../modals/leo/EditBoloModal";

interface Props {
  bolos: Bolo[];
  getActiveBolos: () => void;
  deleteBolo: (id: string) => void;
}

const ActiveBolos: React.FC<Props> = ({ bolos, getActiveBolos, deleteBolo }) => {
  const [tempBolo, setTempBolo] = React.useState<Bolo | null>(null);

  React.useEffect(() => {
    getActiveBolos();
  }, [getActiveBolos]);

  React.useEffect(() => {
    const handler = () => getActiveBolos();
    socket.on(SOCKET_EVENTS.UPDATE_BOLOS, handler);

    return () => {
      socket.off(SOCKET_EVENTS.UPDATE_BOLOS, handler);
    };
  }, [getActiveBolos]);

  return (
    <>
      <ul className="list-group mt-2 overflow-auto" style={{ maxHeight: "25rem" }}>
        <li className="list-group-item bg-secondary border-secondary text-white">
          <h6>{lang.global.active_bolos}</h6>
        </li>

        {!bolos[0] ? (
          <li className="list-group-item bg-dark border-dark text-white">{lang.global.no_bolos}</li>
        ) : (
          <>
            {bolos.map((bolo, idx) => {
              return (
                <li
                  key={idx}
                  id={`${idx}`}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
                >
                  <div className="d-flex">
                    {++idx} | &nbsp;
                    {bolo.type === "person" ? (
                      <Item id="description">
                        {bolo.description} <br />
                        <Span>{lang.global.name}: </Span>
                        {bolo.name}
                      </Item>
                    ) : bolo.type === "vehicle" ? (
                      <p>
                        {bolo.description} <br />
                        <Span>{lang.global.plate}: </Span>
                        {bolo.plate}
                        <br />
                        <Span>{lang.global.color}: </Span>
                        {bolo.color}
                      </p>
                    ) : (
                      <p>{bolo.description}</p>
                    )}
                  </div>
                  <div>
                    <button className="btn btn-danger mx-1" onClick={() => deleteBolo(bolo.id)}>
                      {lang.bolos.remove_bolo}
                    </button>

                    <button
                      data-bs-target={`#${ModalIds.EditBolo}`}
                      data-bs-toggle="modal"
                      className="btn btn-primary"
                      onClick={() => setTempBolo(bolo)}
                    >
                      {window.lang.bolos.edit_bolo}
                    </button>
                  </div>
                </li>
              );
            })}
          </>
        )}

        <EditBoloModal bolo={tempBolo} />
      </ul>
    </>
  );
};

const mapToProps = (state: State) => ({
  bolos: state.bolos.bolos,
});

export default connect(mapToProps, { getActiveBolos, deleteBolo })(ActiveBolos);
