import * as React from "react";
import Bolo from "../../interfaces/Bolo";
import State from "../../interfaces/State";
import lang from "../../language.json";
import socket from "../../lib/socket";
import { getActiveBolos, deleteBolo } from "../../lib/actions/bolos";
import { connect } from "react-redux";

interface Props {
  bolos: Bolo[];
  getActiveBolos: () => void;
  deleteBolo: (id: string) => void;
}

const ActiveBolos: React.FC<Props> = ({ bolos, getActiveBolos, deleteBolo }) => {
  React.useEffect(() => {
    getActiveBolos();
  }, [getActiveBolos]);

  React.useEffect(() => {
    socket.on("UPDATE_BOLOS", () => {
      getActiveBolos();
    });
  }, [getActiveBolos]);

  return (
    <ul className="list-group mt-2 overflow-auto" style={{ maxHeight: "25rem" }}>
      <li className="list-group-item bg-secondary border-secondary">{lang.global.active_bolos}</li>

      {!bolos[0] ? (
        <li className="list-group-item bg-dark border-dark">{lang.global.no_bolos}</li>
      ) : (
        bolos.map((bolo: Bolo, idx: number) => {
          return (
            <li
              key={idx}
              id={`${idx}`}
              className="list-group-item bg-dark border-secondary d-flex justify-content-between"
            >
              <div className="d-flex">
                {++idx} | &nbsp;
                {bolo.type === "person" ? (
                  <p>
                    {bolo.description} <br />
                    <span className="font-weight-bold">{lang.global.name}: </span>
                    {bolo.name}
                  </p>
                ) : bolo.type === "vehicle" ? (
                  <p>
                    {bolo.description} <br />
                    <span className="font-weight-bold">{lang.global.plate}: </span>
                    {bolo.plate}
                    <br />
                    <span className="font-weight-bold">{lang.global.color}: </span>
                    {bolo.color}
                  </p>
                ) : (
                  <p>{bolo.description}</p>
                )}
              </div>
              <div>
                <button className="btn btn-danger" onClick={() => deleteBolo(bolo.id)}>
                  {lang.bolos.remove_bolo}
                </button>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};

const mapToProps = (state: State) => ({
  bolos: state.bolos.bolos,
});

export default connect(mapToProps, { getActiveBolos, deleteBolo })(ActiveBolos);
