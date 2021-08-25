import * as React from "react";
import lang from "../../../language.json";
import { State } from "types/State";
import { Modal } from "components/Modal/Modal";
import { weaponSearch } from "actions/officer/OfficerActions";
import { connect } from "react-redux";
import { Weapon } from "types/Weapon";
import { AlertMessage } from "components/AlertMessage/AlertMessage";
import { ModalIds } from "types/ModalIds";
import { useModalOpen } from "../../../hooks/useModalOpen";
import { Item, Span } from "components/Item";

interface Search extends Weapon {
  type: "weapon";
}

interface Props {
  weaponSearch: (serialNumber: string) => Promise<boolean>;
  search: Search;
}

const WeaponSearchModalC: React.FC<Props> = ({ weaponSearch, search }) => {
  const [serialNumber, setSerialNumber] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.WeaponSearch);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await weaponSearch(serialNumber);

    setLoading(false);
  }

  return (
    <Modal title={lang.global.weapon_search} size="lg" id={ModalIds.WeaponSearch}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="serialNumber">
              {lang.citizen.weapon.serial_number}
            </label>
            <input
              ref={ref}
              id="serialNumber"
              type="weapon"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              required
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>

          {search !== null && search?.type === "weapon" ? (
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
              <AlertMessage message={{ msg: "not found", type: "warning" }} />
            )
          ) : null}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button
            disabled={serialNumber === "" || loading}
            type="submit"
            className="btn btn-primary"
          >
            {loading ? `${lang.global.loading}..` : lang.global.search}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  search: state.officers.search,
});

export const WeaponSearchModal = connect(mapToProps, { weaponSearch })(WeaponSearchModalC);
