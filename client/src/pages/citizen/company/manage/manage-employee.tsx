import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AlertMessage from "../../../../components/alert-message";
import Layout from "../../../../components/Layout";
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
        <AlertMessage message={{ msg: "Citizen not found", type: "danger" }} />
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
          <select
            className="form-control bg-dark border-dark text-light"
            onChange={(e) => setRank(e.target.value)}
            value={rank}
          >
            <option value={employee?.rank}>{employee?.rank}</option>
            <option value="" disabled>
              --------
            </option>
            <option value="manager">{lang.citizen.company.manager}</option>
            <option value="employee">{lang.citizen.company.employee}</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="canRegVeh">
            {lang.citizen.company.can_reg_veh}
          </label>
          <select
            className="form-control bg-dark border-dark text-light"
            onChange={(e) => setCanRegVeh(e.target.value)}
            value={canRegVeh}
          >
            <option value={employee?.vehicle_reg}>
              {employee?.vehicle_reg === "1" ? lang.global.yes : lang.global.no}
            </option>
            <option value="" disabled>
              --------
            </option>
            <option value="0">{lang.global.no}</option>
            <option value="1">{lang.global.yes}</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="canCreatePost">
            {lang.citizen.company.can_create_post}
          </label>
          <select
            className="form-control bg-dark border-dark text-light"
            onChange={(e) => setCanCreatePost(e.target.value)}
            value={canCreatePost}
          >
            <option value={employee?.posts}>
              {employee?.posts === "1" ? lang.global.yes : lang.global.no}
            </option>
            <option value="" disabled>
              --------
            </option>
            <option value="0">{lang.global.no}</option>
            <option value="1">{lang.global.yes}</option>
          </select>
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
