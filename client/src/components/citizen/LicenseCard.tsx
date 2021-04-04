import * as React from "react";
import Citizen from "../../interfaces/Citizen";
import lang from "../../language.json";
import { ModalIds } from "../../lib/types";
import { Item, Span } from "../../pages/citizen/citizen-info";

interface Props {
  citizen: Citizen;
}

const LicenseCard: React.FC<Props> = ({ citizen }) => {
  const isSuspended = React.useCallback(
    (type: string) => {
      // @ts-expect-error ignore line below
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
          {isSuspended("dmv") ? window.lang.officers.suspended : citizen.dmv}
        </Item>
        <Item id="fire_license">
          <Span>{lang.citizen.license.firearms}: </Span>
          {isSuspended("fire_license") ? window.lang.officers.suspended : citizen.fire_license}
        </Item>
        <Item id="pilot_license">
          <Span>{lang.citizen.license.pilot}: </Span>
          {isSuspended("pilot_license") ? window.lang.officers.suspended : citizen.pilot_license}
        </Item>
        <Item id="ccw">
          <Span>{lang.citizen.license.ccw}: </Span>
          {isSuspended("ccw") ? window.lang.officers.suspended : citizen.ccw}
        </Item>
      </div>
    </div>
  );
};

export default LicenseCard;
