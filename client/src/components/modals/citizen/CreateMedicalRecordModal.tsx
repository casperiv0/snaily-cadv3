import * as React from "react";
import lang from "../../../language.json";
import { connect } from "react-redux";
import { createMedicalRecord } from "../../../lib/actions/citizen";
import Select from "../../../components/select";
import State from "../../../interfaces/State";
import Modal from "..";
import { ModalIds } from "../../../lib/types";
import { modal } from "../../../lib/functions";

interface Props {
  citizenId: string | undefined;
  createMedicalRecord: (id: string, data: Record<string, unknown>) => Promise<boolean>;
}

const CreateMedicalRecordModal: React.FC<Props> = ({ citizenId, createMedicalRecord }) => {
  const [type, setType] = React.useState("Allergy");
  const [shortInfo, setShortInfo] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizenId) return;

    const created = await createMedicalRecord(citizenId, {
      type,
      shortInfo,
    });

    if (created === true) {
      modal(ModalIds.CreateMedicalCreate).hide();
    }
  }

  return (
    <Modal
      title={window.lang.citizen.create_medical_record}
      id={ModalIds.CreateMedicalCreate}
      size="lg"
    >
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="type">
              {lang.citizen.medical.type}
            </label>

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
            <label className="form-label" htmlFor="short_info">
              {lang.citizen.medical.short_info}
            </label>
            <textarea
              id="short_info"
              cols={10}
              rows={2}
              value={shortInfo}
              onChange={(e) => setShortInfo(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              style={{ resize: "vertical" }}
            ></textarea>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.citizen.medical.add}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizenId: state.citizen.citizen?.id,
});

export default connect(mapToProps, { createMedicalRecord })(CreateMedicalRecordModal);
