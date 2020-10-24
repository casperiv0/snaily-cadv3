import * as React from "react";
import Citizen from "../../interfaces/Citizen";
import lang from "../../language.json";
import { Item, Span } from "../../pages/citizen/citizen-info";

interface Props {
  citizen: Citizen;
}

export const LicenseCard: React.FC<Props> = ({ citizen }) => {
  return (
    <div className="card bg-dark border-dark mt-3">
      <div className="card-header d-flex justify-content-between">
        <h3>{lang.citizen.licenses}</h3>

        <div>
          <a className="btn btn-primary" href={`/licenses/edit/${citizen.id}`}>
            {lang.citizen.license.edit}
          </a>
        </div>
      </div>

      <div className="card-body">
        <Item id="dmv">
          <Span>{lang.citizen.license.dmv} </Span>
          {citizen.dmv}
        </Item>
        <Item id="fire_license">
          <Span>{lang.citizen.license.firearms} </Span>
          {citizen.fire_license}
        </Item>
        <Item id="pilot_license">
          <Span>{lang.citizen.license.pilot} </Span>
          {citizen.pilot_license}
        </Item>
        <Item id="ccw">
          <Span>{lang.citizen.license.ccw} </Span>
          {citizen.ccw}
        </Item>
      </div>
    </div>
  );
};

export default LicenseCard;
