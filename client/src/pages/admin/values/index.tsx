import * as React from "react";
import { Link } from "react-router-dom";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import Value from "../../../interfaces/Value";
import lang from "../../../language.json";
import AdminLayout from "../../../components/admin/AdminLayout";
import ValuePaths from "../../../interfaces/ValuePaths";
import { connect } from "react-redux";
import { getDepartments } from "../../../lib/actions/officer";
import {
  getEthnicities,
  getGenders,
  getLegalStatuses,
  getVehicles,
  getWeapons,
  deleteValue,
} from "../../../lib/actions/values";
import Message from "../../../interfaces/Message";
import useDocTitle from "../../../hooks/useDocTitle";

interface Props {
  message: Message | null;
  values: any;
  match: Match;
  getDepartments: (type: "admin" | "leo") => void;
  getEthnicities: () => void;
  getGenders: () => void;
  getLegalStatuses: () => void;
  getVehicles: () => void;
  getWeapons: () => void;
  deleteValue: (id: string, path: ValuePaths) => void;
}

const paths: string[] = [
  "departments",
  "ethnicities",
  "genders",
  "legal-statuses",
  "vehicles",
  "weapons",
];

const Values: React.FC<Props> = ({
  message,
  values,
  match,
  getDepartments,
  getEthnicities,
  getGenders,
  getLegalStatuses,
  getVehicles,
  getWeapons,
  deleteValue,
}) => {
  const [filtered, setFiltered] = React.useState<any>([]);
  const [filter, setFilter] = React.useState<string>("");
  const path: ValuePaths = match.params.path;
  useDocTitle(lang.admin.values[path].manage);

  React.useEffect(() => {
    if (values[path]) {
      setFiltered(values[path]);
    }
  }, [values, path]);

  React.useEffect(() => {
    switch (path) {
      case "departments": {
        getDepartments("admin");
        break;
      }
      case "ethnicities": {
        getEthnicities();
        break;
      }
      case "genders": {
        getGenders();
        break;
      }
      case "legal-statuses": {
        getLegalStatuses();
        break;
      }
      case "vehicles": {
        getVehicles();
        break;
      }
      case "weapons": {
        getWeapons();
        break;
      }
      default:
    }
  }, [path, getDepartments, getEthnicities, getGenders, getLegalStatuses, getVehicles, getWeapons]);

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
        <AlertMessage message={{ msg: "Value not found", type: "danger" }} />
      </Layout>
    );
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage message={message} dismissible /> : null}

      <header className="d-flex justify-content-between">
        <h4>{lang.admin.values[path].manage}</h4>

        <div>
          <Link className="btn btn-primary" to={`/admin/values/${path}/add`}>
            {lang.admin.values[path].add}
          </Link>
        </div>
      </header>

      <ul className="list-group mt-3">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={lang.global.search}
        />
        {!values[path]?.[0] ? (
          <AlertMessage message={{ msg: lang.admin.values[path].none, type: "warning" }} />
        ) : (
          filtered
            .sort((a: Value, _b: Value) => a?.defaults === "1")
            .sort((a: Value, _b: Value) => a?.defaults === "1")
            .map((value: Value, idx: number) => {
              return (
                <li
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between"
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
                        <Link
                          className="btn btn-success ms-2"
                          to={`/admin/values/${path}/${value.id}/edit`}
                        >
                          {lang.global.edit}
                        </Link>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })
        )}
      </ul>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  values: state.values,
  message: state.global.message,
});

export default connect(mapToProps, {
  getDepartments,
  getEthnicities,
  getGenders,
  getLegalStatuses,
  getVehicles,
  getWeapons,
  deleteValue,
})(Values);
