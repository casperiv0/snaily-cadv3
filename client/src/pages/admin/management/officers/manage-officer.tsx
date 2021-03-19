import React from "react";
import { connect } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import {
  getOfficerById,
  updateOfficerById,
  UpdateOfficerData,
  get10Codes,
} from "../../../../lib/actions/admin";
import Officer, { OfficerLog } from "../../../../interfaces/Officer";
import lang from "../../../../language.json";
import Department from "../../../../interfaces/Department";
import { getDepartments } from "../../../../lib/actions/officer";
import useDocTitle from "../../../../hooks/useDocTitle";
import { Item, Span } from "../../../citizen/citizen-info";
import Code10 from "../../../../interfaces/Code10";
import Select, { Value } from "../../../../components/select";
import Loader from "../../../../components/loader";

interface Props {
  officer: Officer | null;
  logs: OfficerLog[] | undefined;
  departments: Department[];
  codes: Code10[];
  loading: boolean;
  getOfficerById: (officerId: string) => void;
  updateOfficerById: (officerId: string, data: UpdateOfficerData) => Promise<boolean>;
  getDepartments: (type: "admin" | "leo") => void;
  get10Codes: () => void;
}

const ManageOfficerPage: React.FC<Props> = ({
  officer,
  departments,
  logs,
  codes,
  loading,
  getOfficerById,
  updateOfficerById,
  getDepartments,
  get10Codes,
}) => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = React.useState<Value | null>(null);
  const [callSign, setCallSign] = React.useState(officer?.callsign || "");
  const [rank, setRank] = React.useState(officer?.rank || "");
  const [status, setStatus] = React.useState(officer?.status ?? "");
  const [status2, setStatus2] = React.useState(officer?.status2 ?? "");
  const history = useHistory();
  useDocTitle(`${window.lang.admin.managing_officer} ${officer?.officer_name}`);

  React.useEffect(() => {
    getOfficerById(id);
    getDepartments("leo");
    get10Codes();
  }, [id, getOfficerById, getDepartments, get10Codes]);

  React.useEffect(() => {
    setCallSign(officer?.callsign ?? "");
    setRank(officer?.rank ?? "");
    setDepartment({ label: officer?.officer_dept ?? "", value: officer?.officer_dept ?? "" });
    setStatus(officer?.status ?? "off-duty");
    setStatus2(officer?.status2 ?? "");
  }, [officer]);

  async function onSubmit(e: React.FormEvent) {
    if (!department) return;
    e.preventDefault();

    const updated = await updateOfficerById(id, {
      callsign: callSign,
      rank,
      department: department?.value,
      status,
      status2,
    });

    if (updated === true) {
      history.push("/admin/manage/officers");
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="h2 mb-3">
        {window.lang.admin.managing_officer}: {officer?.officer_name}
      </h1>

      <form onSubmit={onSubmit}>
        <div className="mb-3 row">
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">
              {window.lang.officers.on_off_duty}
            </label>

            <Select
              isClearable={false}
              theme="dark"
              value={{ label: status, value: status }}
              isMulti={false}
              onChange={(v: any) => setStatus(v.value)}
              options={[
                {
                  value: "on-duty",
                  label: lang.global.on_duty,
                },
                {
                  value: "off-duty",
                  label: lang.global.off_duty,
                },
              ]}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="status2" className="form-label">
              {window.lang.dispatch.status}
            </label>

            <Select
              isClearable={false}
              theme="dark"
              value={{ label: status2, value: status2 }}
              isMulti={false}
              onChange={(v: any) => setStatus2(v.value)}
              options={codes.map((code) => ({ value: code.code, label: code.code }))}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="tow">
            {lang.dispatch.officer_dept}
          </label>

          <Select
            isClearable={false}
            value={department}
            theme="dark"
            isMulti={false}
            onChange={(v) => setDepartment(v)}
            options={departments.map((dep) => ({ value: dep.name, label: dep.name }))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="tow">
            {window.lang.officers.callsign}
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
            {window.lang.global.rank}
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
            {window.lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary">
            {window.lang.global.update}
          </button>
        </div>
      </form>

      <div className="mt-5">
        <h1 className="h2">{window.lang.admin.officer_logs}</h1>

        <ul style={{ maxHeight: "40rem" }} className="list-group overflow-auto">
          {logs && logs?.length <= 0 ? (
            <p>{window.lang.officers.officer_no_logs}</p>
          ) : (
            logs?.map((log, idx) => {
              return (
                <li key={idx} id={`${idx}`} className="list-group-item bg-dark border-secondary ">
                  <Item id="started_at">
                    <Span>{window.lang.officers.started_at}: </Span>
                    {new Date(+log.started_at).toLocaleString()}
                  </Item>
                  <Item id="ended_at">
                    <Span>{window.lang.officers.ended_at}: </Span>
                    {log.ended_at !== "0"
                      ? new Date(+log.ended_at).toLocaleString()
                      : window.lang.officers.not_ended_yet}
                  </Item>

                  <Item id="total">
                    <Span>{window.lang.officers.total_time}: </Span>
                    {log.ended_at !== "0"
                      ? `${formatDistance(+log.ended_at, +log.started_at)}`
                      : window.lang.officers.not_ended_yet}
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
  departments: state.officers.departments,
  logs: state.admin.officer?.logs,
  codes: state.admin.codes,
  loading: state.admin.loading,
});

export default connect(mapToProps, {
  getOfficerById,
  updateOfficerById,
  getDepartments,
  get10Codes,
})(ManageOfficerPage);
