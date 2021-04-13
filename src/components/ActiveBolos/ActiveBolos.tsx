import * as React from "react";
import { connect } from "react-redux";
import { Bolo } from "types/Bolo";
import { Nullable, State } from "types/State";
import lang from "../../language.json";
import { getBolos, deleteBolo } from "@actions/bolos/BoloActions";
import { SocketEvents } from "types/Socket";
import { useSocket } from "@hooks/useSocket";
import { Item, Span } from "@components/Item";
import { ModalIds } from "types/ModalIds";
import { EditBoloModal } from "@components/modals/leo/EditBoloModal";

interface Props {
  bolos: Bolo[];
  getBolos: () => void;
  deleteBolo: (id: string) => void;
}

const ActiveBolosC: React.FC<Props> = ({ bolos, getBolos, deleteBolo }) => {
  const socket = useSocket();
  const [tempBolo, setTempBolo] = React.useState<Nullable<Bolo>>(null);

  React.useEffect(() => {
    const handler = () => getBolos();
    socket?.on(SocketEvents.UpdateBolos, handler);

    return () => {
      socket?.off(SocketEvents.UpdateBolos, handler);
    };
  }, [getBolos, socket]);

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
                      {lang.bolos.edit_bolo}
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

export const ActiveBolos = connect(mapToProps, { getBolos, deleteBolo })(ActiveBolosC);
