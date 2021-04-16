import * as React from "react";
import { connect } from "react-redux";
import { State } from "types/State";
import { Department } from "types/Department";
import { createOfficer } from "@actions/officer/OfficerActions";
import { Select, SelectValue } from "@components/Select/Select";
import { modal } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { Modal } from "@components/Modal/Modal";
import lang from "src/language.json";

interface Props {
  departments: Department[];
  createOfficer: (data: Record<string, unknown>) => Promise<boolean>;
}

const CreateOfficerModalC: React.FC<Props> = ({ departments, createOfficer }) => {
  const [officerName, setOfficerName] = React.useState<string>("");
  const [officerDept, setOfficerDept] = React.useState<SelectValue | null>(null);
  const [callSign, setCallSign] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const created = await createOfficer({
      name: officerName,
      department: officerDept?.value,
      callsign: callSign,
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
});

export const CreateOfficerModal = connect(mapToProps, {
  createOfficer,
})(CreateOfficerModalC);
