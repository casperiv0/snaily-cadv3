import React from "react";
import { Link, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { connect } from "react-redux";
import {
  getOfficerById,
  updateOfficerById,
  UpdateOfficerData,
} from "../../../../lib/actions/admin";
import Message from "../../../../interfaces/Message";
import Officer, { OfficerLog } from "../../../../interfaces/Officer";
import lang from "../../../../language.json";
import Department from "../../../../interfaces/Department";
import { getDepartments } from "../../../../lib/actions/officer";
import useDocTitle from "../../../../hooks/useDocTitle";
import { Item, Span } from "../../../citizen/citizen-info";

interface Props {
  message: Message | null;
  officer: Officer | null;
  logs: OfficerLog[] | undefined;
  departments: Department[];
  getOfficerById: (officerId: string) => void;
  updateOfficerById: (officerId: string, data: UpdateOfficerData) => void;
  getDepartments: (type: "admin" | "leo") => void;
}

const ManageOfficerPage: React.FC<Props> = ({
  officer,
  message,
  departments,
  logs,
  getOfficerById,
  updateOfficerById,
  getDepartments,
}) => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = React.useState(officer?.officer_dept || "");
  const [callSign, setCallSign] = React.useState(officer?.callsign || "");
  const [rank, setRank] = React.useState(officer?.rank || "");
  useDocTitle(`Managing ${officer?.officer_name}`);

  React.useEffect(() => {
    getOfficerById(id);
    getDepartments("leo");
  }, [id, getOfficerById, getDepartments]);

  React.useEffect(() => {
    setCallSign(officer?.callsign || "");
    setRank(officer?.rank || "");
    setDepartment(officer?.officer_dept || "");
  }, [officer]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateOfficerById(id, {
      callsign: callSign,
      rank,
      department,
    });
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage message={message} dismissible /> : null}

      <h1 className="h2 mb-3">Managing Officer: {officer?.officer_name}</h1>

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="tow">
            Department
          </label>

          <select
            className="form-control bg-dark border-dark text-light"
            name="department"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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
        <div className="mb-3">
          <label className="form-label" htmlFor="tow">
            Callsign
          </label>

          <input
            placeholder="callsign"
            value={callSign}
            onChange={(e) => setCallSign(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="tow">
            Rank
          </label>

          <input
            placeholder="rank"
            value={rank}
            onChange={(e) => setRank(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>

        <div className="float-end">
          <Link to="/admin/manage/officers" className="btn btn-danger mx-2">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>

      <div className="mt-5">
        <h1 className="h2">Officer logs</h1>

        <ul className="list-group">
          {logs && logs?.length <= 0 ? (
            <p>Officer does not have any logs yet</p>
          ) : (
            logs?.map((log, idx) => {
              return (
                <li key={idx} id={`${idx}`} className="list-group-item bg-dark border-secondary ">
                  <Item id="started_at">
                    <Span>Started at: </Span>
                    {new Date(+log.started_at).toLocaleString()}
                  </Item>
                  <Item id="ended_at">
                    <Span>Ended at: </Span>
                    {log.ended_at !== "0"
                      ? new Date(+log.ended_at).toLocaleString()
                      : "Has not ended yet"}
                  </Item>

                  <Item id="total">
                    <Span>Total Time on-duty: </Span>
                    {log.ended_at !== "0"
                      ? `${formatDistance(+log.ended_at, +log.started_at)}`
                      : "Not ended yet"}
                  </Item>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  officer: state.admin.officer,
  message: state.global.message,
  departments: state.officers.departments,
  logs: state.admin.officer?.logs,
});

export default connect(mapToProps, { getOfficerById, updateOfficerById, getDepartments })(
  ManageOfficerPage,
);
