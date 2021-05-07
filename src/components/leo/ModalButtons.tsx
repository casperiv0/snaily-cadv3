import * as React from "react";
import { socket } from "@hooks/useSocket";
import { Officer } from "types/Officer";
import lang from "src/language.json";
import { User } from "types/User";
import { SocketEvents } from "types/Socket";
import { ModalIds } from "types/ModalIds";
import Link from "next/link";
import { RanksArr } from "@lib/consts";
import { Nullable } from "types/State";

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
  activeOfficer: Nullable<Officer>;
  user: Nullable<User>;
}

export const ModalButtons: React.FC<Props> = ({ user, activeOfficer }) => {
  function panicButton() {
    socket.emit(SocketEvents.PanicButton, activeOfficer);
  }

  return (
    <>
      {activeOfficer ? (
        <h5 style={{ marginLeft: "-10px" }}>
          {lang.global.currently_active_as}{" "}
          {`${activeOfficer?.callsign} ${activeOfficer?.officer_name}`}
        </h5>
      ) : null}
      <Link href="/leo/my-officers">
        <a className="btn btn-primary col-md-2">{lang.officers.my_officers}</a>
      </Link>
      {user?.supervisor === "1" ? (
        <Link href="/admin/manage/units">
          <a className="btn btn-primary col-md-2">{lang.officers.manage_officers}</a>
        </Link>
      ) : RanksArr.includes(`${user?.rank}`) ? (
        <Link href="/admin/manage/units">
          <a className="btn btn-secondary col-md-2">{lang.officers.manage_officers}</a>
        </Link>
      ) : null}

      <Link href="/leo/incidents">
        <a className={`btn btn-secondary col-md-2 ${!activeOfficer ? "disabled" : ""}`}>
          {lang.officers.incidents}
        </a>
      </Link>

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
      <Link href="/leo/penal-codes">
        <a className="btn btn-secondary col-md-2">{lang.global.penal_codes}</a>
      </Link>
      <button onClick={panicButton} disabled={!activeOfficer} className="btn btn-danger col-md-2">
        {lang.dispatch.panic_button}
      </button>
    </>
  );
};
