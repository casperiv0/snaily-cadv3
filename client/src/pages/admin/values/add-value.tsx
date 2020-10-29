import * as React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import lang from "../../../language.json";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import AlertMessage from "../../../components/alert-message";
import { addValue } from "../../../lib/actions/values";
import { connect } from "react-redux";

interface Props {
  match: Match;
  error: string;
  addValue: (path: string, data: { name: string }) => void;
}

const AddValuePage: React.FC<Props> = ({ error, match, addValue }) => {
  const path = match.params.path;
  const [value, setValue] = React.useState<string>("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    addValue(path, {
      name: value,
    });
  }

  return (
    <AdminLayout>
      {error ? <AlertMessage type="warning" message={error} /> : null}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">{lang.admin.values[path].name}</label>
          <input
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="form-control bg-dark border-dark text-light"
            placeholder={`${lang.admin.values[path].name}..`}
          />
        </div>

        <div className="form-group float-right">
          <a className="btn btn-danger" href={`/admin/values/${path}`}>
            {lang.global.cancel}
          </a>
          <button className="btn btn-primary ml-2" type="submit">
            {lang.admin.values[path].add}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  error: state.values.error,
});

export default connect(mapToProps, { addValue })(AddValuePage);
