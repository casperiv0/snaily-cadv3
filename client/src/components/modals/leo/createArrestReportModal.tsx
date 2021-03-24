import * as React from "react";
import { connect } from "react-redux";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import Field from "../../../interfaces/Field";
import Modal, { XButton } from "../index";
import { creatArrestReport } from "../../../lib/actions/records";
import Officer from "../../../interfaces/Officer";
import Select, { Value } from "../../select";
import PenalCode from "../../../interfaces/PenalCode";

interface Props {
  officer: Officer | null;
  penalCodes: PenalCode[];
  names: string[];

  creatArrestReport: (data: {
    name: string;
    officer_name: string;
    charges: string;
    postal: string;
    notes: string;
  }) => Promise<boolean>;
}

const CreateArrestReportModal: React.FC<Props> = ({
  officer,
  penalCodes,
  names,
  creatArrestReport,
}) => {
  const [name, setName] = React.useState<Value | null>(null);
  const [charges, setCharges] = React.useState([]);
  const [postal, setPostal] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const btnRef = React.useRef<HTMLButtonElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name?.value) return;

    const created = await creatArrestReport({
      name: name?.value,
      officer_name: `${officer?.callsign} ${officer?.officer_name}`,
      charges: charges.map((v: any) => v.value).join(", "),
      postal,
      notes,
    });

    if (created === true) {
      btnRef.current?.click();

      setNotes("");
      setName(null);
      setCharges([]);
      setPostal("");
      setNotes("");
    }
  }

  const fields: Field[] = [
    {
      type: "text",
      id: "arrest_report_postal",
      label: lang.record.postal,
      onChange: (e) => setPostal(e.target.value),
      value: postal,
    },
    {
      type: "text",
      id: "arrest_report_notes",
      label: lang.global.notes,
      onChange: (e) => setNotes(e.target.value),
      value: notes,
    },
  ];

  return (
    <Modal size="lg" id="createArrestReportModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.create_arrest_report}</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="arrest_report_name">
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
            <label className="form-label">{lang.record.charges}</label>
            <Select
              closeMenuOnSelect={false}
              value={charges}
              onChange={(v: any) => setCharges(v)}
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
            {lang.global.create_arrest_report}
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

export default connect(mapToProps, { creatArrestReport })(CreateArrestReportModal);
