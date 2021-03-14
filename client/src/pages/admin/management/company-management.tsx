import * as React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import Company from "../../../interfaces/Company";
import AlertMessage from "../../../components/alert-message";
import { connect } from "react-redux";
import { deleteCompanyById, getCompanies } from "../../../lib/actions/admin";
import { Item, Span } from "../../citizen/citizen-info";
import Loader from "../../../components/loader";
import useDocTitle from "../../../hooks/useDocTitle";

interface Props {
  companies: Company[];
  loading: boolean;
  getCompanies: () => void;
  deleteCompanyById: (id: string) => void;
}

const CompanyManagementPage: React.FC<Props> = ({
  companies,
  loading,
  getCompanies,
  deleteCompanyById,
}) => {
  const [filter, setFilter] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<any>([]);
  useDocTitle("Company Management");

  React.useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  React.useEffect(() => {
    if (companies[0]) {
      setFiltered(companies);
    }
  }, [companies]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = companies.filter((company: Company) =>
      company.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredItems);
  }

  function handleDelete(id: string) {
    deleteCompanyById(id);
  }

  return (
    <AdminLayout>
      <div>
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />
        {loading ? (
          <Loader fullScreen={false} />
        ) : !companies[0] ? (
          <AlertMessage message={{ msg: lang.admin.company.no_companies, type: "warning" }} />
        ) : !filtered[0] ? (
          <AlertMessage
            message={{ msg: lang.admin.company.no_companies_by_name, type: "warning" }}
          />
        ) : (
          <ul className="list-group">
            {filtered.map((company: Company, idx: number) => {
              return (
                <li
                  key={idx}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between"
                >
                  <div>
                    {++idx} | {company.name}
                    <div className="mt-2">
                      <Item id="name">
                        <Span>{lang.admin.company.name}: </Span>
                        {company.name}
                      </Item>

                      <Item id="name">
                        <Span>{lang.admin.company.owner}: </Span>
                        {company.owner}
                      </Item>

                      <Item id="username">
                        <Span>Account&apos;s username: </Span>
                        {company.user?.username}
                      </Item>
                    </div>
                  </div>

                  <div>
                    <button
                      className="btn btn-danger ms-2"
                      type="button"
                      onClick={() => handleDelete(company.id)}
                    >
                      {lang.admin.company.delete_company}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  companies: state.admin.companies,
  loading: state.admin.loading,
});

export default connect(mapToProps, { getCompanies, deleteCompanyById })(CompanyManagementPage);
