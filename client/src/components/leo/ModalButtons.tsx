import * as React from "react";
import { Link } from "react-router-dom";
import socket from "../../lib/socket";
import Officer from "../../interfaces/Officer";
import lang from "../../language.json";
import User from "../../interfaces/User";
import { adminRanks } from "../AuthRoute";

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

interface Props {
  activeOfficer: Officer | null;
  user: User | null;
}

const ModalButtons: React.FC<Props> = ({ user, activeOfficer }) => {
  function panicButton() {
    socket.emit("PANIC_BUTTON", activeOfficer);
  }

  return (
    <>
      {activeOfficer ? (
        <h5 style={{ marginLeft: "-10px" }}>
          {window.lang.global.currently_active_as}{" "}
          {`${activeOfficer?.callsign} ${activeOfficer?.officer_name}`}
        </h5>
      ) : null}
      <Link to="/leo/my-officers" className="btn btn-primary col-md-2">
        {lang.officers.my_officers}
      </Link>
      {user?.supervisor === "1" ? (
        <Link to="/admin/manage/officers" className="btn btn-primary col-md-2">
          {window.lang.officers.manage_officers}
        </Link>
      ) : adminRanks.includes(`${user?.rank}`) ? (
        <Link to="/admin/manage/officers" className="btn btn-secondary col-md-2">
          {window.lang.officers.manage_officers}
        </Link>
      ) : null}

      {/* modals */}
      {modalButtons.map((mButton: MButton, idx: number) => {
        return (
          <button
            id={mButton.name}
            key={idx}
            className="btn btn-secondary col-md-2"
            data-bs-target={mButton.target}
            data-bs-toggle="modal"
            disabled={!activeOfficer}
            title={!activeOfficer ? "Go on-duty before continuing" : mButton.name}
          >
            {mButton.name}
          </button>
        );
      })}

      {/* other links */}
      <Link className="btn btn-secondary col-md-2" to="/leo/penal-codes">
        {lang.global.penal_codes}
      </Link>
      <button onClick={panicButton} disabled={!activeOfficer} className="btn btn-danger col-md-2">
        {window.lang.dispatch.panic_button}
      </button>
    </>
  );
};

export default ModalButtons;
