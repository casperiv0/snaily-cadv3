import * as React from "react";
import Modal, { XButton } from "..";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import AlertMessage from "../../alert-message";
import Citizen from "../../../interfaces/Citizen";
import Weapon from "../../../interfaces/Weapon";
import Vehicle from "../../../interfaces/Vehicle";
import { searchName } from "../../../lib/actions/officer";
import {
  Warrant,
  Ticket,
  ArrestReport,
  WrittenWarning,
} from "../../../interfaces/Record";
import { connect } from "react-redux";
import { Item, Span } from "../../../pages/citizen/citizen-info";
import SERVER_URL from "../../../config";
import citizen from "../../../pages/citizen";

interface NameSearch {
  citizen: Citizen;
  warrants: Warrant[];
  tickets: Ticket[];
  arrestReports: ArrestReport[];
  writtenWarnings: WrittenWarning[];
  weapons: Weapon[];
  vehicles: Vehicle[];
}

interface Props {
  search: NameSearch;
  searchName: (name: string) => void;
}

const NameSearchModal: React.FC<Props> = ({ search, searchName }) => {
  const [name, setName] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    searchName(name);
  }

  return (
    <Modal size="xl" id="nameSearchModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.name_search}</h5>
        <XButton ref={btnRef}></XButton>
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="name">{lang.global.name}</label>
            <input
              type="search"
              className="form-control bg-secondary border-secondary text-light"
              id="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {search !== null ? (
            search?.citizen ? (
              <div className="mt-3">
                <div className="row">
                  <div className="col-md-6">
                    <h5>{lang.admin.cad_settings.general_info}</h5>

                    <div className="list-group" id="general_info">
                      <Item id="image_id">
                        <img
                          className="object-fit-center rounded-circle mb-1"
                          style={{ width: "100px", height: "100px" }}
                          src={`${SERVER_URL}/static/citizen-images/${search.citizen.image_id}`}
                        />
                      </Item>

                      <Item id="full_name">
                        <Span>{lang.citizen.full_name}: </Span>
                        {search.citizen.full_name}
                      </Item>

                      <Item id="birth">
                        <Span>{lang.citizen.date_of_birth}: </Span>
                        {search.citizen.birth}
                      </Item>

                      <Item id="gender">
                        <Span>{lang.citizen.gender}: </Span>
                        {search.citizen.gender}
                      </Item>

                      <Item id="ethnicity">
                        <Span>{lang.citizen.ethnicity}: </Span>
                        {search.citizen.ethnicity}
                      </Item>

                      <Item id="hair_color">
                        <Span>{lang.citizen.hair_color}: </Span>
                        {search.citizen.hair_color}
                      </Item>

                      <Item id="eye_color">
                        <Span>{lang.citizen.eye_color}: </Span>
                        {search.citizen.eye_color}
                      </Item>

                      <Item id="address">
                        <Span>{lang.citizen.address}: </Span>
                        {search.citizen.address}
                      </Item>

                      <Item id="height_weight">
                        <Span>{lang.citizen.hei_wei}: </Span>
                        {search.citizen.height} / {search.citizen.weight}
                      </Item>

                      <Item id="employer">
                        <Span>{lang.citizen.employer}: </Span>
                        {search.citizen.business}
                      </Item>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <AlertMessage message={lang.record.no_citizen} type="warning" />
            )
          ) : null}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            {lang.global.close}
          </button>
          <button
            type="submit"
            disabled={name === ""}
            className="btn btn-primary"
          >
            {lang.global.search}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  search: state.officers.search,
});

export default connect(mapToProps, { searchName })(NameSearchModal);
