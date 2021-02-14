import * as React from "react";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Field from "../../../interfaces/Field";
import AlertMessage from "../../alert-message";
import { connect } from "react-redux";
import Modal, { XButton } from "../index";
import { createWrittenWarning } from "../../../lib/actions/records";
import Officer from "../../../interfaces/Officer";
import PenalCode from "../../../interfaces/PenalCode";
import Select from "../../select";

interface Props {
  error: string;
  officer: Officer | null;
  penalCodes: PenalCode[];
  createWrittenWarning: (data: {
    name: string;
    officer_name: string;
    infractions: string;
    postal: string;
    notes: string;
  }) => void;
}

const CreateWrittenWarningModal: React.FC<Props> = ({
  error,
  officer,
  penalCodes,
  createWrittenWarning,
}) => {
  const [name, setName] = React.useState("");
  const [infractions, setInfractions] = React.useState([]);
  const [postal, setPostal] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createWrittenWarning({
      name,
      officer_name: `${officer?.callsign} ${officer?.officer_name}`,
      infractions: infractions.map((v: any) => v.value).join(", "),
      postal,
      notes,
    });
  }

  React.useEffect(() => {
    if (error === null) {
      setNotes("");
      setName("");
      setInfractions([]);
      setPostal("");
      setNotes("");

      btnRef.current?.click();
    }
  }, [error, btnRef]);

  const fields: Field[] = [
    {
      type: "text",
      id: "written_warning_name",
      label: lang.record.enter_full_name,
      onChange: (e) => setName(e.target.value),
      value: name,
    },
    {
      type: "text",
      id: "written_warning_postal",
      label: lang.record.postal,
      onChange: (e) => setPostal(e.target.value),
      value: postal,
    },
    {
      type: "text",
      id: "written_warning_notes",
      label: lang.global.notes,
      onChange: (e) => setNotes(e.target.value),
      value: notes,
    },
  ];

  return (
    <Modal size="lg" id="createWrittenWarningModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.create_written_warning}</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          {error ? <AlertMessage message={{ msg: error, type: "warning" }} /> : null}
          {fields.map((field: Field, idx: number) => {
            return (
              <div id={`${idx}`} key={idx} className="mb-3">
                <label className="form-label" htmlFor={field.id}>
                  {field.label}
                </label>
                <input
                  className="form-control bg-secondary border-secondary text-light"
                  type={field.type}
                  id={field.id}
                  onChange={field.onChange}
                  value={field.value}
                  list={`${field.id}-list`}
                />
              </div>
            );
          })}
          <div className="mb-3">
            <label className="form-label">{lang.record.infractions}</label>
            <Select
              closeMenuOnSelect={false}
              value={infractions}
              onChange={(v: any) => setInfractions(v)}
              options={penalCodes.map((code) => ({
                value: code.title,
                label: code.title,
              }))}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.global.create_written_warning}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  error: state.officers.error,
  officer: state.officers.activeOfficer,
  penalCodes: state.admin.penalCodes,
});

export default connect(mapToProps, { createWrittenWarning })(CreateWrittenWarningModal);
