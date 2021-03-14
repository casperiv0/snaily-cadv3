import * as React from "react";
import { Link, useHistory } from "react-router-dom";
import Layout from "../../components/Layout";
import lang from "../../language.json";
import { createEmsFdDeputy } from "../../lib/actions/ems-fd";
import { connect } from "react-redux";
import useDocTitle from "../../hooks/useDocTitle";

interface Props {
  createEmsFdDeputy: (data: object) => Promise<boolean | undefined>;
}

const CreateDeputyPage: React.FC<Props> = ({ createEmsFdDeputy }) => {
  const [name, setName] = React.useState<string>("");
  const history = useHistory();
  useDocTitle("Create EMS/FD Deputy");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await createEmsFdDeputy({
      name,
    });

    if (created) {
      history.push("/ems-fd/deputies");
    }
  }

  return (
    <Layout classes="mt-5">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            {lang.ems_fd.enter_name}
          </label>
          <input
            type="text"
            value={name}
            id="name"
            onChange={(e) => setName(e.target.value)}
            className="form-control text-light bg-dark border-secondary"
          />
        </div>
        <div className="mb-3 float-end">
          <Link className="btn btn-danger" to="/ems-fd/deputies">
            {lang.global.cancel}
          </Link>
          <button className="btn btn-primary ms-2" type="submit">
            {lang.ems_fd.create_ems}
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default connect(null, { createEmsFdDeputy })(CreateDeputyPage);
