import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import CreatePostModal from "../../../components/modals/company/CreatePostModal";
import useDocTitle from "../../../hooks/useDocTitle";
import Citizen from "../../../interfaces/Citizen";
import Company, { CompanyPost } from "../../../interfaces/Company";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import { getCitizenById } from "../../../lib/actions/citizen";
import { getCompanyById } from "../../../lib/actions/company";
import { ModalIds } from "../../../lib/types";
import { Span } from "../citizen-info";

interface Props {
  company: Company | null;
  citizen: Citizen | null;
  match: Match;
  posts: CompanyPost[];
  returnError: string | null;
  getCitizenById: (id: string) => void;
  getCompanyById: (id: string, citizenId: string) => void;
}

const ranks = ["owner", "manager"];

const CompanyPage: React.FC<Props> = ({
  citizen,
  company,
  match,
  posts,
  returnError,
  getCitizenById,
  getCompanyById,
}) => {
  const { companyId, citizenId } = match.params;
  useDocTitle(company?.id ? `${window.lang.citizen.viewing_company}: ${company.name}` : "Company");

  React.useEffect(() => {
    getCitizenById(citizenId);
    getCompanyById(companyId, citizenId);
  }, [getCitizenById, citizenId, getCompanyById, companyId]);

  if (company !== null && !company) {
    return (
      <Layout>
        <AlertMessage message={{ msg: window.lang.citizen.company_not_found, type: "danger" }} />
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
            <Link className="btn btn-secondary" to={`/company/${citizenId}/${companyId}/manage`}>
              {lang.citizen.company.manage_company}
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
                <Span>{lang.citizen.company.uploaded_at}: </Span>{" "}
                {new Date(Number(post.uploaded_at)).toLocaleDateString()} |{" "}
                <Span>{lang.citizen.company.uploaded_by}: </Span> {post.uploaded_by}
              </div>
            </div>
          );
        })}
      </div>

      <CreatePostModal />
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  company: state.company.company,
  posts: state.company.posts,
  citizen: state.citizen.citizen,
  returnError: state.company.returnError,
});

export default connect(mapToProps, { getCitizenById, getCompanyById })(CompanyPage);
