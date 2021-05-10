import * as React from "react";
import { connect } from "react-redux";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { updateEmployeeStatus } from "@actions/companies/CompanyActions";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Item, Span } from "@components/Item";
import { ManageEmployeeModal } from "@components/modals/company/ManageEmployeeModal";
import { ModalIds } from "types/ModalIds";

interface Props {
  employees: Citizen[];
  companyId: string;
  citizenId: string;
  updateEmployeeStatus: (
    companyId: string,
    citizenId: string,
    employeeId: string,
    type: "ACCEPT" | "DECLINE" | "FIRE",
  ) => void;
}

const EmployeesTabC: React.FC<Props> = ({
  employees,
  companyId,
  citizenId,
  updateEmployeeStatus,
}) => {
  const [tempEmployee, setTempEmployee] = React.useState<Nullable<Citizen>>(null);

  function handleFire(id: string) {
    updateEmployeeStatus(companyId, citizenId, id, "FIRE");
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

                  <Item id="employee_of_the_month">
                    <Span>{lang.citizen.employee_of_the_month}: </Span>
                    {employee.employee_of_the_month}
                  </Item>
                </div>
              </div>
              <div>
                {employee.rank !== "owner" ? (
                  <button
                    data-bs-toggle="modal"
                    data-bs-target={`#${ModalIds.ManageEmployee}`}
                    onClick={() => setTempEmployee(employee)}
                    className="btn btn-primary"
                  >
                    {lang.citizen.company.manage_em}
                  </button>
                ) : null}
                {employee.rank === "employee" ? (
                  <button
                    onClick={() => handleFire(employee?.id)}
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

      <ManageEmployeeModal employee={tempEmployee} />
    </ul>
  );
};

const mapToProps = (state: State) => ({
  employees: state.companies.employees,
});

export const EmployeesTab = connect(mapToProps, { updateEmployeeStatus })(EmployeesTabC);
