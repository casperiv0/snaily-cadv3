import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import AdminLayout from "../../../../components/admin/AdminLayout";
import lang from "../../../../language.json";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { getAllUnits } from "../../../../lib/actions/admin";
import { Item, Span } from "../../../citizen/citizen-info";
import Officer from "../../../../interfaces/Officer";
import useDocTitle from "../../../../hooks/useDocTitle";
import Loader from "../../../../components/loader";
import Deputy from "../../../../interfaces/Deputy";

interface Props {
  officers: Officer[];
  ems_fd: Deputy[];
  loading: boolean;
  getAllUnits: () => void;
  deleteCompanyById: (id: string) => void;
}

const SupervisorPanelPage: React.FC<Props> = ({ officers, ems_fd, loading, getAllUnits }) => {
  const [filter, setFilter] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<(Officer | Deputy)[]>(officers);
  useDocTitle(window.lang.admin.supervisor_panel);

  React.useEffect(() => {
    getAllUnits();
  }, [getAllUnits]);

  React.useEffect(() => {
    setFiltered([...officers, ...ems_fd]);
  }, [officers, ems_fd]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = [...officers, ...ems_fd].filter((unit) => {
      const name = "officer_name" in unit ? unit.officer_name : unit.name;

      return name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFiltered(filteredItems);
  }

  return (
    <AdminLayout>
      <div>
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-secondary mb-2 text-light"
          placeholder={`${lang.global.search}...`}
        />
        {![...officers, ...ems_fd][0] ? (
          <AlertMessage message={{ msg: window.lang.admin.no_officers, type: "warning" }} />
        ) : !filtered[0] ? (
          <AlertMessage
            message={{ msg: window.lang.admin.no_officer_with_name, type: "warning" }}
          />
        ) : loading ? (
          <Loader />
        ) : (
          <ul className="list-group">
            {filtered.map((unit: Officer | Deputy, idx: number) => {
              return (
                <li
                  key={idx}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
                >
                  <div>
                    {++idx} |{" "}
                    {"officer_name" in unit
                      ? `${window.lang.dispatch.leo}: ${unit.callsign} ${unit.officer_name}`
                      : `${window.lang.dispatch.ems_fd}: ${unit.name}`}{" "}
                    <div className="mt-2">
                      {"officer_name" in unit ? (
                        <Item id="name">
                          <Span>{lang.dispatch.officer_dept}: </Span>
                          {unit.officer_dept}
                        </Item>
                      ) : null}

                      {"callsign" in unit ? (
                        <Item id="callsign">
                          <Span>{window.lang.officers.callsign}: </Span>
                          {unit.callsign || window.lang.global.none_set}
                        </Item>
                      ) : null}

                      {"rank" in unit ? (
                        <Item id="rank">
                          <Span>{window.lang.global.rank}: </Span>
                          {unit.rank || window.lang.global.none_set}
                        </Item>
                      ) : null}
                      <Item id="status">
                        <Span>{window.lang.officers.on_off_duty}: </Span>
                        {unit.status}
                      </Item>
                      <Item id="status2">
                        <Span>{window.lang.dispatch.status}: </Span>
                        {unit.status2}
                      </Item>
                    </div>
                  </div>

                  <div>
                    <Link className="btn btn-success" to={`units/${unit.id}`}>
                      {window.lang.global.manage}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  officers: state.admin.officers,
  loading: state.admin.loading,
  ems_fd: state.admin.ems_fd,
});

export default connect(mapToProps, { getAllUnits })(SupervisorPanelPage);
