import * as React from "react";
import { Link } from "react-router-dom";
import State from "../../interfaces/State";
import lang from "../../language.json";
import MedicalRecord from "../../interfaces/MedicalRecord";
import { connect } from "react-redux";
import { getMedicalRecords, deleteMedicalRecord } from "../../lib/actions/citizen";

interface Props {
  citizenId: string;
  medicalRecords: MedicalRecord[];
  getMedicalRecords: (id: string) => void;
  deleteMedicalRecord: (citizenId: string, recordId: string) => void;
}

const MedicalRecordsCard: React.FC<Props> = ({
  citizenId,
  medicalRecords,
  getMedicalRecords,
  deleteMedicalRecord,
}) => {
  React.useEffect(() => {
    getMedicalRecords(citizenId);
  }, [getMedicalRecords, citizenId]);

  return (
    <div className="card bg-dark border-dark mt-1">
      <div className="card-header d-flex justify-content-between">
        <h1 className="h4">{lang.citizen.medical_records}</h1>

        <div>
          <Link to={`/medical-records/create/${citizenId}`} className="btn btn-primary">
            {lang.citizen.medical.add}
          </Link>
        </div>
      </div>

      <div className="card-body">
        {!medicalRecords[0] ? (
          <div className="list-group-item bg-dark border-dark">{lang.citizen.medical.no_med}</div>
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
                        onClick={() => deleteMedicalRecord(citizenId, record.id)}
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
});

export default connect(mapToProps, { getMedicalRecords, deleteMedicalRecord })(MedicalRecordsCard);
