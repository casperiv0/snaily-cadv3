import * as React from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import Value from "../../../interfaces/Value";
import AlertMessage from "../../../components/alert-message";
import lang from "../../../language.json";
import { getValueById, updateValueById } from "../../../lib/actions/values";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import useDocTitle from "../../../hooks/useDocTitle";

interface Props {
  value: Value | null;
  match: Match;
  getValueById: (path: string, id: string) => void;
  updateValueById: (path: string, id: string, data: { name: string }) => Promise<boolean>;
}

const EditValuePage: React.FC<Props> = (props) => {
  const { match, getValueById, updateValueById } = props;
  const [value, setValue] = React.useState<string>("");
  const history = useHistory();
  const path = match.params.path;
  const id = match.params.id;
  useDocTitle(lang.admin.values[path].manage);

  React.useEffect(() => {
    getValueById(path, id);
  }, [getValueById, path, id]);

  React.useEffect(() => {
    if (props.value) {
      setValue(props.value?.name);
    }
  }, [props.value]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const updated = await updateValueById(path, id, { name: value });

    if (updated === true) {
      history.push(`/admin/values/${path}`);
    }
  }

  if (props.value !== null && !props.value) {
    return (
      <AdminLayout>
        <AlertMessage message={{ msg: lang.admin.values.not_found_id, type: "danger" }} />
      </AdminLayout>
    );
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
            {lang.global.update}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  value: state.values.value,
});

export default connect(mapToProps, { getValueById, updateValueById })(EditValuePage);
