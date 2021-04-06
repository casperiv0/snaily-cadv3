import * as React from "react";
import { connect } from "react-redux";
import Citizen from "../../interfaces/Citizen";
import Match from "../../interfaces/Match";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { fireEmployee } from "../../lib/actions/company";
import { Item, Span } from "../../pages/citizen/citizen-info";
import AlertMessage from "../alert-message";

interface Props {
  match: Match;
  employees: Citizen[];
  fireEmployee: (employeeId: string, companyId: string, citizenId: string) => void;
}

const EmployeesTab: React.FC<Props> = ({ employees, match, fireEmployee }) => {
  const { companyId, citizenId } = match.params;

  function handleFire(id: string) {
    fireEmployee(id, companyId, citizenId);
  }

  return (
    <ul className="list-group mt-2">
      {!employees[0] ? (
        <AlertMessage message={{ msg: lang.citizen.company.no_em, type: "danger" }} />
      ) : (
        employees.map((employee: Citizen, idx: number) => {
          return (
            <li
              key={idx}
              className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              id={`${idx}`}
            >
              <div>
                {++idx} | {employee.full_name}
                <div>
                  <Item id="rank">
                    <Span>{lang.global.rank}: </Span>
                    {employee.rank}
                  </Item>

                  <Item id="vehicle_reg">
                    <Span>{lang.citizen.company.can_reg_veh}: </Span>
                    {employee.vehicle_reg === "1" ? lang.global.yes : lang.global.no}
                  </Item>

                  <Item id="posts">
                    <Span>{lang.citizen.company.can_create_post}: </Span>
                    {employee.posts === "1" ? lang.global.yes : lang.global.no}
                  </Item>

                  <Item id="status">
                    <Span>{lang.dispatch.status}: </Span>
                    {employee.b_status}
                  </Item>
                </div>
              </div>
              <div>
                <a
                  href={`/company/${citizenId}/${companyId}/manage/${employee.id}`}
                  className="btn btn-success "
                >
                  {lang.citizen.company.manage_em}
                </a>
                {employee.rank === "employee" ? (
                  <button
                    onClick={() => handleFire(employee.id!)}
                    type="button"
                    className="btn btn-danger ms-2"
                  >
                    {lang.citizen.company.fire_em}
                  </button>
                ) : null}
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};

const mapToProps = (state: State) => ({
  employees: state.company.employees,
});

export default connect(mapToProps, { fireEmployee })(EmployeesTab);
