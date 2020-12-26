import * as React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import Value from "../../../interfaces/Value";
import AlertMessage from "../../../components/alert-message";
import lang from "../../../language.json";
import { getValueById, updateValueById } from "../../../lib/actions/values";
import { connect } from "react-redux";

interface Props {
  value: Value;
  match: Match;
  error: string;
  getValueById: (path: string, id: string) => void;
  updateValueById: (path: string, id: string, data: { name: string }) => void;
}

const EditValuePage: React.FC<Props> = (props) => {
  const { match, error, getValueById, updateValueById } = props;
  const [value, setValue] = React.useState<string>("");
  const path = match.params.path;
  const id = match.params.id;

  React.useEffect(() => {
    getValueById(path, id);
  }, [getValueById, path, id]);

  React.useEffect(() => {
    if (props.value) {
      setValue(props.value?.name);
    }
  }, [props.value]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateValueById(path, id, { name: value });
  }

  if (props.value !== null && !props.value) {
    return (
      <AdminLayout>
        <AlertMessage type="danger" message={lang.admin.values.not_found_id} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {error ? <AlertMessage type="warning" message={error} dismissible /> : null}
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">{lang.admin.values[path].name}</label>
          <input
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="form-control bg-dark border-dark text-light"
            placeholder={`${lang.admin.values[path].name}..`}
          />
        </div>

        <div className="mb-3 float-right">
          <a className="btn btn-danger" href={`/admin/values/${path}`}>
            {lang.global.cancel}
          </a>
          <button className="btn btn-primary ml-2" type="submit">
            {lang.global.update}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  value: state.values.value,
  error: state.values.error,
});

export default connect(mapToProps, { getValueById, updateValueById })(EditValuePage);
