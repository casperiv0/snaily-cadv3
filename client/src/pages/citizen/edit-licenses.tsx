import * as React from "react";
import Layout from "../../components/Layout";
import Citizen from "../../interfaces/Citizen";
import Match from "../../interfaces/Match";
import State from "../../interfaces/State";
import lang from "../../language.json";
import Value from "../../interfaces/Value";
import Field from "../../interfaces/Field";
import { connect } from "react-redux";
import { getCitizenById, updateLicenses } from "../../lib/actions/citizen";
import { getLegalStatuses } from "../../lib/actions/values";
import { Link } from "react-router-dom";

interface Props {
  citizen: Citizen;
  match: Match;
  legalStatuses: Value[];
  getCitizenById: (id: string) => void;
  getLegalStatuses: () => void;
  updateLicenses: (id: string, data: object) => void;
}

const EditLicensesPage: React.FC<Props> = ({
  match,
  citizen,
  legalStatuses,
  getCitizenById,
  getLegalStatuses,
  updateLicenses,
}) => {
  const [dmv, setDmv] = React.useState("");
  const [fireArms, setFireArms] = React.useState("");
  const [pilot, setPilot] = React.useState("");
  const [ccw, setCcw] = React.useState("");

  const citizenId = match.params.id;

  const fields: Field[] = [
    {
      type: "text",
      id: "dmv",
      label: lang.citizen.drivers_license,
      onChange: (e) => setDmv(e.target.value),
      value: dmv,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.dmv,
    },
    {
      type: "text",
      id: "firearms_license",
      label: lang.citizen.firearms_license,
      onChange: (e) => setFireArms(e.target.value),
      value: fireArms,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.fire_license,
    },
    {
      type: "text",
      id: "pilot_license",
      label: lang.citizen.pilot_license,
      onChange: (e) => setPilot(e.target.value),
      value: pilot,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.dmv,
    },
    {
      type: "text",
      id: "ccw",
      label: lang.citizen.ccw,
      onChange: (e) => setCcw(e.target.value),
      value: ccw,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.dmv,
    },
  ];

  React.useEffect(() => {
    getCitizenById(citizenId);
    getLegalStatuses();
  }, [getCitizenById, getLegalStatuses, citizenId]);

  React.useEffect(() => {
    if (citizen !== null) {
      setDmv(citizen?.dmv);
      setFireArms(citizen?.fire_license);
      setPilot(citizen?.pilot_license);
      setCcw(citizen?.ccw);
      return;
    }
  }, [citizen]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateLicenses(citizenId, {
      dmv,
      fire_license: fireArms,
      pilot_license: pilot,
      ccw,
    });
  }

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        {fields.map((field: Field, idx: number) => {
          return (
            <div key={idx} id={`${idx}`} className="mb-3">
              <label className="form-label" htmlFor={field.id}>
                {field.label}
              </label>
              <select
                id="dmv"
                value={field.value}
                className="form-control bg-dark border-dark text-light"
                onChange={field.onChange}
              >
                <option value={field.selectLabel}>{field.selectLabel}</option>
                <option disabled value="">
                  --------
                </option>
                {legalStatuses.map((item: Value, idx: number) => {
                  return (
                    <option key={idx} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}

        <div className="mb-3 float-end">
          <Link className="btn btn-danger" to={`/citizen/${citizenId}`}>
            {lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary ms-2">
            {lang.global.update}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  citizen: state.citizen.citizen,
  legalStatuses: state.values["legal-statuses"],
});

export default connect(mapToProps, {
  getCitizenById,
  getLegalStatuses,
  updateLicenses,
})(EditLicensesPage);
