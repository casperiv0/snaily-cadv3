import * as React from "react";
import { connect } from "react-redux";
import lang from "../../../language.json";
import Layout from "../../../components/Layout";
import Match from "../../../interfaces/Match";
import { createCompanyPost } from "../../../lib/actions/company";
import { Link } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";

interface Props {
  match: Match;
  createCompanyPost: (data: object) => void;
}

const CreatePost: React.FC<Props> = ({ match, createCompanyPost }) => {
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const { companyId, citizenId } = match.params;
  useDocTitle(window.lang.citizen.create_company_post);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createCompanyPost({
      title,
      description,
      company_id: companyId,
      citizen_id: citizenId,
    });
  }

  return (
    <Layout>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            {lang.citizen.company.post_title}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            {lang.citizen.company.post_desc}
          </label>
          <textarea
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control bg-dark border-dark text-light"
          ></textarea>
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger me-2" to={`/company/${citizenId}/${companyId}`}>
            {lang.global.cancel}
          </Link>
          <button className="btn btn-primary" type="submit">
            {lang.citizen.company.create_post}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default connect(null, { createCompanyPost })(CreatePost);
