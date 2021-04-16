import * as React from "react";
import { connect } from "react-redux";
import lang from "src/language.json";
import { Citizen } from "types/Citizen";
import { Modal } from "@components/Modal/Modal";
import { addressSearch } from "@actions/dispatch/DispatchActions";
import { State } from "types/State";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { ModalIds } from "types/ModalIds";
import { useModalOpen } from "../../../hooks/useModalOpen";
import { Item, Span } from "@components/Item";

interface Props {
  search: Citizen[];
  addressSearch: (address: string) => Promise<boolean>;
}

const AddressSearchModalC: React.FC<Props> = ({ search, addressSearch }) => {
  const [address, setAddress] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.AddressSearch);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await addressSearch(address);

    setLoading(false);
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
                      className="list-group-item bg-secondary border-dark d-flex justify-content-between text-white"
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
                          type="button"
                          data-bs-toggle="modal"
                          data-bs-target={`#${ModalIds.NameSearch}`}
                          className="btn btn-primary"
                        >
                          {lang.dispatch.open_name_search}
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
          <button type="submit" disabled={address === "" || loading} className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.search}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  search: state.dispatch.search,
});

export const AddressSearchModal = connect(mapToProps, { addressSearch })(AddressSearchModalC);
