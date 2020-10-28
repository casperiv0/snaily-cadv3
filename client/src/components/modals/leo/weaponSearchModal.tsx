import * as React from "react";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import Modal, { XButton } from "../index";
import { weaponSearch } from "../../../lib/actions/officer";
import { connect } from "react-redux";
import Weapon from "../../../interfaces/Weapon";
import AlertMessage from "../../alert-message";
import { Item, Span } from "../../../pages/citizen/citizen-info";

interface Props {
  weaponSearch: (serialNumber: string) => void;
  search: Weapon;
}

const WeaponSearchModal: React.FC<Props> = ({ weaponSearch, search }) => {
  const [serialNumber, setSerialNumber] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    weaponSearch(serialNumber);
  }

  return (
    <Modal size="lg" id="weaponSearchModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.weapon_search}</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="serialNumber">{lang.citizen.weapon.serial_number}</label>
            <input
              id="serialNumber"
              type="weapon"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>

          {search !== null ? (
            search?.weapon ? (
              <div className="mt-2">
                <Item id="weapon">
                  <Span>{lang.global.weapon}: </Span>
                  {search.weapon}
                </Item>

                <Item id="owner">
                  <Span>{lang.record.owner}: </Span>
                  {search.owner}
                </Item>

                <Item id="serial_number">
                  <Span>{lang.citizen.weapon.serial_number}: </Span>
                  {search.serial_number}
                </Item>

                <Item id="status">
                  <Span>{lang.citizen.weapon.status}: </Span>
                  {search.status}
                </Item>
              </div>
            ) : (
              <AlertMessage type="warning" message="not found" />
            )
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">
            {lang.global.close}
          </button>
          <button disabled={serialNumber === ""} type="submit" className="btn btn-primary">
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

export default connect(mapToProps, { weaponSearch })(WeaponSearchModal);
