import * as React from "react";
import { connect } from "react-redux";
import lang from "src/language.json";
import { createMedicalRecord } from "@actions/citizen/CitizenActions";
import { Select } from "@components/Select/Select";
import { State } from "types/State";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";

interface Props {
  citizenId: string | undefined;
  createMedicalRecord: (id: string, data: Record<string, unknown>) => Promise<boolean>;
}

const CreateMedicalRecordModalC: React.FC<Props> = ({ citizenId, createMedicalRecord }) => {
  const [type, setType] = React.useState(lang.citizen.allergy);
  const [shortInfo, setShortInfo] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!citizenId) return;
    setLoading(true);

    const created = await createMedicalRecord(citizenId, {
      type,
      shortInfo,
    });

    if (created === true) {
      setType(lang.citizen.allergy);
      setShortInfo("");
      modal(ModalIds.CreateMedicalCreate)?.hide();
    }

    setLoading(false);
  }

  return (
    <Modal title={lang.citizen.create_medical_record} id={ModalIds.CreateMedicalCreate} size="lg">
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
                  label: lang.citizen.allergy,
                  value: lang.citizen.allergy,
                },
                {
                  label: lang.citizen.medication,
                  value: lang.citizen.medication,
                },
                {
                  label: lang.citizen.health_problem,
                  value: lang.citizen.health_problem,
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
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.citizen.medical.add}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  citizenId: state.citizen.citizen?.id,
});

export const CreateMedicalRecordModal = connect(mapToProps, { createMedicalRecord })(
  CreateMedicalRecordModalC,
);
