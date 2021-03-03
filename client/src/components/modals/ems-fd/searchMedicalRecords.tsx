import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import { searchMedicalRecord } from "../../../lib/actions/ems-fd";
import { connect } from "react-redux";
import State from "../../../interfaces/State";
import MedicalRecord from "../../../interfaces/MedicalRecord";
import AlertMessage from "../../alert-message";
import Message from "../../../interfaces/Message";

interface Props {
  message: Message | null;
  medicalRecords: MedicalRecord[];
  searchMedicalRecord: (name: string) => void;
}

const SearchMedicalRecords: React.FC<Props> = ({
  message,
  medicalRecords,
  searchMedicalRecord,
}) => {
  const [name, setName] = React.useState<string>("");
  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    searchMedicalRecord(name);

    setHasSubmitted(true);
  }

  function reset() {
    setName("");
    setHasSubmitted(false);
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

          {hasSubmitted && message ? (
            <div className="mb-3 mt-2">
              <AlertMessage message={message} />
            </div>
          ) : (
            <table className="table table-dark mt-2">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{lang.ems_fd.type}</th>
                  <th scope="col">{lang.ems_fd.short_info}</th>
                  <th scope="col">{lang.global.name}</th>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
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
  message: state.global.message,
  medicalRecords: state.ems_fd.medicalRecords,
});

export default connect(mapToProps, { searchMedicalRecord })(SearchMedicalRecords);
