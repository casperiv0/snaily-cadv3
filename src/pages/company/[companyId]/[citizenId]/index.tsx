import { GetServerSideProps } from "next";
import * as React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import format from "date-fns/format";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { initializeStore } from "@state/useStore";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Layout } from "@components/Layout";
import { CreatePostModal } from "@components/modals/company/CreatePostModal";
import { Citizen } from "types/Citizen";
import { Company, CompanyPost } from "types/Company";
import { Nullable, State } from "types/State";
import lang from "src/language.json";
import { getCitizenById } from "@actions/citizen/CitizenActions";
import { getCompanyById } from "@actions/companies/CompanyActions";
import { ModalIds } from "types/ModalIds";
import { Span } from "@components/Item";
import { Seo } from "@components/Seo";
import { EmployeesList } from "@components/company/EmployeesList";

interface Props {
  company: Nullable<Company>;
  citizen: Nullable<Citizen>;
  posts: CompanyPost[];
  returnError: Nullable<string>;
}

const ranks = ["owner", "manager"];

const CompanyPage: React.FC<Props> = ({ citizen, company, posts, returnError }) => {
  const router = useRouter();
  const { companyId, citizenId } = router.query;

  if (!company) {
    return (
      <Layout>
        <AlertMessage message={{ msg: lang.citizen.company_not_found, type: "danger" }} />
      </Layout>
    );
  }

  if (returnError !== null) {
    return (
      <Layout>
        <AlertMessage message={{ msg: returnError, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo title={company?.id ? `${lang.citizen.viewing_company}: ${company.name}` : "Company"} />
      <div className="d-flex">
        <div style={{ marginRight: "2rem" }} className="col-md-8">
          <div className="d-flex justify-content-between">
            <h3>{company?.name}</h3>
            <div>
              {ranks.includes(citizen?.rank!) || citizen?.posts === "1" ? (
                <button
                  className="btn btn-primary me-2"
                  data-bs-toggle="modal"
                  data-bs-target={`#${ModalIds.CreateCompanyPost}`}
                >
                  {lang.citizen.company.create_a_post}
                </button>
              ) : null}

              {citizen?.rank === "manager" || citizen?.rank === "owner" ? (
                <Link href={`/company/${companyId}/${citizenId}/manage`}>
                  <a className="btn btn-secondary">{lang.citizen.company.manage_company}</a>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-3">
            {posts.map((post: CompanyPost, idx: number) => {
              return (
                <div key={idx} id={`${idx}`} className="card bg-dark border-secondary mb-2">
                  <div className="card-header">{post.title}</div>

                  <div className="card-body">{post.description}</div>

                  <div className="card-footer">
                    <Span>{lang.citizen.company.uploaded_at}: </Span>
                    {format(+post.uploaded_at, "yyyy-MM-dd")} |{" "}
                    <Span>{lang.citizen.company.uploaded_by}: </Span> {post.uploaded_by}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="col-md-3">
          <EmployeesList />
        </aside>
      </div>

      <CreatePostModal citizenId={`${citizenId}`} companyId={`${companyId}`} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getCompanyById(`${query.companyId}`, `${query.citizenId}`, req.headers)(store.dispatch);
  await getCitizenById(`${query.citizenId}`, req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  company: state.companies.company,
  posts: state.companies.posts,
  citizen: state.citizen.citizen,
  returnError: state.companies.error,
});

export default connect(mapToProps)(CompanyPage);
