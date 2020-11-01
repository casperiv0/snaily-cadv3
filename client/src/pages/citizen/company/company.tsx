import * as React from "react";
import { connect } from "react-redux";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import Citizen from "../../../interfaces/Citizen";
import Company, { CompanyPost } from "../../../interfaces/Company";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import lang from "../../../language.json";
import { getCitizenById } from "../../../lib/actions/citizen";
import { getCompanyById } from "../../../lib/actions/company";
import { Span } from "../citizen-info";

interface Props {
  company: Company;
  citizen: Citizen;
  match: Match;
  posts: CompanyPost[];
  getCitizenById: (id: string) => void;
  getCompanyById: (id: string) => void;
}

const CompanyPage: React.FC<Props> = ({
  citizen,
  company,
  match,
  posts,
  getCitizenById,
  getCompanyById,
}) => {
  const { companyId, citizenId } = match.params;

  React.useEffect(() => {
    getCitizenById(citizenId);
    getCompanyById(companyId);
  }, [getCitizenById, citizenId, getCompanyById, companyId]);

  if (company !== null && !company) {
    return (
      <Layout>
        <AlertMessage type="danger" message="notfound" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="d-flex justify-content-between">
        <h3>{company?.name}</h3>
        <div>
          <a
            className="btn btn-primary mr-2"
            href={`/company/${citizenId}/${companyId}/create-post`}
          >
            {lang.citizen.company.create_a_post}
          </a>
          {citizen?.rank === "manager" || citizen?.rank === "owner" ? (
            <a className="btn btn-secondary" href={`/company/${citizenId}/${companyId}/manage`}>
              {lang.citizen.company.manage_company}
            </a>
          ) : null}
        </div>
      </div>

      <div className="mt-3">
        {posts.map((post: CompanyPost, idx: number) => {
          return (
            <div key={idx} id={`${idx}`} className="card bg-dark border-secondary">
              <div className="card-header">{post.title}</div>

              <div className="card-body">{post.description}</div>

              <div className="card-footer">
                <Span>{lang.citizen.company.uploaded_at}: </Span>{" "}
                {new Date(Number(post.uploaded_at)).toDateString()} |{" "}
                <Span>{lang.citizen.company.uploaded_by}: </Span> {post.uploaded_by}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  company: state.company.company,
  posts: state.company.posts,
  citizen: state.citizen.citizen,
});

export default connect(mapToProps, { getCitizenById, getCompanyById })(CompanyPage);
