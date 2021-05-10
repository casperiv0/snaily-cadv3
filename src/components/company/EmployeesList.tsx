import { connect } from "react-redux";
import * as React from "react";
import Link from "next/link";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { User } from "types/User";

interface Props {
  user: Nullable<User>;
  employees: Citizen[];
}

const EmployeesListC = ({ employees, user }: Props) => {
  const employeesOfTheMonth = React.useMemo(() => {
    return employees.filter((e) => e.employee_of_the_month === "1");
  }, [employees]);

  return (
    <div>
      <h1 className="h5">{lang.citizen.employees_of_the_month}</h1>
      <ul className="list-group">
        {employeesOfTheMonth.length <= 0
          ? lang.citizen.no_employees_of_the_month
          : employeesOfTheMonth.map((employee) => EmployeeItem(employee, user))}
      </ul>

      <h1 className="h5 mt-3">All employees</h1>
      <ul className="list-group">{employees.map((employee) => EmployeeItem(employee, user))}</ul>
    </div>
  );
};

function EmployeeItem(employee: Citizen, user: Nullable<User>) {
  return (
    <li key={employee.id} className="list-group-item bg-dark border-dark text-light">
      {employee.user_id === user?.id ? (
        <Link href={`/citizen/${employee.id}`}>
          <a>{employee.full_name}</a>
        </Link>
      ) : (
        employee.full_name
      )}
    </li>
  );
}

const mapToProps = (state: State) => ({
  employees: state.companies.employees,
  user: state.auth.user,
});

export const EmployeesList = connect(mapToProps)(EmployeesListC);
