import * as React from "react";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Citizen } from "types/Citizen";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { updateEmployeeStatus } from "@actions/companies/CompanyActions";
import { Company } from "types/Company";
import { Select } from "@components/Select/Select";
import { RequestData } from "@lib/utils";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";

interface Props {
  employee: Nullable<Citizen>;
  company: Nullable<Company>;
  citizen: Nullable<Citizen>;
  updateEmployeeStatus: (
    companyId: string,
    citizenId: string,
    employeeId: string,
    type: "ACCEPT" | "DECLINE" | "FIRE" | "UPDATE",
    data?: RequestData,
  ) => Promise<boolean>;
}

const ManageEmployeeModalC: React.FC<Props> = ({ company, employee, updateEmployeeStatus }) => {
  const [rank, setRank] = React.useState("");
  const [canRegVeh, setCanRegVeh] = React.useState("");
  const [canCreatePost, setCanCreatePost] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = React.useState(false);

  const router = useRouter();
  const citizenId = `${router.query?.citizenId}`;
  const companyId = `${company?.id}`;

  React.useEffect(() => {
    if (employee?.id) {
      setRank(employee?.rank);
      setCanRegVeh(employee?.vehicle_reg);
      setCanCreatePost(employee?.posts);
      setEmployeeOfTheMonth(employee.employee_of_the_month === "1");
    }
  }, [employee]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await updateEmployeeStatus(companyId, citizenId, employee?.id!, "UPDATE", {
      rank,
      can_reg_veh: canRegVeh,
      posts: canCreatePost,
      employee_of_the_month: employeeOfTheMonth,
    });

    setLoading(false);
  }

  return (
    <Modal size="lg" id={ModalIds.ManageEmployee} title="Manage employee">
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="rank">
              {lang.global.rank}
            </label>

            {rank === "owner" ? (
              <AlertMessage
                message={{ msg: lang.citizen.cannot_change_owner_rank, type: "warning" }}
              />
            ) : (
              <Select
                theme="light"
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
              theme="light"
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
              theme="light"
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
        </div>

        <div className="form-check">
          <input
            checked={employeeOfTheMonth}
            onChange={() => setEmployeeOfTheMonth((v) => !v)}
            className="form-check-input"
            type="checkbox"
            id="employee_of_the_month"
          />
          <label className="form-check-label" htmlFor="employee_of_the_month">
            {lang.citizen.employee_of_the_month}
          </label>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={loading} className="btn btn-primary ms-2" type="submit">
            {loading ? `${lang.global.loading}..` : lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  company: state.companies.company ?? null,
  citizen: state.citizen.citizen ?? null,
});

export const ManageEmployeeModal = connect(mapToProps, { updateEmployeeStatus })(
  ManageEmployeeModalC,
);
