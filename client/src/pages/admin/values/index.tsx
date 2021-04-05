import * as React from "react";
import { connect } from "react-redux";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import Value from "../../../interfaces/Value";
import lang from "../../../language.json";
import AdminLayout from "../../../components/admin/AdminLayout";
import ValuePaths from "../../../interfaces/ValuePaths";
import { deleteValue, getValuesByPath } from "../../../lib/actions/values";
import useDocTitle from "../../../hooks/useDocTitle";
import Loader from "../../../components/loader";
import { useObserver } from "../../../hooks/useObserver";
import AddValueModal from "../../../components/modals/admin/values/AddValueModal";
import { ModalIds } from "../../../lib/types";
import EditValueModal from "../../../components/modals/admin/values/EditValueModal";

interface Props {
  values: any;
  match: Match;
  loading: boolean;
  deleteValue: (id: string, path: ValuePaths) => void;
  getValuesByPath: (path: ValuePaths) => void;
}

const paths: string[] = [
  "departments",
  "ethnicities",
  "genders",
  "legal-statuses",
  "vehicles",
  "weapons",
  "call-types",
];

const Values: React.FC<Props> = ({
  values,
  match,
  loading,

  deleteValue,
  getValuesByPath,
}) => {
  const [tempValue, setTempValue] = React.useState<Value | null>(null);
  const [filtered, setFiltered] = React.useState<any>([]);
  const [filter, setFilter] = React.useState<string>("");
  const path: ValuePaths = match.params.path;
  const { ref, length } = useObserver<Value>(
    values[path].sort((a: Value, _b: Value) => a?.defaults === "1"),
  );
  useDocTitle(lang.admin.values[path].manage);

  React.useEffect(() => {
    if (values[path]) {
      setFiltered(values[path]);
    }
  }, [values, path]);

  React.useEffect(() => {
    getValuesByPath(path);
  }, [path, getValuesByPath]);

  function handleDelete(id: string) {
    deleteValue(id, path);
  }

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredValues = values[path].filter((value: Value) =>
      value.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredValues);
  }

  if (!paths.includes(path)) {
    return (
      <Layout>
        <AlertMessage message={{ msg: window.lang.admin.value_not_found, type: "danger" }} />
      </Layout>
    );
  }

  return (
    <AdminLayout>
      <header className="d-flex justify-content-between">
        <div>
          <h4 style={{ marginBottom: "0.2rem" }}>{lang.admin.values[path].manage}</h4>
          <p style={{ marginTop: "0" }}>
            {window.lang.admin.total_items}: {values[path]?.length ?? 0}
          </p>
        </div>

        <div>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.AddValue}`}
          >
            {lang.admin.values[path].add}
          </button>
        </div>
      </header>

      <div className="mt-3">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />
        {!values[path]?.[0] ? (
          <AlertMessage message={{ msg: lang.admin.values[path].none, type: "warning" }} />
        ) : loading ? (
          <Loader />
        ) : (
          <ul className="list-group">
            {filtered.slice(0, length).map((value: Value, idx: number) => {
              return (
                <li
                  ref={ref}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
                  key={idx}
                  id={`${idx}`}
                >
                  <div>
                    {++idx} | {value.name}
                  </div>

                  <div>
                    {value?.defaults && value.defaults === "0" ? (
                      <>
                        <button onClick={() => handleDelete(value.id)} className="btn btn-danger">
                          {lang.global.delete}
                        </button>
                        <button
                          className="btn btn-success ms-2"
                          data-bs-target={`#${ModalIds.EditValue}`}
                          data-bs-toggle="modal"
                          onClick={() => setTempValue(value)}
                        >
                          {lang.global.edit}
                        </button>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <EditValueModal value={tempValue} path={path} />
      <AddValueModal />
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  values: state.values,
  loading: state.values.loading,
});

export default connect(mapToProps, {
  deleteValue,
  getValuesByPath,
})(Values);
