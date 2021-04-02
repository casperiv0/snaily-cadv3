import * as React from "react";
import { Link } from "react-router-dom";
import Modal from "../index";
import lang from "../../../language.json";
import Officer from "../../../interfaces/Officer";
import State from "../../../interfaces/State";
import { connect } from "react-redux";
import { getMyOfficers, setStatus } from "../../../lib/actions/officer";
import Select, { Value } from "../../select";
import { modal, notify } from "../../../lib/functions";
import { ModalIds } from "../../../lib/types";

interface Props {
  officers: Officer[];
  getMyOfficers: () => void;
  setStatus: (id: string, status: "on-duty" | "off-duty", status2: string) => void;
}

const SelectOfficerModal: React.FC<Props> = ({ officers, getMyOfficers, setStatus }) => {
  const [selected, setSelected] = React.useState<Value | null>(null);

  React.useEffect(() => {
    getMyOfficers();
  }, [getMyOfficers]);

  function closeModal() {
    modal(ModalIds.SelectOfficer).hide();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected?.value) {
      return notify(window.lang.officers.select_officer).warn();
    }

    setStatus(selected?.value, "on-duty", "10-8");

    closeModal();
  }

  return (
    <Modal title={lang.officers.select_officer_msg} id={ModalIds.SelectOfficer}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="officer">
              {lang.officers.select_officer}
            </label>

            {!officers[0] ? (
              <p className="font-weight-bold">
                You do not have any officers!{" "}
                <Link onClick={closeModal} to="/leo/officers/create">
                  Create one here
                </Link>
              </p>
            ) : (
              <Select
                isMulti={false}
                value={selected}
                onChange={(v) => setSelected(v)}
                options={officers.map((officer) => ({
                  label: `${officer.callsign} ${officer.officer_name} - ${officer.officer_dept}`,
                  value: officer.id,
                }))}
              />
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={!officers[0]} type="submit" className="btn btn-primary">
            {lang.global.go_on_duty}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
});

export default connect(mapToProps, { getMyOfficers, setStatus })(SelectOfficerModal);
