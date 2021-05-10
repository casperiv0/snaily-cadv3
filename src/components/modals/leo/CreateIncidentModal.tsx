import * as React from "react";
import { State } from "types/State";
import lang from "../../../language.json";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { createIncident } from "@actions/officer/OfficerActions";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";
import { OfficerIncident } from "types/OfficerIncident";
import { Officer } from "types/Officer";
import { Select } from "@components/Select/Select";

interface Props {
  officers: Officer[];
  createIncident: (data: Partial<OfficerIncident>) => Promise<boolean>;
}

const CreateIncidentModalC: React.FC<Props> = ({ createIncident, officers }) => {
  const [date, setDate] = React.useState<string>("");
  const [location, setLocation] = React.useState("");
  const [narrative, setNarrative] = React.useState("");
  const [involvedOfficers, setInvolvedOfficers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [arrestsMade, setArrestsMade] = React.useState(false);
  const [injuries, setInjuries] = React.useState(false);
  const [firearms, setFireArms] = React.useState(false);
  const [gsr, setGsr] = React.useState(false);
  const [gangAffiliation, setGangAffiliation] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const created = await createIncident({
      narrative,
      location,
      full_date: date,
      involved_officers: involvedOfficers.map((v: any) => v.value),
      arrests_made: arrestsMade === true ? "1" : "0",
      injuries: injuries === true ? "1" : "0",
      firearms_involved: firearms === true ? "1" : "0",
      gsr: gsr === true ? "1" : "0",
      gang_affiliation: gangAffiliation === true ? "1" : "0",
    });

    if (created === true) {
      modal(ModalIds.CreateIncident)?.hide();

      setNarrative("");
      setDate("");
      setLocation("");
      setNarrative("");
      setInvolvedOfficers([]);
      setArrestsMade(false);
      setInjuries(false);
      setFireArms(false);
      setGsr(false);
    }

    setLoading(false);
  }

  return (
    <Modal title={lang.officers.create_incident} size="lg" id={ModalIds.CreateIncident}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="ticket_name">
              {lang.global.enter_date}
            </label>

            <input
              onChange={(e) => setDate(e.target.value)}
              value={date}
              className="form-control bg-secondary border-secondary text-light"
              type="date"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="ticket_name">
              {lang.global.description}
            </label>

            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="location">
              {lang.global.location}
            </label>
            <input
              className="form-control bg-secondary border-secondary text-light"
              type="text"
              id="location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="location">
              {lang.officers.involved_officers}
            </label>

            <Select
              closeMenuOnSelect={false}
              onChange={(v: any) => setInvolvedOfficers(v)}
              options={officers.map((officer) => ({
                label: `${officer.callsign} ${officer.officer_name} - ${officer.officer_dept}`,
                value: `${officer.callsign} ${officer.officer_name} - ${officer.officer_dept}`,
              }))}
            />
          </div>

          <div className="form-check">
            <input
              checked={arrestsMade}
              onChange={() => setArrestsMade((v) => !v)}
              className="form-check-input"
              type="checkbox"
              id="arrests_made"
            />
            <label className="form-check-label" htmlFor="arrests_made">
              {lang.officers.arrests_made}
            </label>
          </div>

          <div className="form-check">
            <input
              checked={injuries}
              onChange={() => setInjuries((v) => !v)}
              className="form-check-input"
              type="checkbox"
              id="injuries"
            />
            <label className="form-check-label" htmlFor="injuries">
              {lang.officers.injuries_fatalities}
            </label>
          </div>

          <div className="form-check">
            <input
              checked={firearms}
              onChange={() => setFireArms((v) => !v)}
              className="form-check-input"
              type="checkbox"
              id="firearms_involved"
            />
            <label className="form-check-label" htmlFor="firearms_involved">
              {lang.officers.firearms_involved}
            </label>
          </div>

          <div className="form-check">
            <input
              checked={gangAffiliation}
              onChange={() => setGangAffiliation((v) => !v)}
              className="form-check-input"
              type="checkbox"
              id="gang_affiliation"
            />
            <label className="form-check-label" htmlFor="gang_affiliation">
              {lang.officers.gang_affiliation}
            </label>
          </div>

          <div className="form-check">
            <input
              checked={gsr}
              onChange={() => setGsr((v) => !v)}
              className="form-check-input"
              type="checkbox"
              id="gsr"
            />
            <label className="form-check-label" htmlFor="gsr">
              {lang.officers.gsr}
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.officers.create_incident}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
});

export const CreateIncidentModal = connect(mapToProps, { createIncident })(CreateIncidentModalC);
