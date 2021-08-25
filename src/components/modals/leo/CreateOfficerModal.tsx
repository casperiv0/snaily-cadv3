import * as React from "react";
import { connect } from "react-redux";
import { Nullable, State } from "types/State";
import { Department } from "types/Department";
import { createOfficer } from "actions/officer/OfficerActions";
import { Select, SelectValue } from "components/Select/Select";
import { modal } from "lib/utils";
import { ModalIds } from "types/ModalIds";
import { Modal } from "components/Modal/Modal";
import lang from "src/language.json";
import { getUserCitizens } from "actions/citizen/CitizenActions";
import { Citizen } from "types/Citizen";

interface Props {
  departments: Department[];
  citizens: Citizen[];
  createOfficer: (data: Record<string, unknown>) => Promise<boolean>;
  getUserCitizens: () => void;
}

const CreateOfficerModalC: React.FC<Props> = ({
  citizens,
  departments,
  createOfficer,
  getUserCitizens,
}) => {
  const [officerName, setOfficerName] = React.useState<string>("");
  const [officerDept, setOfficerDept] = React.useState<Nullable<SelectValue>>(null);
  const [callSign, setCallSign] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [showLinked, setLinked] = React.useState(false);
  const [citizenId, setCitizenId] = React.useState<Nullable<SelectValue>>(null);

  React.useEffect(() => {
    getUserCitizens();
  }, [getUserCitizens]);

  React.useEffect(() => {
    if (showLinked === false) {
      setCitizenId(null);
    }
  }, [showLinked]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const created = await createOfficer({
      name: officerName,
      department: officerDept?.value,
      callsign: callSign,
      citizen_id: citizenId?.value,
    });

    if (created === true) {
      setOfficerDept(null);
      setOfficerName("");
      setCallSign("");

      modal(ModalIds.CreateOfficer)?.hide();
    }

    setLoading(false);
  }

  return (
    <Modal size="lg" title={lang.officers.create_officer} id={ModalIds.CreateOfficer}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="officerName">
              {lang.officers.callsign}
            </label>
            <input
              className="form-control bg-secondary border-secondary text-light"
              type="text"
              id="callsign"
              value={callSign}
              onChange={(e) => setCallSign(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="officerName">
              {lang.record.officer_name}
            </label>
            <input
              className="form-control bg-secondary border-secondary text-light"
              type="text"
              id="officerName"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="officerDept">
              {lang.officers.select_department}
            </label>

            <Select
              isClearable={false}
              value={officerDept}
              isMulti={false}
              onChange={(v) => setOfficerDept(v)}
              options={departments.map((dep) => ({ value: dep.name, label: dep.name }))}
            />
          </div>
          <div className="mb-3">
            <div className="form-check">
              <input
                checked={showLinked}
                onChange={() => setLinked((v) => !v)}
                className="form-check-input"
                type="checkbox"
                id="injuries"
              />
              <label className="form-check-label" htmlFor="injuries">
                {lang.officers.officer_linked_to_citizen}
              </label>
            </div>

            {showLinked === true ? (
              <div>
                <label className="form-label">{lang.citizen.company.select_cit}</label>

                <Select
                  isClearable={false}
                  value={citizenId}
                  isMulti={false}
                  onChange={(v) => setCitizenId(v)}
                  options={citizens.map((citizen) => ({
                    value: citizen.id,
                    label: citizen.full_name,
                  }))}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.officers.create_officer}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  departments: state.values.departments,
  citizens: state.citizen.citizens,
});

export const CreateOfficerModal = connect(mapToProps, {
  createOfficer,
  getUserCitizens,
})(CreateOfficerModalC);
