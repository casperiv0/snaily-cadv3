import * as React from "react";
import { AdminLayout } from "../../../components/admin/AdminLayout";
import lang from "src/language.json";
import { State } from "types/State";
import { Company } from "types/Company";
import { AlertMessage } from "../../../components/AlertMessage/AlertMessage";
import { connect } from "react-redux";
import { deleteCompanyById, getCompanies } from "@actions/companies/CompanyActions";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { Seo } from "@components/Seo";
import { Item, Span } from "@components/Item";

interface Props {
  companies: Company[];
  loading: boolean;
  getCompanies: () => void;
  deleteCompanyById: (id: string) => void;
}

const CompanyManagementPage: React.FC<Props> = ({ companies, deleteCompanyById }) => {
  const [filter, setFilter] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<any>([]);

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
      <Seo title="Company Management" />
      <div>
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />
        {!companies[0] ? (
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
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers.cookie)(store.dispatch);
  await getCadInfo(req.headers.cookie)(store.dispatch);
  await getCompanies(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  companies: state.companies.companies,
});

export default connect(mapToProps, { deleteCompanyById })(CompanyManagementPage);
