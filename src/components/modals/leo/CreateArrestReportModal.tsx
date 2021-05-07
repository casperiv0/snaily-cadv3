import * as React from "react";
import { connect } from "react-redux";
import { Nullable, State } from "types/State";
import lang from "../../../language.json";
import { Field } from "types/Field";
import { Modal } from "@components/Modal/Modal";
import { creatArrestReport } from "@actions/record/RecordActions";
import { Officer } from "types/Officer";
import { Select, SelectValue } from "@components/Select/Select";
import { PenalCode } from "types/PenalCode";
import { ModalIds } from "types/ModalIds";
import { getPenalCodesFromSelectValues, getTotalJailTimeAndFineAmount, modal } from "@lib/utils";
import { ArrestReport } from "types/Record";
import { Name } from "@actions/officer/OfficerTypes";
import { Item, Span } from "@components/Item";

interface Props {
  officer: Nullable<Officer>;
  penalCodes: PenalCode[];
  names: Name[];

  creatArrestReport: (
    data: Omit<ArrestReport, "id" | "citizen_id" | "user_id" | "date">,
  ) => Promise<boolean>;
}

const CreateArrestReportModalC: React.FC<Props> = ({
  officer,
  penalCodes,
  names,
  creatArrestReport,
}) => {
  const [name, setName] = React.useState<Nullable<SelectValue>>(null);
  const [charges, setCharges] = React.useState<SelectValue[]>([]);
  const [postal, setPostal] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { fineAmount, jailTime } = getTotalJailTimeAndFineAmount(
    getPenalCodesFromSelectValues(charges, penalCodes),
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name?.value) return;
    setLoading(true);

    const created = await creatArrestReport({
      name: name?.value,
      officer_name: `${officer?.callsign} ${officer?.officer_name}`,
      charges: charges.map((v: any) => v.value).join(", "),
      postal,
      notes,
    });

    if (created === true) {
      modal(ModalIds.CreateArrestReport)?.hide();

      setNotes("");
      setName(null);
      setCharges([]);
      setPostal("");
      setNotes("");
    }

    setLoading(false);
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
    <Modal title={lang.global.create_arrest_report} size="lg" id={ModalIds.CreateArrestReport}>
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
          {jailTime ? (
            <Item className="mx-0">
              <>
                <Span>{lang.codes.jail_time2}: </Span> {jailTime} {lang.codes.seconds}
              </>
            </Item>
          ) : null}
          {fineAmount ? (
            <Item className="mx-5">
              <>
                <Span>{lang.codes.fine_amount2}: </Span> {fineAmount}
              </>
            </Item>
          ) : null}
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.create_arrest_report}
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

export const CreateArrestReportModal = connect(mapToProps, { creatArrestReport })(
  CreateArrestReportModalC,
);
