import * as React from "react";
import lang from "../../language.json";
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
  return (
    <>
      {modalButtons.map((mButton: MButton, idx: number) => {
        return (
          <button
            id={`${idx}`}
            key={idx}
            className="btn btn-secondary bg-secondary col-md-2 mt-2 ms-1"
            data-bs-target={mButton.target}
            data-bs-toggle="modal"
          >
            {mButton.name}
          </button>
        );
      })}
    </>
  );
};

export default ModalButtons;
