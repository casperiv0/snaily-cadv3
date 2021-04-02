import * as React from "react";
import Modal from "./index";
import lang from "../../language.json";
import { create911Call } from "../../lib/actions/911-calls";
import { connect } from "react-redux";
import { useLocation } from "react-router";
import Select, { Value as SelectValue } from "../select";
import State from "../../interfaces/State";
import Value from "../../interfaces/Value";
import { getCallTypes } from "../../lib/actions/values";
import { modal } from "../../lib/functions";
import { ModalIds } from "../../lib/types";

interface Props {
  callTypes: Value[];
  getCallTypes: () => void;
  create911Call: (data: object) => Promise<boolean>;
}

const Call911Modal: React.FC<Props> = ({ callTypes, getCallTypes, create911Call }) => {
  const [description, setDescription] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [caller, setCaller] = React.useState<string>("");
  const [type, setType] = React.useState<SelectValue | null>(null);
  const locationPath = useLocation();

  React.useEffect(() => {
    getCallTypes();
  }, [getCallTypes]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await create911Call({
      description,
      location,
      caller,
      type: type?.value,
    });

    if (created === true) {
      modal(ModalIds.Call911).hide();

      setDescription("");
      setLocation("");
      setCaller("");
    }
  }

  return (
    <Modal title={lang.citizen.call_911} size="lg" id={ModalIds.Call911}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="911_description">
              {lang.dispatch.call_desc}
            </label>
            <textarea
              cols={30}
              rows={5}
              value={description}
              id="911_description"
              onChange={(e) => setDescription(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-6">
              <label className="form-label" htmlFor="911_caller">
                {lang.dispatch.caller_name}
              </label>
              <input
                type="text"
                value={caller}
                id="911_caller"
                onChange={(e) => setCaller(e.target.value)}
                className="form-control bg-secondary border-secondary text-light"
              />
            </div>

            <div className="col-6">
              <label className="form-label" htmlFor="911_location">
                {lang.dispatch.caller_location}
              </label>
              <input
                type="text"
                value={location}
                id="911_location"
                onChange={(e) => setLocation(e.target.value)}
                className="form-control bg-secondary border-secondary text-light"
              />
            </div>

            {locationPath.pathname === "/dispatch" ? (
              <div className="mt-3 mb-3">
                <label className="form-label">{lang.admin.values["call-types"].name}</label>
                <Select
                  value={type}
                  onChange={setType}
                  isMulti={false}
                  isClearable={false}
                  options={callTypes.map((type) => ({
                    label: type.name,
                    value: type.name,
                  }))}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.calls.call}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  callTypes: state.values["call-types"],
});

export default connect(mapToProps, { create911Call, getCallTypes })(Call911Modal);
