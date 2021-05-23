import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { State } from "types/State";
import { searchNames } from "@actions/officer/OfficerActions";
import { createMedicalRecord } from "@actions/citizen/CitizenActions";
import { modal } from "@lib/utils";
import { ModalIds } from "types/ModalIds";
import { Select } from "@components/Select/Select";
import lang from "src/language.json";
import { Name } from "@actions/officer/OfficerTypes";

interface Props {
  names: Name[];
  searchNames: () => void;
  createMedicalRecord: (id: string, data: Record<string, unknown>) => Promise<boolean | string>;
}

const AddMedicalRecord: React.FC<Props> = ({ names, searchNames, createMedicalRecord }) => {
  const [citizenId, setCitizenId] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    searchNames();
  }, [searchNames]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizenId) return;
    setLoading(true);

    const success = await createMedicalRecord(citizenId, {
      type,
      shortInfo: description,
    });

    if (success) {
      modal(ModalIds.AddMedicalRecord)?.hide();

      setCitizenId("");
      setType("");
      setDescription("");
    }

    setLoading(false);
  }

  return (
    <Modal title={lang.citizen.medical.add} id={ModalIds.AddMedicalRecord} size="lg">
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">{lang.citizen.medical.type}</label>

            <Select
              isClearable={false}
              onChange={(v) => setType(v?.value)}
              value={{ label: type, value: type }}
              isMulti={false}
              options={[
                {
                  label: "Allergy",
                  value: "Allergy",
                },
                {
                  label: "Medication",
                  value: "Medication",
                },
                {
                  label: "Health Problem",
                  value: "Health Problem",
                },
              ]}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{lang.record.enter_name}</label>
            <Select
              options={names.map((name) => ({ label: name.full_name, value: name.id }))}
              closeMenuOnSelect
              isMulti={false}
              onChange={(v) => setCitizenId(v.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{lang.global.description}</label>
            <textarea
              className="form-control bg-secondary border-secondary text-light"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={!citizenId || loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.citizen.medical.add}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  names: state.officers.names,
});

export const AddMedicalRecordModal = connect(mapToProps, { searchNames, createMedicalRecord })(
  AddMedicalRecord,
);
