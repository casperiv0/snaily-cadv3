import * as React from "react";
import { connect } from "react-redux";
import Modal from "..";
import Citizen from "../../../interfaces/Citizen";
import State from "../../../interfaces/State";
import { getAllCitizens } from "../../../lib/actions/admin";
import { createMedicalRecord } from "../../../lib/actions/citizen";
import { modal } from "../../../lib/functions";
import { ModalIds } from "../../../lib/types";
import Select from "../../select";

interface Props {
  citizens: Citizen[];
  getAllCitizens: () => void;
  createMedicalRecord: (id: string, data: Record<string, unknown>) => Promise<boolean | string>;
}

const AddMedicalRecord: React.FC<Props> = ({ citizens, getAllCitizens, createMedicalRecord }) => {
  const [citizenId, setCitizenId] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    getAllCitizens();
  }, [getAllCitizens]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizenId) return;

    const success = await createMedicalRecord(citizenId, {
      type,
      shortInfo: description,
    });

    if (success) {
      modal(ModalIds.AddMedicalRecord).hide();

      setCitizenId("");
      setType("");
      setDescription("");
    }
  }

  return (
    <Modal title={window.lang.citizen.medical.add} id={ModalIds.AddMedicalRecord} size="lg">
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">{window.lang.citizen.medical.type}</label>

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
            <label className="form-label">{window.lang.record.enter_name}</label>
            <Select
              options={citizens.map((citizen) => ({ label: citizen.full_name, value: citizen.id }))}
              closeMenuOnSelect={true}
              isMulti={false}
              onChange={(v: any) => setCitizenId(v.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">{window.lang.global.description}</label>
            <textarea
              className="form-control bg-secondary border-secondary text-light"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.cancel}
          </button>
          <button disabled={!citizenId} type="submit" className="btn btn-primary">
            {window.lang.citizen.medical.add}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.admin.citizens,
});

export default connect(mapToProps, { getAllCitizens, createMedicalRecord })(AddMedicalRecord);
