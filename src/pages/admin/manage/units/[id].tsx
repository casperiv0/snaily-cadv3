import React from "react";
import { connect } from "react-redux";
import formatDistance from "date-fns/formatDistance";
import { useRouter } from "next/router";
import Link from "next/link";
import format from "date-fns/format";
import { AdminLayout } from "@components/admin/AdminLayout";
import { State } from "types/State";
import { getUnitById, updateUnitById, get10Codes } from "@actions/admin/AdminActions";
import { getValuesByPath } from "@actions/values/ValuesActions";
import { Officer, OfficerLog } from "types/Officer";
import lang from "../../../../language.json";
import { Department } from "types/Department";
import { Code10 } from "types/Code10";
import { Select, SelectValue } from "@components/Select/Select";
import { Deputy } from "types/Deputy";
import { ValuePaths } from "types/ValuePaths";
import { Seo } from "@components/Seo";
import { Item, Span } from "@components/Item";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { RequestData } from "@lib/utils";

interface Props {
  unit: (Officer | Deputy) | null;
  logs: OfficerLog[];
  departments: Department[];
  codes: Code10[];

  updateUnitById: (id: string, data: RequestData) => Promise<boolean>;
  getValuesByPath: (path: ValuePaths) => void;
}

const ManageOfficerPage: React.FC<Props> = ({
  unit,
  departments,
  logs,
  codes,
  updateUnitById,
  getValuesByPath,
}) => {
  const router = useRouter();
  const id = `${router.query.id}`;
  const [department, setDepartment] = React.useState<SelectValue | null>(null);
  const [callSign, setCallSign] = React.useState<string>("");
  const [rank, setRank] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>(unit?.status ?? "");
  const [status2, setStatus2] = React.useState<string>(unit?.status2 ?? "");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    getValuesByPath("departments");
  }, [getValuesByPath]);

  React.useEffect(() => {
    if (unit) {
      setCallSign(unit?.callsign || "");
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
    setLoading(true);
    e.preventDefault();

    const updated = await updateUnitById(id, {
      callsign: callSign!,
      rank: rank!,
      department: department?.value,
      status: status!,
      status2: status2!,
    });

    if (updated === true) {
      router.push("/admin/manage/units");
    }

    setLoading(false);
  }

  if (!unit) {
    return null;
  }

  return (
    <AdminLayout>
      <Seo
        title={`${lang.admin.managing_unit} ${
          unit && "officer_name" in unit! ? unit?.officer_name : unit?.name
        }`}
      />

      <h1 className="h2 mb-3">
        {lang.admin.managing_unit}: {"officer_name" in unit! ? unit?.officer_name : unit?.name}
      </h1>

      <form onSubmit={onSubmit}>
        <div className="mb-3 row">
          <div className="col-md-6">
            <label htmlFor="status" className="form-label">
              {lang.officers.on_off_duty}
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
              {lang.dispatch.status}
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
            {lang.officers.callsign}
          </label>
          <input
            placeholder="callsign"
            value={callSign}
            onChange={(e) => setCallSign(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
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
                {lang.global.rank}
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
          <Link href="/admin/manage/units">
            <a className="btn btn-danger mx-2">{lang.global.cancel}</a>
          </Link>
          <button disabled={loading} type="submit" className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.update}
          </button>
        </div>
      </form>

      {"officer_name" in unit ? (
        <div className="mt-5">
          <h1 className="h2">{lang.admin.officer_logs}</h1>

          <ul style={{ maxHeight: "40rem" }} className="list-group overflow-auto">
            {logs && logs?.length <= 0 ? (
              <p>{lang.officers.officer_no_logs}</p>
            ) : (
              logs?.map((log, idx) => {
                return (
                  <li
                    key={idx}
                    id={`${idx}`}
                    className="list-group-item bg-dark border-secondary text-white"
                  >
                    <Item id="started_at">
                      <Span>{lang.officers.started_at}: </Span>
                      {format(+log.started_at, "yyyy-MM-dd HH:mm:ss")}
                    </Item>
                    <Item id="ended_at">
                      <Span>{lang.officers.ended_at}: </Span>
                      {log.ended_at !== "0"
                        ? format(+log.ended_at, "yyyy-MM-dd HH:mm:ss")
                        : lang.officers.not_ended_yet}
                    </Item>

                    <Item id="total">
                      <Span>{lang.officers.total_time}: </Span>
                      {log.ended_at !== "0"
                        ? `${formatDistance(+log.ended_at, +log.started_at)}`
                        : lang.officers.not_ended_yet}
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

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await getUnitById(`${query.id}`, req.headers)(store.dispatch);
  await get10Codes(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  unit: state.admin.unit,
  departments: state.values.departments,
  logs: state.admin.unit?.logs ?? [],
  codes: state.admin.codes,
});

export default connect(mapToProps, {
  updateUnitById,
  getValuesByPath,
})(ManageOfficerPage);
