import * as React from "react";
import { connect } from "react-redux";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { MedicalRecord } from "types/MedicalRecord";
import { getMedicalRecords, deleteMedicalRecord } from "actions/citizen/CitizenActions";
import { ModalIds } from "types/ModalIds";

interface Props {
  citizenId: Nullable<string>;
  medicalRecords: MedicalRecord[];
  getMedicalRecords: (id: string) => void;
  deleteMedicalRecord: (citizenId: string, recordId: string) => void;
}

const MedicalRecordsCardC: React.FC<Props> = ({
  citizenId,
  medicalRecords,
  deleteMedicalRecord,
  getMedicalRecords,
}) => {
  React.useEffect(() => {
    if (!citizenId) return;
    getMedicalRecords(citizenId);
  }, [getMedicalRecords, citizenId]);

  return (
    <div className="card bg-dark border-dark mt-1">
      <div className="card-header d-flex justify-content-between">
        <h1 className="h4">{lang.citizen.medical_records}</h1>

        <div>
          <button
            data-bs-target={`#${ModalIds.CreateMedicalCreate}`}
            data-bs-toggle="modal"
            className="btn btn-primary"
          >
            {lang.citizen.medical.add}
          </button>
        </div>
      </div>

      <div className="card-body">
        {!medicalRecords[0] ? (
          <div className="list-group-item bg-dark border-dark text-white">
            {lang.citizen.medical.no_med}
          </div>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th>{lang.citizen.medical.type2}</th>
                <th>{lang.citizen.medical.short_info}</th>
                <th>{lang.global.actions}</th>
              </tr>
            </thead>
            <tbody>
              {medicalRecords.map((record: MedicalRecord, idx: number) => {
                return (
                  <tr id={`${idx}`} key={idx}>
                    <th scope="row">{++idx}</th>
                    <td>{record.type}</td>
                    <td>{record.short_info}</td>
                    <td>
                      <button
                        onClick={() => deleteMedicalRecord(citizenId!, record.id)}
                        className="btn btn-danger"
                      >
                        {lang.global.delete}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const mapToProps = (state: State) => ({
  medicalRecords: state.citizen.medicalRecords,
  citizenId: state.citizen.citizen?.id ?? null,
});

export const MedicalRecordsCard = connect(mapToProps, { getMedicalRecords, deleteMedicalRecord })(
  MedicalRecordsCardC,
);
