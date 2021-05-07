import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import lang from "../../../language.json";
import { Officer } from "types/Officer";
import { Nullable, State } from "types/State";
import { getMyOfficers, setStatus } from "@actions/officer/OfficerActions";
import { Select, SelectValue } from "@components/Select/Select";
import { modal, notify } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { Cad } from "types/Cad";

interface Props {
  officers: Officer[];
  cadInfo: Nullable<Cad>;
  getMyOfficers: () => void;
  setStatus: (officer: Pick<Officer, "status" | "status2" | "id">) => void;
}

const SelectOfficerModalC: React.FC<Props> = ({ cadInfo, officers, getMyOfficers, setStatus }) => {
  const [selected, setSelected] = React.useState<Nullable<SelectValue>>(null);

  React.useEffect(() => {
    getMyOfficers();
  }, [getMyOfficers]);

  function closeModal() {
    modal(ModalIds.SelectOfficer)?.hide();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected?.value) {
      return notify.warn(lang.officers.select_officer);
    }

    setStatus({
      id: selected?.value,
      status: "on-duty",
      status2: cadInfo?.on_duty_status ?? "10-8",
    });

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
              <p className="font-weight-bold">You do not have any officers!</p>
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
  cadInfo: state.global.cadInfo,
});

export const SelectOfficerModal = connect(mapToProps, { getMyOfficers, setStatus })(
  SelectOfficerModalC,
);
