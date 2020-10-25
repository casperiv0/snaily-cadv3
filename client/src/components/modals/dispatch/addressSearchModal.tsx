import * as React from "react";
import lang from "../../../language.json";
import Citizen from "../../../interfaces/Citizen";
import Modal, { XButton } from "../index";
import { searchAddress } from "../../../lib/actions/dispatch";
import { connect } from "react-redux";
import State from "../../../interfaces/State";
import AlertMessage from "../../alert-message";
import { Item, Span } from "../../../pages/citizen/citizen-info";

interface Props {
  search: Citizen[];
  searchAddress: (address: string) => void;
}

const CreateBoloModal: React.FC<Props> = ({ search, searchAddress }) => {
  const [address, setAddress] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    searchAddress(address);
  }

  return (
    <Modal size="lg" id="addressSearchModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.address_search}</h5>
        <XButton ref={btnRef}></XButton>
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="address">{lang.dispatch.enter_address}</label>
            <input
              value={address}
              className="form-control bg-secondary border-secondary text-light"
              id="address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mt-3">
            {search !== null ? (
              !search[0] ? (
                <AlertMessage
                  type="warning"
                  message={lang.dispatch.add_not_found}
                />
              ) : (
                search.map((citizen: Citizen, idx: number) => {
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
                    </li>
                  );
                })
              )
            ) : null}
          </div>
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
            disabled={address === ""}
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
  search: state.dispatch.search,
});

export default connect(mapToProps, { searchAddress })(CreateBoloModal);
