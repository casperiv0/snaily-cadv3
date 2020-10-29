import * as React from "react";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import Match from "../../../interfaces/Match";
import State from "../../../interfaces/State";
import Value from "../../../interfaces/Value";
import lang from "../../../language.json";
import AdminLayout from "../../../components/admin/AdminLayout";
import { connect } from "react-redux";
import { getDepartments } from "../../../lib/actions/officer";
import {
  getEthnicities,
  getGenders,
  getLegalStatuses,
  getVehicles,
  getWeapons,
} from "../../../lib/actions/values";
import { useHistory } from "react-router-dom";

interface Props {
  message: string;
  values: any;
  match: Match;
  getDepartments: (type: "admin" | "leo") => void;
  getEthnicities: () => void;
  getGenders: () => void;
  getLegalStatuses: () => void;
  getVehicles: () => void;
  getWeapons: () => void;
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
}) => {
  const [filtered, setFiltered] = React.useState<any>([]);
  const [filter, setFilter] = React.useState<string>("");
  const history = useHistory();
  const path:
    | "genders"
    | "ethnicities"
    | "departments"
    | "legal-statuses"
    | "vehicles"
    | "weapons" = match.params.path;

  React.useEffect(() => {
    if (values[path]) {
      setFiltered(values[path]);
    }
  }, [values]);

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
  }, []);

  function handleDelete(id: string) {}

  function handleFilter(e: any) {
    setFilter(e.target.value);

    const filteredValues = values[path].filter((value: Value) =>
      value.name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredValues);
  }

  if (!paths.includes(path)) {
    return (
      <Layout>
        <AlertMessage type="danger" message="Value not found" />
      </Layout>
    );
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage message={message} type="success" /> : null}

      <header className="d-flex justify-content-between">
        <h4>{lang.admin.values[path].manage}</h4>

        <div>
          <a className="btn btn-primary" href={`/admin/values/${path}/add`}>
            {lang.admin.values[path].add}
          </a>
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
        {!values[path] ? (
          <AlertMessage type="warning" message={lang.admin.values[path].none} />
        ) : (
          filtered
            .sort((a: Value, _b: Value) => a?.default_car === "1")
            .sort((a: Value, _b: Value) => a?.default_weapon === "1")
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
                    {value?.default_car && value.default_car !== "1" ? (
                      <button onClick={() => handleDelete(value.id)} className="btn btn-danger">
                        {lang.global.delete}
                      </button>
                    ) : null}

                    {value?.default_weapon && value.default_weapon !== "1" ? (
                      <button onClick={() => handleDelete(value.id)} className="btn btn-danger">
                        {lang.global.delete}
                      </button>
                    ) : null}

                    {!value?.default_weapon && !value.default_car ? (
                      <button onClick={() => handleDelete(value.id)} className="btn btn-danger">
                        {lang.global.delete}
                      </button>
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
})(Values);
