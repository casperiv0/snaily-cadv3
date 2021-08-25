import * as React from "react";
import { connect } from "react-redux";
import { Citizen } from "types/Citizen";
import { AlertMessage } from "components/AlertMessage/AlertMessage";
import lang from "src/language.json";
import { updateEmployeeStatus } from "actions/companies/CompanyActions";

interface Props {
  employees: Citizen[];
  citizenId: string;
  companyId: string;
  updateEmployeeStatus: (
    companyId: string,
    citizenId: string,
    employeeId: string,
    type: "ACCEPT" | "DECLINE" | "FIRE",
  ) => void;
}

const PendingTabC: React.FC<Props> = ({
  employees,
  companyId,
  citizenId,
  updateEmployeeStatus,
}) => {
  function handleAccept(id: string) {
    updateEmployeeStatus(companyId, citizenId, id, "ACCEPT");
  }

  function handleDecline(id: string) {
    updateEmployeeStatus(companyId, citizenId, id, "DECLINE");
  }

  return (
    <ul className="list-group mt-2">
      {!employees[0] ? (
        <AlertMessage message={{ msg: lang.citizen.company.no_cit_pen, type: "warning" }} />
      ) : (
        employees.map((employee: Citizen, idx: number) => {
          return (
            <li
              key={idx}
              className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
            >
              <p>
                {++idx} | {employee.full_name}
              </p>

              <div>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleDecline(employee.id!);
                  }}
                >
                  {lang.global.decline}
                </button>
                <button
                  className="btn btn-success ms-2"
                  onClick={() => {
                    handleAccept(employee.id!);
                  }}
                >
                  {lang.global.accept}
                </button>
              </div>
            </li>
          );
        })
      )}
    </ul>
  );
};

export const PendingTab = connect(null, { updateEmployeeStatus })(PendingTabC);
