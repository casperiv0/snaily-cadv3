import * as React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import Company from "../../../interfaces/Company";
import AlertMessage from "../../../components/alert-message";
import { connect } from "react-redux";
import { deleteCompanyById, getCompanies } from "../../../lib/actions/admin";
import { Item, Span } from "../../citizen/citizen-info";

interface Props {
  message: string;
  companies: Company[];
  getCompanies: () => void;
  deleteCompanyById: (id: string) => void;
}

const CompanyManagementPage: React.FC<Props> = ({
  message,
  companies,
  getCompanies,
  deleteCompanyById,
}) => {
  const [filter, setFilter] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<any>([]);

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
      {message ? <AlertMessage type="success" message={message} /> : null}
      <ul className="list-group">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />
        {!companies[0] ? (
          <AlertMessage type="warning" message={lang.admin.company.no_companies} />
        ) : !filtered[0] ? (
          <AlertMessage type="warning" message={lang.admin.company.no_companies_by_name} />
        ) : (
          filtered.map((company: Company, idx: number) => {
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
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-danger ml-2"
                    type="button"
                    onClick={() => handleDelete(company.id)}
                  >
                    {lang.admin.company.delete_company}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  companies: state.admin.companies,
  message: state.global.message,
});

export default connect(mapToProps, { getCompanies, deleteCompanyById })(CompanyManagementPage);
