import * as React from "react";
import Modal from "../index";
import lang from "../../../language.json";
import { searchMedicalRecord, declareDeadOrAlive } from "../../../lib/actions/ems-fd";
import { searchNames } from "../../../lib/actions/officer";
import { connect } from "react-redux";
import State from "../../../interfaces/State";
import MedicalRecord from "../../../interfaces/MedicalRecord";
import Select from "../../select";
import { ModalIds } from "../../../lib/types";

interface Props {
  medicalRecords: MedicalRecord[];
  searchMedicalRecord: (name: string) => void;
  declareDeadOrAlive: (citizenId: string, type: "dead" | "alive") => void;
  searchNames: () => void;
  names: string[];
}

const SearchMedicalRecords: React.FC<Props> = ({
  medicalRecords,
  names,
  searchMedicalRecord,
  declareDeadOrAlive,
  searchNames,
}) => {
  const [name, setName] = React.useState<string>("");

  React.useEffect(() => {
    searchNames();
  }, [searchNames]);

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
    <Modal title={lang.ems_fd.search_med_rec} size="xl" id={ModalIds.SearchMedicalRecords}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <Select
            isMulti={false}
            value={{ value: name, label: name }}
            onChange={(v) => setName(v?.value)}
            options={names.map(({ full_name }: any) => ({
              value: full_name,
              label: full_name,
            }))}
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
                        {record.citizen?.dead === "1"
                          ? window.lang.ems_fd.declare_alive
                          : window.lang.ems_fd.declare_dead}
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
  names: state.officers.names,
});

export default connect(mapToProps, { searchNames, searchMedicalRecord, declareDeadOrAlive })(
  SearchMedicalRecords,
);
