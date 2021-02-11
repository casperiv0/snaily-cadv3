import * as React from "react";
import lang from "../../language.json";
import socket from "../../lib/socket";
import { MButton } from "../leo/ModalButtons";

const modalButtons: MButton[] = [
  {
    name: lang.global.name_search,
    target: "#nameSearchModal",
  },
  {
    name: lang.global.plate_search,
    target: "#plateSearchModal",
  },
  {
    name: lang.global.weapon_search,
    target: "#weaponSearchModal",
  },
  {
    name: lang.global.address_search,
    target: "#addressSearchModal",
  },
  {
    name: lang.global.create_bolo,
    target: "#createBoloModal",
  },
  {
    name: lang.global.create_911_call,
    target: "#call911Modal",
  },
  {
    name: lang.global.notepad,
    target: "#notepad",
  },
];

const ModalButtons: React.FC = () => {
  function signal100() {
    socket.emit("SIGNAL_100");
  }

  return (
    <>
      {/* <Link to="/dispatch/map" className="btn btn-primary col-md-2 mt-2 ms-1">
        Live map
      </Link> */}
      {modalButtons.map((mButton: MButton, idx: number) => {
        return (
          <button
            id={`${idx}`}
            key={idx}
            className="btn btn-secondary col-md-2"
            data-bs-target={mButton.target}
            data-bs-toggle="modal"
          >
            {mButton.name}
          </button>
        );
      })}
      <button onClick={signal100} className="btn btn-danger col-md-2">
        Signal 100
      </button>
    </>
  );
};

export default ModalButtons;
