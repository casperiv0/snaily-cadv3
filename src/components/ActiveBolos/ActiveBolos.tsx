import * as React from "react";
import { Bolo } from "types/Bolo";
import { Nullable, State } from "types/State";
import lang from "../../language.json";
import { getBolos, deleteBolo } from "@actions/bolos/BoloActions";
import { connect } from "react-redux";
import { Officer } from "types/Officer";
import { SocketEvents } from "types/Socket";
import { useSocket } from "@hooks/useSocket";
import { Item, Span } from "@components/Item";

interface Props {
  bolos: Bolo[];
  activeOfficer: Nullable<Officer>;
  getBolos: () => void;
  deleteBolo: (id: string) => void;
}

const ActiveBolosC: React.FC<Props> = ({ bolos, activeOfficer, getBolos, deleteBolo }) => {
  const socket = useSocket();

  React.useEffect(() => {
    const handler = () => getBolos();
    socket?.on(SocketEvents.UpdateBolos, handler);

    return () => {
      socket?.off(SocketEvents.UpdateBolos, handler);
    };
  }, [getBolos, socket]);

  return (
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
                  <button
                    disabled={!activeOfficer}
                    className="btn btn-danger"
                    onClick={() => deleteBolo(bolo.id)}
                  >
                    {lang.bolos.remove_bolo}
                  </button>
                </div>
              </li>
            );
          })}
        </>
      )}
    </ul>
  );
};

const mapToProps = (state: State) => ({
  bolos: state.bolos.bolos,
  activeOfficer: state.officers.activeOfficer,
});

export const ActiveBolos = connect(mapToProps, { getBolos, deleteBolo })(ActiveBolosC);
