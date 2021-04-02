import * as React from "react";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Field from "../../../interfaces/Field";
import { connect } from "react-redux";
import Modal from "../index";
import { createTicket } from "../../../lib/actions/records";
import Officer from "../../../interfaces/Officer";
import PenalCode from "../../../interfaces/PenalCode";
import Select, { Value } from "../../select";
import { modal } from "../../../lib/functions";
import { ModalIds } from "../../../lib/types";

interface Props {
  officer: Officer | null;
  penalCodes: PenalCode[];
  names: string[];

  createTicket: (data: {
    name: string;
    officer_name: string;
    violations: string;
    postal: string;
    notes: string;
  }) => Promise<boolean>;
}

const CreateTicketModal: React.FC<Props> = ({ officer, penalCodes, names, createTicket }) => {
  const [name, setName] = React.useState<Value | null>(null);
  const [violations, setViolations] = React.useState([]);
  const [postal, setPostal] = React.useState("");
  const [notes, setNotes] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name?.value) return;

    const created = await createTicket({
      name: name?.value,
      officer_name: `${officer?.callsign} ${officer?.officer_name}`,
      violations: violations.map((v: any) => v.value).join(", "),
      postal,
      notes,
    });

    if (created === true) {
      modal(ModalIds.CreateTicket).hide();

      setNotes("");
      setName(null);
      setViolations([]);
      setPostal("");
      setNotes("");
    }
  }

  const fields: Field[] = [
    {
      type: "text",
      id: "ticket_postal",
      label: lang.record.postal,
      onChange: (e) => setPostal(e.target.value),
      value: postal,
    },
    {
      type: "text",
      id: "ticket_notes",
      label: lang.global.notes,
      onChange: (e) => setNotes(e.target.value),
      value: notes,
    },
  ];

  return (
    <Modal title={lang.global.create_ticket} size="lg" id={ModalIds.CreateTicket}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="ticket_name">
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
            <label className="form-label">{lang.record.violations}</label>
            <Select
              closeMenuOnSelect={false}
              value={violations}
              onChange={(v: any) => setViolations(v)}
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
            {lang.global.create_ticket}
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

export default connect(mapToProps, { createTicket })(CreateTicketModal);
