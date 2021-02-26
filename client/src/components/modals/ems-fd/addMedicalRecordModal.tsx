import * as React from "react";
import { connect } from "react-redux";
import Modal, { XButton } from "..";
import Citizen from "../../../interfaces/Citizen";
import Message from "../../../interfaces/Message";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import { getAllCitizens } from "../../../lib/actions/admin";
import { createMedicalRecord } from "../../../lib/actions/citizen";
import AlertMessage from "../../alert-message";
import Select from "../../select";

interface Props {
  message: Message;
  citizens: Citizen[];
  getAllCitizens: () => void;
  createMedicalRecord: (
    data: object,
    citizenId: string,
    shouldReturn?: boolean,
  ) => Promise<boolean | string>;
}

const AddMedicalRecord: React.FC<Props> = ({
  message,
  citizens,
  getAllCitizens,
  createMedicalRecord,
}) => {
  const [citizenId, setCitizenId] = React.useState("");
  const [type, setType] = React.useState("");
  const [description, setDescription] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    getAllCitizens();
  }, [getAllCitizens]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizenId) return;

    const success = await createMedicalRecord(
      {
        type,
        shortInfo: description,
      },
      citizenId,
      false,
    );

    if (success) {
      btnRef.current?.click();
    }
  }

  return (
    <Modal id="addMedicalRecord" size="lg">
      <div className="modal-header">
        <h5 className="modal-title">Add medical record</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <AlertMessage message={message} />

          <div className="mb-3">
            <label className="form-label">Select type</label>
            <select
              className="form-control bg-secondary border-secondary text-light"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="" disabled>
                ---------
              </option>
              <option value="Allergy">Allergy</option>
              <option value="Medication">Medication</option>
              <option value="Health Problem">Health Problem</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Citizen name</label>
            <Select
              options={citizens.map((citizen) => ({ label: citizen.full_name, value: citizen.id }))}
              closeMenuOnSelect={true}
              isMulti={false}
              onChange={(v: any) => setCitizenId(v.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control bg-secondary border-secondary text-light"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            Add medical record
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
  citizens: state.admin.citizens,
});

export default connect(mapToProps, { getAllCitizens, createMedicalRecord })(AddMedicalRecord);
