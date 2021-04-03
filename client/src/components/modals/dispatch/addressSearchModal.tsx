import * as React from "react";
import lang from "../../../language.json";
import Citizen from "../../../interfaces/Citizen";
import Modal from "../index";
import { searchAddress } from "../../../lib/actions/dispatch";
import { connect } from "react-redux";
import State from "../../../interfaces/State";
import AlertMessage from "../../alert-message";
import { Item, Span } from "../../../pages/citizen/citizen-info";
import { ModalIds } from "../../../lib/types";
import { useModalOpen } from "../../../hooks/useModalOpen";

interface Props {
  search: Citizen[];
  searchAddress: (address: string) => void;
}

const CreateBoloModal: React.FC<Props> = ({ search, searchAddress }) => {
  const [address, setAddress] = React.useState("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.AddressSearch);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    searchAddress(address);
  }

  return (
    <Modal title={lang.global.address_search} size="lg" id={ModalIds.AddressSearch}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="address">
              {lang.dispatch.enter_address}
            </label>
            <input
              ref={ref}
              value={address}
              className="form-control bg-secondary border-secondary text-light"
              id="address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mt-3">
            {search !== null ? (
              !search[0] ? (
                <AlertMessage message={{ msg: lang.dispatch.add_not_found, type: "warning" }} />
              ) : (
                search?.map((citizen: Citizen, idx: number) => {
                  return (
                    <li
                      key={idx}
                      className="list-group-item bg-secondary border-dark d-flex justify-content-between"
                    >
                      <div>
                        <Item id="address">
                          <Span>{citizen.address}</Span>
                        </Item>

                        <Item id="owner">
                          <Span>{lang.record.owner}: </Span>
                          {citizen.full_name}
                        </Item>
                      </div>

                      <div>
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#nameSearchModal"
                          className="btn btn-primary"
                        >
                          {window.lang.dispatch.open_name_search}
                        </button>
                      </div>
                    </li>
                  );
                })
              )
            ) : null}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" disabled={address === ""} className="btn btn-primary">
            {lang.global.search}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  search: state.dispatch.search,
});

export default connect(mapToProps, { searchAddress })(CreateBoloModal);
