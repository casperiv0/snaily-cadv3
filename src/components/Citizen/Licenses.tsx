import * as React from "react";
import { Citizen } from "types/Citizen";
import lang from "../../language.json";
import { ModalIds } from "types/ModalIds";
import { Item, Span } from "@components/Item";

interface Props {
  citizen: Citizen;
}

export const LicenseCard: React.FC<Props> = ({ citizen }) => {
  const isSuspended = React.useCallback(
    (type: string) => {
      return citizen?.[type] === "1";
    },
    [citizen],
  );

  return (
    <div className="card bg-dark border-dark mt-1">
      <div className="card-header d-flex justify-content-between">
        <h1 className="h4">{lang.citizen.licenses}</h1>

        <div>
          <button
            className="btn btn-primary"
            data-bs-target={`#${ModalIds.EditLicenses}`}
            data-bs-toggle="modal"
          >
            {lang.citizen.license.edit}
          </button>
        </div>
      </div>

      <div className="card-body">
        <Item id="dmv">
          <Span>{lang.citizen.license.dmv}: </Span>
          {isSuspended("dmv") ? lang.officers.suspended : citizen.dmv}
        </Item>
        <Item id="fire_license">
          <Span>{lang.citizen.license.firearms}: </Span>
          {isSuspended("fire_license") ? lang.officers.suspended : citizen.fire_license}
        </Item>
        <Item id="pilot_license">
          <Span>{lang.citizen.license.pilot}: </Span>
          {isSuspended("pilot_license") ? lang.officers.suspended : citizen.pilot_license}
        </Item>
        <Item id="ccw">
          <Span>{lang.citizen.license.ccw}: </Span>
          {isSuspended("ccw") ? lang.officers.suspended : citizen.ccw}
        </Item>
        <Item id="cdl">
          <Span>{lang.citizen.cdl_license}: </Span>
          {isSuspended("cdl_license") ? lang.officers.suspended : citizen.cdl_license}
        </Item>
      </div>
    </div>
  );
};
