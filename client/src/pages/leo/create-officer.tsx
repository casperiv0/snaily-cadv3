import * as React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import lang from "../../language.json";
import State from "../../interfaces/State";
import Department from "../../interfaces/Department";
import { connect } from "react-redux";
import { createOfficer, getDepartments } from "../../lib/actions/officer";
import AlertMessage from "../../components/alert-message";
import Message from "../../interfaces/Message";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  message: Message | null;
  departments: Department[];
  createOfficer: (data: object) => void;
  getDepartments: (type: "admin" | "leo") => void;
}

const CreateOfficerPage: React.FC<Props> = ({
  message,
  departments,
  createOfficer,
  getDepartments,
}) => {
  useDocTitle("Create Officer");
  const [officerName, setOfficerName] = React.useState<string>("");
  const [officerDept, setOfficerDept] = React.useState<string>("");
  const [callSign, setCallSign] = React.useState<string>("");

  React.useEffect(() => {
    getDepartments("leo");
  }, [getDepartments]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createOfficer({
      name: officerName,
      department: officerDept,
      callsign: callSign,
    });
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <AlertMessage message={message} dismissible />
        <div className="mb-3">
          <label className="form-label" htmlFor="officerName">
            Callsign
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
            {lang.record.officer_name}
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
            {lang.officers.select_department}
          </label>
          <select
            className="form-control bg-dark border-dark text-light"
            name="department"
            id="department"
            value={officerDept}
            onChange={(e) => setOfficerDept(e.target.value)}
          >
            <option>{lang.officers.select_department}..</option>
            {!departments[0] ? (
              <option>{lang.officers.no_departments}</option>
            ) : (
              departments.map((department, idx) => {
                return (
                  <option key={idx} id={`${idx}`} value={department.name}>
                    {department.name}
                  </option>
                );
              })
            )}
          </select>
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger" to="/leo/my-officers">
            {lang.global.cancel}
          </Link>
          <button disabled={!departments[0]} type="submit" className="btn btn-primary ms-2">
            {lang.officers.create_officer}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  departments: state.officers.departments,
  message: state.global.message,
});

export default connect(mapToProps, { createOfficer, getDepartments })(CreateOfficerPage);
