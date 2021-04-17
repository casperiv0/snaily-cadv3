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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const created = await createIncident({
      narrative,
      location,
      full_date: date,
      involved_officers: involvedOfficers.map((v: any) => v.value),
    });

    if (created === true) {
      modal(ModalIds.CreateTicket)?.hide();

      setNarrative("");
      setDate("");
      setLocation("");
      setNarrative("");
      setInvolvedOfficers([]);
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
              {lang.officers.select_officer}
            </label>

            <Select
              onChange={(v: any) => setInvolvedOfficers(v)}
              options={officers.map((officer) => ({
                label: `${officer.callsign} ${officer.officer_name} - ${officer.officer_dept}`,
                value: `${officer.callsign} ${officer.officer_name} - ${officer.officer_dept}`,
              }))}
            />
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
