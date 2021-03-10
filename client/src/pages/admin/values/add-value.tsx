import * as React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import lang from "../../../language.json";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import AlertMessage from "../../../components/alert-message";
import { addValue } from "../../../lib/actions/values";
import { connect } from "react-redux";
import Message from "../../../interfaces/Message";
import { Link } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";

interface Props {
  match: Match;
  message: Message | null;
  addValue: (path: string, data: { name: string }) => void;
}

const AddValuePage: React.FC<Props> = ({ message, match, addValue }) => {
  const path = match.params.path;
  useDocTitle(lang.admin.values[path].add);
  const [value, setValue] = React.useState<string>("");
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    addValue(path, {
      name: value,
    });
  }

  return (
    <AdminLayout>
      <AlertMessage message={message} dismissible />
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

const mapToProps = (state: State) => ({
  message: state.global.message,
});

export default connect(mapToProps, { addValue })(AddValuePage);
