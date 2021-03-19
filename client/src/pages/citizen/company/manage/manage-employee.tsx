import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AlertMessage from "../../../../components/alert-message";
import Layout from "../../../../components/Layout";
import Select from "../../../../components/select";
import useDocTitle from "../../../../hooks/useDocTitle";
import Citizen from "../../../../interfaces/Citizen";
import Match from "../../../../interfaces/Match";
import State from "../../../../interfaces/State";
import lang from "../../../../language.json";
import { getCitizenById } from "../../../../lib/actions/citizen";
import { updateEmployee } from "../../../../lib/actions/company";

interface Props {
  employee: Citizen | null;
  returnError: string | null;
  match: Match;
  getCitizenById: (id: string) => void;
  updateEmployee: (employeeId: string, companyId: string, data: object, citizenId: string) => void;
}

const ManageEmployee: React.FC<Props> = ({
  employee,
  returnError,
  match,
  getCitizenById,
  updateEmployee,
}) => {
  const { citizenId, id: employeeId, companyId } = match.params;
  const [rank, setRank] = React.useState("");
  const [canRegVeh, setCanRegVeh] = React.useState("");
  const [canCreatePost, setCanCreatePost] = React.useState("");
  useDocTitle(
    employee?.id ? `${window.lang.citizen.managing_employee}: ${employee.full_name}` : "Company",
  );

  React.useEffect(() => {
    getCitizenById(employeeId);
  }, [getCitizenById, employeeId]);

  React.useEffect(() => {
    if (employee?.id) {
      setRank(employee?.rank!);
      setCanRegVeh(employee?.vehicle_reg!);
      setCanCreatePost(employee?.posts!);
    }
  }, [employee, setRank]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateEmployee(
      employeeId,
      companyId,
      {
        rank,
        can_reg_veh: canRegVeh,
        posts: canCreatePost,
      },
      citizenId,
    );
  }

  if (returnError !== null) {
    return (
      <Layout>
        <AlertMessage message={{ msg: returnError, type: "danger" }} />
      </Layout>
    );
  }

  if (employee !== null && !employee) {
    return (
      <Layout>
        <AlertMessage message={{ msg: window.lang.citizen.not_found, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="rank">
            {lang.global.rank}
          </label>

          {rank === "owner" ? (
            <AlertMessage
              message={{ msg: window.lang.citizen.cannot_change_owner_rank, type: "warning" }}
            />
          ) : (
            <Select
              theme="dark"
              isMulti={false}
              value={{
                label: rank,
                value: rank,
              }}
              isClearable={false}
              onChange={(v) => setRank(v.value)}
              options={[
                { label: lang.citizen.company.manager, value: "manager" },
                { label: lang.citizen.company.employee, value: "employee" },
              ]}
            />
          )}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="canRegVeh">
            {lang.citizen.company.can_reg_veh}
          </label>

          <Select
            theme="dark"
            isMulti={false}
            value={{
              label: canRegVeh === "1" ? lang.global.yes : lang.global.no,
              value: canRegVeh,
            }}
            isClearable={false}
            onChange={(v) => setCanRegVeh(v.value)}
            options={[
              { label: lang.global.yes, value: "1" },
              { label: lang.global.no, value: "0" },
            ]}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="canCreatePost">
            {lang.citizen.company.can_create_post}
          </label>

          <Select
            theme="dark"
            isMulti={false}
            value={{
              label: canCreatePost === "1" ? lang.global.yes : lang.global.no,
              value: canCreatePost,
            }}
            isClearable={false}
            onChange={(v) => setCanCreatePost(v.value)}
            options={[
              { label: lang.global.yes, value: "1" },
              { label: lang.global.no, value: "0" },
            ]}
          />
        </div>

        <div className="mb-3 float-end">
          <Link className="btn btn-danger" to={`/company/${citizenId}/${companyId}/manage`}>
            {lang.global.cancel}
          </Link>
          <button className="btn btn-primary ms-2" type="submit">
            {lang.global.update}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  employee: state.citizen.citizen,
  returnError: state.company.returnError,
});

export default connect(mapToProps, { getCitizenById, updateEmployee })(ManageEmployee);
