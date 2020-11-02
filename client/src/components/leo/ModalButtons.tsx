import * as React from "react";
import lang from "../../language.json";

export interface MButton {
  name: string;
  target: string;
}

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
    name: lang.global.create_written_warning,
    target: "#createWrittenWarningModal",
  },
  {
    name: lang.global.create_ticket,
    target: "#createTicketModal",
  },
  {
    name: lang.global.create_arrest_report,
    target: "#createArrestReportModal",
  },
  {
    name: lang.global.create_bolo,
    target: "#createBoloModal",
  },
  {
    name: lang.global.notepad,
    target: "#notepad",
  },
];

const ModalButtons: React.FC = () => {
  return (
    <>
      <a className="btn btn-primary col-md-2 mt-2 ml-1" href="/leo/my-officers">
        {lang.officers.my_officers}
      </a>

      {/* modals */}
      {modalButtons.map((mButton: MButton, idx: number) => {
        return (
          <button
            id={mButton.name}
            key={idx}
            className="btn btn-secondary bg-secondary col-md-2 mt-2 ml-1"
            data-target={mButton.target}
            data-toggle="modal"
          >
            {mButton.name}
          </button>
        );
      })}

      {/* other links */}
      <a className="btn btn-secondary col-md-2 mt-2 ml-1" href="/leo/penal-codes">
        {lang.global.penal_codes}
      </a>
    </>
  );
};

export default ModalButtons;
