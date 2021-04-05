import * as React from "react";
import { Link } from "react-router-dom";
import socket from "../../lib/socket";
import Officer from "../../interfaces/Officer";
import lang from "../../language.json";
import User from "../../interfaces/User";
import { adminRanks } from "../AuthRoute";
import { ModalIds } from "../../lib/types";

export interface MButton {
  name: string;
  target: ModalIds;
}

const modalButtons: MButton[] = [
  {
    name: lang.global.name_search,
    target: ModalIds.NameSearch,
  },
  {
    name: lang.global.plate_search,
    target: ModalIds.PlateSearch,
  },
  {
    name: lang.global.weapon_search,
    target: ModalIds.WeaponSearch,
  },
  {
    name: lang.global.create_written_warning,
    target: ModalIds.CreateWrittenWarning,
  },
  {
    name: lang.global.create_ticket,
    target: ModalIds.CreateTicket,
  },
  {
    name: lang.global.create_arrest_report,
    target: ModalIds.CreateArrestReport,
  },
  {
    name: lang.global.create_bolo,
    target: ModalIds.CreateBolo,
  },
  {
    name: lang.global.notepad,
    target: ModalIds.Notepad,
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
        <Link to="/admin/manage/units" className="btn btn-primary col-md-2">
          {window.lang.officers.manage_officers}
        </Link>
      ) : adminRanks.includes(`${user?.rank}`) ? (
        <Link to="/admin/manage/units" className="btn btn-secondary col-md-2">
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
            data-bs-target={`#${mButton.target}`}
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
