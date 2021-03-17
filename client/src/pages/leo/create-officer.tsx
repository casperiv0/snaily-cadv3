import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import Department from "../../interfaces/Department";
import { connect } from "react-redux";
import { createOfficer, getDepartments } from "../../lib/actions/officer";
import useDocTitle from "../../hooks/useDocTitle";
import Select, { Value } from "../../components/select";

interface Props {
  departments: Department[];
  createOfficer: (data: object) => Promise<boolean>;
  getDepartments: (type: "admin" | "leo") => void;
}

const CreateOfficerPage: React.FC<Props> = ({ departments, createOfficer, getDepartments }) => {
  useDocTitle(window.lang.officers.create_officer);
  const [officerName, setOfficerName] = React.useState<string>("");
  const [officerDept, setOfficerDept] = React.useState<Value | null>(null);
  const [callSign, setCallSign] = React.useState<string>("");
  const history = useHistory();

  React.useEffect(() => {
    getDepartments("leo");
  }, [getDepartments]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await createOfficer({
      name: officerName,
      department: officerDept?.value,
      callsign: callSign,
    });

    if (created === true) {
      history.push("/leo/my-officers");
    }
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="officerName">
            {window.lang.officers.callsign}
          </label>
          <input
            className="form-control bg-dark border-dark text-light"
            type="text"
            id="callsign"
            value={callSign}
            onChange={(e) => setCallSign(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="officerName">
            {window.lang.record.officer_name}
          </label>
          <input
            className="form-control bg-dark border-dark text-light"
            type="text"
            id="officerName"
            value={officerName}
            onChange={(e) => setOfficerName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="officerDept">
            {window.lang.officers.select_department}
          </label>

          <Select
            isClearable={false}
            value={officerDept}
            theme="dark"
            isMulti={false}
            onChange={(v) => setOfficerDept(v)}
            options={departments.map((dep) => ({ value: dep.name, label: dep.name }))}
          />
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger" to="/leo/my-officers">
            {window.lang.global.cancel}
          </Link>
          <button disabled={!departments[0]} type="submit" className="btn btn-primary ms-2">
            {window.lang.officers.create_officer}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  departments: state.officers.departments,
});

export default connect(mapToProps, { createOfficer, getDepartments })(CreateOfficerPage);
