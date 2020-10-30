import * as React from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Citizen from "../../../../interfaces/Citizen";
import AlertMessage from "../../../../components/alert-message";
import lang from "../../../../language.json";
import State from "../../../../interfaces/State";
import { connect } from "react-redux";
import { getAllCitizens } from "../../../../lib/actions/admin";
import citizenInfo, { Item, Span } from "../../../citizen/citizen-info";

interface Props {
  message: string;
  citizens: Citizen[];
  getAllCitizens: () => void;
}

const ManageCitizensPage: React.FC<Props> = ({ message, citizens, getAllCitizens }) => {
  const [filter, setFilter] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<any>([]);

  React.useEffect(() => {
    getAllCitizens();
  }, [getAllCitizens]);

  React.useEffect(() => {
    if (citizens[0]) {
      setFiltered(citizens);
    }
  }, [citizens]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = citizens.filter((citizen: Citizen) =>
      citizen.full_name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredItems);
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage type="success" message={message} /> : null}

      <ul className="list-group">
        <label htmlFor="search">{lang.admin.filter_by_name}</label>
        <input
          className="form-control bg-dark border-secondary text-light mb-2"
          type="search"
          value={filter}
          onChange={handleSearch}
        />

        {!citizens[0] ? (
          <AlertMessage type="warning" message={lang.citizen.no_citizens_cad} />
        ) : !filtered[0] ? (
          <AlertMessage type="warning" message={lang.citizen.citizen_not_found_by_name} />
        ) : (
          filtered.map((citizen: Citizen, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between"
              >
                <div>
                  <h5>
                    {++idx} | {citizen.full_name}
                  </h5>

                  <div className="collapse" id={`citizen_info_${citizen.id}`}>
                    <Item id="full_name">
                      <Span>{lang.citizen.full_name}: </Span>
                      {citizen.full_name}
                    </Item>
                    <Item id="gender">
                      <Span>{lang.citizen.gender}: </Span>
                      {citizen.gender}
                    </Item>
                    <Item id="ethnicity">
                      <Span>{lang.citizen.ethnicity}: </Span>
                      {citizen.ethnicity}
                    </Item>
                    <Item id="hair_color">
                      <Span>{lang.citizen.hair_color}: </Span>
                      {citizen.hair_color}
                    </Item>
                    <Item id="eye_color">
                      <Span>{lang.citizen.eye_color}: </Span>
                      {citizen.eye_color}
                    </Item>
                    <Item id="address">
                      <Span>{lang.citizen.address}: </Span>
                      {citizen.address}
                    </Item>
                    <Item id="height">
                      <Span>{lang.citizen.height}: </Span>
                      {citizen.height}
                    </Item>
                    <Item id="weight">
                      <Span>{lang.citizen.weight}: </Span>
                      {citizen.weight}
                    </Item>
                    <Item id="business">
                      <Span>{lang.citizen.employer}: </Span>
                      {citizen.business}
                    </Item>

                    <div className="d-flex mt-2">
                      <a
                        className="btn btn-success mr-2"
                        href={`/admin/manage/citizens/edit/${citizen.id}`}
                      >
                        {lang.citizen.edit_citizen}
                      </a>
                      <button className="btn btn-danger">{lang.global.delete}</button>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-toggle="collapse"
                    data-target={`#citizen_info_${citizen.id}`}
                    aria-expanded="false"
                    aria-controls={`citizen_info_${citizen.id}`}
                  >
                    {lang.admin.toggle_info}
                  </button>
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
  citizens: state.admin.citizens,
});

export default connect(mapToProps, { getAllCitizens })(ManageCitizensPage);
