import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import Vehicle from "../../../interfaces/Vehicle";
import State from "../../../interfaces/State";
import AlertMessage from "../../alert-message";
import { searchPlate } from "../../../lib/actions/officer";
import { connect } from "react-redux";
import { Item, Span } from "../../../pages/citizen/citizen-info";

export interface Search extends Vehicle {
  type: "plate";
}
interface Props {
  search: Search;
  searchPlate: (plate: string) => void;
}

const PlateSearchModal: React.FC<Props> = ({ search, searchPlate }) => {
  const [plate, setPlate] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    searchPlate(plate);
  }

  return (
    <Modal size="lg" id="plateSearchModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.plate_search}</h5>
        <XButton ref={btnRef}></XButton>
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="plate">
              Enter Plate or VIN number
            </label>
            <input
              type="search"
              className="form-control bg-secondary border-secondary text-light"
              id="plate"
              onChange={(e) => setPlate(e.target.value)}
            />
          </div>

          {search !== null && search?.type === "plate" ? (
            search?.plate ? (
              <div className="mt-3">
                <Item id="plate">
                  <Span>{lang.global.plate}: </Span>
                  {search.plate.toUpperCase()}
                </Item>

                <Item id="vehicle">
                  <Span>{lang.global.vehicle}: </Span>
                  {search.vehicle}
                </Item>

                <Item id="owner">
                  <Span>{lang.record.owner}: </Span>
                  {search.owner}
                </Item>

                <Item id="vin_number">
                  <Span>{lang.record.vin_number}: </Span>
                  {search.vin_number}
                </Item>

                <Item id="color">
                  <Span>{lang.global.color}: </Span>
                  {search.color}
                </Item>

                <Item id="in_status">
                  <Span>{lang.citizen.vehicle.status}: </Span>
                  {search.in_status}
                </Item>

                <Item id="company">
                  <Span>{lang.citizen.weapon.company}: </Span>
                  {search.company}
                </Item>
              </div>
            ) : (
              <AlertMessage message={{ msg: lang.record.no_plate, type: "warning" }} />
            )
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" disabled={plate === ""} className="btn btn-primary">
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

export default connect(mapToProps, { searchPlate })(PlateSearchModal);
