import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import { searchMedicalRecord, declareDeadOrAlive } from "../../../lib/actions/ems-fd";
import { connect } from "react-redux";
import State from "../../../interfaces/State";
import MedicalRecord from "../../../interfaces/MedicalRecord";

interface Props {
  medicalRecords: MedicalRecord[];
  searchMedicalRecord: (name: string) => void;
  declareDeadOrAlive: (citizenId: string, type: "dead" | "alive") => void;
}

const SearchMedicalRecords: React.FC<Props> = ({
  medicalRecords,
  searchMedicalRecord,
  declareDeadOrAlive,
}) => {
  const [name, setName] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    searchMedicalRecord(name);
  }

  function handleDeclare(type: "dead" | "alive") {
    if (!name) return;
    if (!medicalRecords[0]) return;

    declareDeadOrAlive(medicalRecords[0].citizen_id, type);
  }

  function reset() {
    setName("");
  }

  return (
    <Modal size="xl" id="searchMedicalRecordsModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.ems_fd.search_med_rec}</h5>
        <XButton />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <input
            className="form-control bg-secondary border-secondary text-light"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <table className="table table-dark mt-2">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th>{lang.ems_fd.type}</th>
                <th>{lang.ems_fd.short_info}</th>
                <th>{lang.global.name}</th>
                <th>{lang.global.actions}</th>
              </tr>
            </thead>

            <tbody>
              {medicalRecords?.map((record, idx) => {
                return (
                  <tr key={idx}>
                    <th scope="row"> {++idx}</th>
                    <td> {record.type} </td>
                    <td> {record.short_info}</td>
                    <td> {record.name} </td>
                    <td>
                      <button
                        onClick={() =>
                          handleDeclare(record.citizen?.dead === "1" ? "alive" : "dead")
                        }
                        type="button"
                        className="btn btn-primary"
                      >
                        Declare {record.citizen?.dead === "1" ? "alive" : "dead"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-bs-dismiss="modal"
            onClick={reset}
          >
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.global.search}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  medicalRecords: state.ems_fd.medicalRecords,
});

export default connect(mapToProps, { searchMedicalRecord, declareDeadOrAlive })(
  SearchMedicalRecords,
);
