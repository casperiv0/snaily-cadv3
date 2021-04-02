import * as React from "react";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Field from "../../../interfaces/Field";
import { connect } from "react-redux";
import Modal from "../index";
import { createWrittenWarning } from "../../../lib/actions/records";
import Officer from "../../../interfaces/Officer";
import PenalCode from "../../../interfaces/PenalCode";
import Select, { Value } from "../../select";
import { ModalIds } from "../../../lib/types";
import { modal } from "../../../lib/functions";

interface Props {
  officer: Officer | null;
  penalCodes: PenalCode[];
  names: string[];

  createWrittenWarning: (data: {
    name: string;
    officer_name: string;
    infractions: string;
    postal: string;
    notes: string;
  }) => Promise<boolean>;
}

const CreateWrittenWarningModal: React.FC<Props> = ({
  officer,
  penalCodes,
  names,
  createWrittenWarning,
}) => {
  const [name, setName] = React.useState<Value | null>(null);
  const [infractions, setInfractions] = React.useState([]);
  const [postal, setPostal] = React.useState("");
  const [notes, setNotes] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name?.value) return;

    const created = await createWrittenWarning({
      name: name?.value,
      officer_name: `${officer?.callsign} ${officer?.officer_name}`,
      infractions: infractions.map((v: any) => v.value).join(", "),
      postal,
      notes,
    });

    if (created === true) {
      modal(ModalIds.CreateWrittenWarning).hide();

      setNotes("");
      setName(null);
      setInfractions([]);
      setPostal("");
      setNotes("");
    }
  }

  const fields: Field[] = [
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
    <Modal title={lang.global.create_written_warning} size="lg" id={ModalIds.CreateWrittenWarning}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="written_warning_name">
              {lang.record.enter_full_name}
            </label>
            <Select
              closeMenuOnSelect={true}
              isMulti={false}
              value={name}
              onChange={(v) => setName(v)}
              options={names.map(({ full_name }: any) => ({
                value: full_name,
                label: full_name,
              }))}
            />
          </div>

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
  officer: state.officers.activeOfficer,
  penalCodes: state.admin.penalCodes,
  names: state.officers.names,
});

export default connect(mapToProps, { createWrittenWarning })(CreateWrittenWarningModal);
