import * as React from "react";
import Layout from "../../components/Layout";
import lang from "../../language.json";
import State from "../../interfaces/State";
import AlertMessage from "../../components/alert-message";
import { createEmsFdDeputy } from "../../lib/actions/ems-fd";
import { connect } from "react-redux";

interface Props {
  error: string;
  createEmsFdDeputy: (data: object) => void;
}

const CreateDeputyPage: React.FC<Props> = ({ error, createEmsFdDeputy }) => {
  const [name, setName] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createEmsFdDeputy({
      name,
    });
  }

  return (
    <Layout classes="mt-5">
      {error ? <AlertMessage message={error} type="warning" /> : null}

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">{lang.ems_fd.enter_name}</label>
          <input
            type="text"
            value={name}
            id="name"
            onChange={(e) => setName(e.target.value)}
            className="form-control text-light bg-dark border-secondary"
          />
        </div>
        <div className="mb-3 float-right">
          <a className="btn btn-danger" href="/ems-fd/deputies">
            {lang.global.cancel}
          </a>
          <button className="btn btn-primary ml-2" type="submit">
            {lang.ems_fd.create_ems}
          </button>
        </div>
      </form>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  error: state.ems_fd.error,
});

export default connect(mapToProps, { createEmsFdDeputy })(CreateDeputyPage);
