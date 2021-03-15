import * as React from "react";
import Layout from "../../../components/Layout";
import Match from "../../../interfaces/Match";
import lang from "../../../language.json";
import { connect } from "react-redux";
import { createMedicalRecord } from "../../../lib/actions/citizen";
import { Link } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";
import Select from "../../../components/select";

interface Props {
  match: Match;
  createMedicalRecord: (data: object, id: string, shouldReturn: boolean) => void;
}

const CreateMedicalRecordPage: React.FC<Props> = ({ match, createMedicalRecord }) => {
  const [type, setType] = React.useState("Allergy");
  const [shortInfo, setShortInfo] = React.useState("");
  const citizenId = match.params.id;
  useDocTitle("Create medical record");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createMedicalRecord(
      {
        type,
        shortInfo,
      },
      citizenId,
      true,
    );
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="type">
            {lang.citizen.medical.type}
          </label>

          <Select
            theme="dark"
            isClearable={false}
            onChange={(v) => setType(v?.value)}
            value={{ label: type, value: type }}
            isMulti={false}
            options={[
              {
                label: "Allergy",
                value: "Allergy",
              },
              {
                label: "Medication",
                value: "Medication",
              },
              {
                label: "Health Problem",
                value: "Health Problem",
              },
            ]}
          />
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="short_info">
            {lang.citizen.medical.short_info}
          </label>
          <textarea
            id="short_info"
            cols={10}
            rows={2}
            value={shortInfo}
            onChange={(e) => setShortInfo(e.target.value)}
            className="form-control bg-dark border-dark text-light"
            style={{ resize: "vertical" }}
          ></textarea>
        </div>

        <div className="mb-3 float-end">
          <Link to={`/citizen/${citizenId}`} className="btn btn-danger">
            {lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary ms-2">
            {lang.citizen.medical.add}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default connect(null, { createMedicalRecord })(CreateMedicalRecordPage);
