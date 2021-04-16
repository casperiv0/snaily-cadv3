import * as React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import lang from "../../../language.json";
import { Vehicle } from "types/Vehicle";
import { State } from "types/State";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { plateSearch } from "@actions/officer/OfficerActions";
import { ModalIds } from "types/ModalIds";
import { useModalOpen } from "@hooks/useModalOpen";
import { Item, Span } from "@components/Item";

export interface Search extends Vehicle {
  type: "plate";
}
interface Props {
  search: Search;
  plateSearch: (plate: string) => Promise<boolean>;
}

const PlateSearchModalC: React.FC<Props> = ({ search, plateSearch }) => {
  const [plate, setPlate] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.PlateSearch);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await plateSearch(plate);

    setLoading(false);
  }

  return (
    <Modal title={lang.global.plate_search} size="lg" id={ModalIds.PlateSearch}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="plate">
              {lang.officers.plate_or_vin}
            </label>
            <input
              ref={ref}
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
          <button type="submit" disabled={plate === "" || loading} className="btn btn-primary">
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

export const PlateSearchModal = connect(mapToProps, { plateSearch })(PlateSearchModalC);
