import * as React from "react";
import { connect } from "react-redux";
import lang from "../../../language.json";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";
import Match from "../../../interfaces/Match";
import { createCompanyPost } from "../../../lib/actions/company";

interface Props {
  error: string;
  match: Match;
  createCompanyPost: (data: object) => void;
}

const CreatePost: React.FC<Props> = ({ error, match, createCompanyPost }) => {
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const { companyId, citizenId } = match.params;

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
      {error ? <AlertMessage type="warning" message={error} /> : null}

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
        <div className="mb-3 float-right">
          <a className="btn btn-danger mr-2" href={`/company/${citizenId}/${companyId}`}>
            {lang.global.cancel}
          </a>
          <button className="btn btn-primary" type="submit">
            {lang.citizen.company.create_post}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  error: state.company.error,
});

export default connect(mapToProps, { createCompanyPost })(CreatePost);
