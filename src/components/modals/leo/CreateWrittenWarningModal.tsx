import * as React from "react";
import { Nullable, State } from "types/State";
import lang from "../../../language.json";
import { Field } from "types/Field";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { createWrittenWarning } from "@actions/record/RecordActions";
import { Officer } from "types/Officer";
import { PenalCode } from "types/PenalCode";
import { Select, SelectValue } from "@components/Select/Select";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";
import { WrittenWarning } from "types/Record";
import { Name } from "@actions/officer/OfficerTypes";

interface Props {
  officer: Nullable<Officer>;
  penalCodes: PenalCode[];
  names: Name[];

  createWrittenWarning: (
    data: Omit<WrittenWarning, "id" | "citizen_id" | "user_id" | "date">,
  ) => Promise<boolean>;
}

const CreateWrittenWarningModalC: React.FC<Props> = ({
  officer,
  penalCodes,
  names,
  createWrittenWarning,
}) => {
  const [name, setName] = React.useState<Nullable<SelectValue>>(null);
  const [infractions, setInfractions] = React.useState([]);
  const [postal, setPostal] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name?.value) return;
    setLoading(true);

    const created = await createWrittenWarning({
      name: name?.value,
      officer_name: `${officer?.callsign} ${officer?.officer_name}`,
      infractions: infractions.map((v: any) => v.value).join(", "),
      postal,
      notes,
    });

    if (created === true) {
      modal(ModalIds.CreateWrittenWarning)?.hide();

      setNotes("");
      setName(null);
      setInfractions([]);
      setPostal("");
      setNotes("");
    }

    setLoading(false);
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
              closeMenuOnSelect
              isMulti={false}
              value={name}
              onChange={(v) => setName(v)}
              options={names.map(({ full_name }) => ({
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
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.create_written_warning}
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

export const CreateWrittenWarningModal = connect(mapToProps, { createWrittenWarning })(
  CreateWrittenWarningModalC,
);
