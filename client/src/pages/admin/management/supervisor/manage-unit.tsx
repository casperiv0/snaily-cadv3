import React from "react";
import { connect } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import {
  getUnitById,
  updateUnitById,
  UpdateOfficerData,
  get10Codes,
} from "../../../../lib/actions/admin";
import { getValuesByPath } from "../../../../lib/actions/values";
import Officer, { OfficerLog } from "../../../../interfaces/Officer";
import lang from "../../../../language.json";
import Department from "../../../../interfaces/Department";
import useDocTitle from "../../../../hooks/useDocTitle";
import { Item, Span } from "../../../citizen/citizen-info";
import Code10 from "../../../../interfaces/Code10";
import Select, { Value } from "../../../../components/select";
import Loader from "../../../../components/loader";
import Deputy from "../../../../interfaces/Deputy";
import ValuePaths from "../../../../interfaces/ValuePaths";

interface Props {
  unit: (Officer | Deputy) | null;
  logs: OfficerLog[] | undefined;
  departments: Department[];
  codes: Code10[];
  loading: boolean;
  getUnitById: (id: string) => void;
  updateUnitById: (officerId: string, data: UpdateOfficerData) => Promise<boolean>;
  getValuesByPath: (path: ValuePaths) => void;
  get10Codes: () => void;
}

const ManageOfficerPage: React.FC<Props> = ({
  unit,
  departments,
  logs,
  codes,
  loading,
  getUnitById,
  updateUnitById,
  getValuesByPath,
  get10Codes,
}) => {
  const { id } = useParams<{ id: string }>();
  const [department, setDepartment] = React.useState<Value | null>(null);
  const [callSign, setCallSign] = React.useState<string>("");
  const [rank, setRank] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>(unit?.status ?? "");
  const [status2, setStatus2] = React.useState<string>(unit?.status2 ?? "");
  const history = useHistory();
  useDocTitle(
    `${window.lang.admin.managing_unit} ${
      unit && "officer_name" in unit! ? unit?.officer_name : unit?.name
    }`,
  );

  React.useEffect(() => {
    getUnitById(id);
    getValuesByPath("departments");
    get10Codes();
  }, [id, getUnitById, getValuesByPath, get10Codes]);

  React.useEffect(() => {
    if (unit) {
      setCallSign(("officer_name" in unit! && unit?.callsign) || "");
      setRank(("officer_name" in unit! && unit?.rank) || "");
      setDepartment({
        label: ("officer_name" in unit! && unit?.officer_dept) || "",
        value: ("officer_name" in unit! && unit?.officer_dept) || "",
      });
      setStatus(unit?.status ?? "off-duty");
      setStatus2(unit?.status2 ?? "");
    }
  }, [unit]);

  async function onSubmit(e: React.FormEvent) {
    if (!department) return;
    e.preventDefault();

    const updated = await updateUnitById(id, {
      callsign: callSign!,
      rank: rank!,
      department: department?.value,
      status: status!,
      status2: status2!,
    });

    if (updated === true) {
      history.push("/admin/manage/units");
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  if (!unit) {
    return null;
  }

  return (
    <AdminLayout>
      <h1 className="h2 mb-3">
        {window.lang.admin.managing_unit}:{" "}
        {"officer_name" in unit! ? unit?.officer_name : unit?.name}
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
              value={{ label: status!, value: status! }}
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

        {"officer_name" in unit! ? (
          <>
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
          </>
        ) : null}

        <div className="float-end">
          <Link to="/admin/manage/units" className="btn btn-danger mx-2">
            {window.lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary">
            {window.lang.global.update}
          </button>
        </div>
      </form>

      {"officer_name" in unit ? (
        <div className="mt-5">
          <h1 className="h2">{window.lang.admin.officer_logs}</h1>

          <ul style={{ maxHeight: "40rem" }} className="list-group overflow-auto">
            {logs && logs?.length <= 0 ? (
              <p>{window.lang.officers.officer_no_logs}</p>
            ) : (
              logs?.map((log, idx) => {
                return (
                  <li
                    key={idx}
                    id={`${idx}`}
                    className="list-group-item bg-dark border-secondary text-white"
                  >
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
      ) : null}
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  unit: state.admin.unit,
  departments: state.values.departments,
  logs: state.admin.unit?.logs,
  codes: state.admin.codes,
  loading: state.admin.loading,
});

export default connect(mapToProps, {
  getUnitById,
  updateUnitById,
  getValuesByPath,
  get10Codes,
})(ManageOfficerPage);
