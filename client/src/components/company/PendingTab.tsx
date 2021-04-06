import * as React from "react";
import { connect } from "react-redux";
import Citizen from "../../interfaces/Citizen";
import State from "../../interfaces/State";
import AlertMessage from "../alert-message";
import lang from "../../language.json";
import { updateEmployeeStatus } from "../../lib/actions/company";
import Match from "../../interfaces/Match";

interface Props {
  employees: Citizen[];
  match: Match;
  updateEmployeeStatus: (
    employeeId: string,
    companyId: string,
    citizenId: string,
    type: "ACCEPT" | "DECLINE",
  ) => void;
}

const PendingTab: React.FC<Props> = ({ employees, match, updateEmployeeStatus }) => {
  const { companyId, citizenId } = match.params;
  const pending: Citizen[] = React.useMemo(() => {
    return employees.filter((em) => em.b_status === "pending");
  }, [employees]);

  function handleAccept(id: string) {
    updateEmployeeStatus(id, companyId, citizenId, "ACCEPT");
  }

  function handleDecline(id: string) {
    updateEmployeeStatus(id, companyId, citizenId, "DECLINE");
  }

  return (
    <ul className="list-group mt-2">
      {!pending[0] ? (
        <AlertMessage message={{ msg: lang.citizen.company.no_cit_pen, type: "warning" }} />
      ) : (
        pending.map((employee: Citizen, idx: number) => {
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

const mapToProps = (state: State) => ({
  employees: state.company.employees,
});

export default connect(mapToProps, { updateEmployeeStatus })(PendingTab);
