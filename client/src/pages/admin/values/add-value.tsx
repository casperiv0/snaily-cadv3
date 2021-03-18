import * as React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import lang from "../../../language.json";
import Match from "../../../interfaces/Match";
import { addValue } from "../../../lib/actions/values";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";

interface Props {
  match: Match;
  addValue: (path: string, data: { name: string }) => Promise<boolean>;
}

const AddValuePage: React.FC<Props> = ({ match, addValue }) => {
  const path = match.params.path;
  useDocTitle(lang.admin.values[path].add);
  const [value, setValue] = React.useState<string>("");
  const history = useHistory();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const added = await addValue(path, {
      name: value,
    });

    if (added === true) {
      history.push(`/admin/values/${path}`);
    }
  }

  return (
    <AdminLayout>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            {lang.admin.values[path].name}
          </label>
          <input
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="form-control bg-dark border-dark text-light"
            placeholder={`${lang.admin.values[path].name}..`}
          />
        </div>

        <div className="mb-3 float-end">
          <Link className="btn btn-danger" to={`/admin/values/${path}`}>
            {lang.global.cancel}
          </Link>
          <button className="btn btn-primary ms-2" type="submit">
            {lang.admin.values[path].add}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default connect(null, { addValue })(AddValuePage);
