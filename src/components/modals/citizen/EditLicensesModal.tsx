import * as React from "react";
import { connect } from "react-redux";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import lang from "../../../language.json";
import { Value } from "types/Value";
import { Field } from "types/Field";
import { getValuesByPath } from "@actions/values/ValuesActions";
import { Select } from "@components/Select/Select";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal, RequestData } from "@lib/utils";
import { updateLicenses } from "@actions/citizen/CitizenActions";
import { ValuePaths } from "types/ValuePaths";

interface Props {
  citizen: Nullable<Citizen>;
  cadLicenses: Value[];
  getValuesByPath: (path: ValuePaths) => void;
  updateLicenses: (id: string, data: RequestData) => Promise<boolean>;
}

const EditLicensesModalC: React.FC<Props> = ({
  citizen,
  cadLicenses,
  getValuesByPath,
  updateLicenses,
}) => {
  const [dmv, setDmv] = React.useState("");
  const [fireArms, setFireArms] = React.useState("");
  const [pilot, setPilot] = React.useState("");
  const [ccw, setCcw] = React.useState("");
  const [cdl, setCdl] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const isSuspended = React.useCallback((type: string) => {
    return type === "1";
  }, []);

  const fields: Field[] = [
    {
      type: "text",
      id: "edit_license_dmv",
      label: lang.citizen.drivers_license,
      onChange: (e) => setDmv(e.value),
      value: isSuspended(dmv) ? lang.officers.suspended : dmv,
      select: true,
      data: cadLicenses,
      selectLabel: citizen?.dmv,
    },
    {
      type: "text",
      id: "edit_license_firearms_license",
      label: lang.citizen.firearms_license,
      onChange: (e) => setFireArms(e.value),
      value: isSuspended(fireArms) ? lang.officers.suspended : fireArms,
      select: true,
      data: cadLicenses,
      selectLabel: citizen?.fire_license,
    },
    {
      type: "text",
      id: "edit_license_pilot_license",
      label: lang.citizen.pilot_license,
      onChange: (e) => setPilot(e.value),
      value: isSuspended(pilot) ? lang.officers.suspended : pilot,
      select: true,
      data: cadLicenses,
      selectLabel: citizen?.dmv,
    },
    {
      type: "text",
      id: "edit_license_ccw",
      label: lang.citizen.ccw,
      onChange: (e) => setCcw(e.value),
      value: isSuspended(ccw) ? lang.officers.suspended : ccw,
      select: true,
      data: cadLicenses,
      selectLabel: citizen?.dmv,
    },
    {
      type: "text",
      id: "edit_license_cdl",
      label: lang.citizen.cdl_license,
      onChange: (e) => setCdl(e.value),
      value: isSuspended(cdl) ? lang.officers.suspended : cdl,
      select: true,
      data: cadLicenses,
      selectLabel: citizen?.cdl_license,
    },
  ];

  React.useEffect(() => {
    getValuesByPath("cad-licenses");
  }, [getValuesByPath]);

  React.useEffect(() => {
    if (citizen !== null) {
      setDmv(citizen?.dmv);
      setFireArms(citizen?.fire_license);
      setPilot(citizen?.pilot_license);
      setCcw(citizen?.ccw);
      setCdl(citizen.cdl_license);
    }
  }, [citizen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizen) return;
    setLoading(true);

    const updated = await updateLicenses(citizen?.id, {
      dmv,
      fire_license: fireArms,
      pilot_license: pilot,
      ccw,
      cdl_license: cdl,
    });

    if (updated === true) {
      modal(ModalIds.EditLicenses)?.hide();
    }

    setLoading(false);
  }

  return (
    <Modal size="lg" id={ModalIds.EditLicenses} title={lang.citizen.license.edit}>
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
                  options={cadLicenses.map((status) => ({
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
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizen: state.citizen.citizen,
  cadLicenses: state.values["cad-licenses"],
});

export const EditLicensesModal = connect(mapToProps, {
  getValuesByPath,
  updateLicenses,
})(EditLicensesModalC);
