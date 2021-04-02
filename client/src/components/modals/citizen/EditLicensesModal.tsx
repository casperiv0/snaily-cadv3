import * as React from "react";
import { connect } from "react-redux";
import Citizen from "../../../interfaces/Citizen";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Value from "../../../interfaces/Value";
import Field from "../../../interfaces/Field";
import { getLegalStatuses } from "../../../lib/actions/values";
import Select from "../../select";
import Modal from "..";
import { ModalIds } from "../../../lib/types";
import { modal } from "../../../lib/functions";
import { updateLicenses } from "../../../lib/actions/citizen";

interface Props {
  citizen: Citizen | null;
  legalStatuses: Value[];
  getLegalStatuses: () => void;
  updateLicenses: (id: string, data: object) => Promise<boolean>;
}

const EditLicensesModal: React.FC<Props> = ({
  citizen,
  legalStatuses,
  getLegalStatuses,
  updateLicenses,
}) => {
  const [dmv, setDmv] = React.useState("");
  const [fireArms, setFireArms] = React.useState("");
  const [pilot, setPilot] = React.useState("");
  const [ccw, setCcw] = React.useState("");

  const isSuspended = React.useCallback((type: string) => {
    return type === "1";
  }, []);

  const fields: Field[] = [
    {
      type: "text",
      id: "dmv",
      label: lang.citizen.drivers_license,
      onChange: (e) => setDmv(e.value),
      value: isSuspended(dmv) ? window.lang.officers.suspended : dmv,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.dmv,
    },
    {
      type: "text",
      id: "firearms_license",
      label: lang.citizen.firearms_license,
      onChange: (e) => setFireArms(e.value),
      value: isSuspended(fireArms) ? window.lang.officers.suspended : fireArms,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.fire_license,
    },
    {
      type: "text",
      id: "pilot_license",
      label: lang.citizen.pilot_license,
      onChange: (e) => setPilot(e.value),
      value: isSuspended(pilot) ? window.lang.officers.suspended : pilot,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.dmv,
    },
    {
      type: "text",
      id: "ccw",
      label: lang.citizen.ccw,
      onChange: (e) => setCcw(e.value),
      value: isSuspended(ccw) ? window.lang.officers.suspended : ccw,
      select: true,
      data: legalStatuses,
      selectLabel: citizen?.dmv,
    },
  ];

  React.useEffect(() => {
    getLegalStatuses();
  }, [getLegalStatuses]);

  React.useEffect(() => {
    if (citizen !== null) {
      setDmv(citizen?.dmv);
      setFireArms(citizen?.fire_license);
      setPilot(citizen?.pilot_license);
      setCcw(citizen?.ccw);
    }
  }, [citizen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizen) return;

    const updated = await updateLicenses(citizen?.id, {
      dmv,
      fire_license: fireArms,
      pilot_license: pilot,
      ccw,
    });

    if (updated === true) {
      modal(ModalIds.EditLicenses).hide();
    }
  }

  return (
    <Modal size="lg" id={ModalIds.EditLicenses} title={window.lang.citizen.license.edit}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          {fields.map((field: Field, idx: number) => {
            return (
              <div key={idx} id={`${idx}`} className="mb-3">
                <label className="form-label" htmlFor={field.id}>
                  {field.label}
                </label>

                <Select
                  id={field.id}
                  isClearable={false}
                  isMulti={false}
                  value={{ value: field.value, label: field.value }}
                  onChange={field.onChange}
                  options={legalStatuses.map((status) => ({
                    value: status.name,
                    label: status.name,
                  }))}
                />
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizen: state.citizen.citizen,
  legalStatuses: state.values["legal-statuses"],
});

export default connect(mapToProps, {
  getLegalStatuses,
  updateLicenses,
})(EditLicensesModal);
