import * as React from "react";
import Modal from "../index";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import { connect } from "react-redux";
import { getMyDeputies, setEmsStatus } from "../../../lib/actions/ems-fd";
import Deputy from "../../../interfaces/Deputy";
import Select, { Value } from "../../select";
import { modal, notify } from "../../../lib/functions";
import { ModalIds } from "../../../lib/types";

interface Props {
  deputies: Deputy[];
  getMyDeputies: () => void;
  setEmsStatus: (id: string, status: "on-duty" | "off-duty", status2: string) => void;
}

const SelectOfficerModal: React.FC<Props> = ({ deputies, getMyDeputies, setEmsStatus }) => {
  const [selected, setSelected] = React.useState<Value | null>(null);

  React.useEffect(() => {
    getMyDeputies();
  }, [getMyDeputies]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected?.value) {
      return notify.warn("Must select an EMS/FD member before continuing");
    }

    setEmsStatus(selected?.value, "on-duty", "10-8");
    modal(ModalIds.SelectEmsFd).hide();
  }

  return (
    <Modal title={lang.ems_fd.select_dept} id={ModalIds.SelectEmsFd}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="deputy">
              {lang.ems_fd.select_dept_2}
            </label>

            {!deputies[0] ? (
              <p className="font-weight-bold">{window.lang.ems_fd.no_dept}</p>
            ) : (
              <Select
                isMulti={false}
                onChange={(v) => setSelected(v)}
                value={selected}
                options={deputies.map((dep) => ({ label: dep.name, value: dep.id }))}
              />
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={!deputies.length} type="submit" className="btn btn-primary">
            {lang.global.go_on_duty}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  deputies: state.ems_fd.deputies,
});

export default connect(mapToProps, { getMyDeputies, setEmsStatus })(SelectOfficerModal);
