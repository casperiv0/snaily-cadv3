import * as React from "react";
import State from "../../../interfaces/State";
import Department from "../../../interfaces/Department";
import { connect } from "react-redux";
import { createOfficer, getDepartments } from "../../../lib/actions/officer";
import Select, { Value } from "../../../components/select";
import { modal } from "../../../lib/functions";
import { ModalIds } from "../../../lib/types";
import Modal from "..";

interface Props {
  departments: Department[];
  createOfficer: (data: object) => Promise<boolean>;
  getDepartments: (type: "admin" | "leo") => void;
}

const CreateOfficerModal: React.FC<Props> = ({ departments, createOfficer, getDepartments }) => {
  const [officerName, setOfficerName] = React.useState<string>("");
  const [officerDept, setOfficerDept] = React.useState<Value | null>(null);
  const [callSign, setCallSign] = React.useState<string>("");

  React.useEffect(() => {
    getDepartments("leo");
  }, [getDepartments]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await createOfficer({
      name: officerName,
      department: officerDept?.value,
      callsign: callSign,
    });

    if (created === true) {
      modal(ModalIds.CreateOfficer).hide();
    }
  }

  return (
    <Modal size="lg" title={window.lang.officers.create_officer} id={ModalIds.CreateOfficer}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="officerName">
              {window.lang.officers.callsign}
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
              {window.lang.record.officer_name}
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
              {window.lang.officers.select_department}
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
            {window.lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {window.lang.officers.create_officer}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  departments: state.officers.departments,
});

export default connect(mapToProps, { createOfficer, getDepartments })(CreateOfficerModal);
