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

const PlateSearchModal: React.FC<Props> = ({ search, searchName }) => {
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
            search.citizen ? (
              <div className="mt-3"></div>
            ) : (
              <AlertMessage message={lang.record.no_plate} type="warning" />
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

export default connect(mapToProps, { searchName })(PlateSearchModal);
