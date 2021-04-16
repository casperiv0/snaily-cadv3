import { createCall } from "@actions/calls/CallActions";
import { CallTypes } from "@actions/calls/CallTypes";
import { getValuesByPath } from "@actions/values/ValuesActions";
import { Modal } from "@components/Modal/Modal";
import { Select, SelectValue } from "@components/Select/Select";
import { useModalOpen } from "@hooks/useModalOpen";
import { modal, RequestData } from "@lib/utils";
import { useRouter } from "next/router";
import * as React from "react";
import { connect } from "react-redux";
import { ModalIds } from "types/ModalIds";
import { Nullable, State } from "types/State";
import { Value } from "types/Value";
import { ValuePaths } from "types/ValuePaths";
import lang from "../../language.json";

interface Props {
  callTypes: Value[];
  createCall: (type: CallTypes, data: RequestData) => Promise<boolean>;
  getValuesByPath: (path: ValuePaths) => void;
}

const Create911ModalC = ({ callTypes, getValuesByPath, createCall }: Props) => {
  const [description, setDescription] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [caller, setCaller] = React.useState<string>("");
  const [type, setType] = React.useState<Nullable<SelectValue>>(null);
  const router = useRouter();
  const ref = useModalOpen<HTMLTextAreaElement>(ModalIds.Create911);

  React.useEffect(() => {
    getValuesByPath("call-types");
  }, [getValuesByPath]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const created = await createCall("911", {
      description,
      location,
      caller,
      type: type?.value,
    });

    if (created === true) {
      modal(ModalIds.Create911)?.hide();

      setDescription("");
      setLocation("");
      setCaller("");
      setType(null);
    }
  }

  return (
    <Modal size="lg" title={lang.citizen.call_911} id={ModalIds.Create911}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="911_description">
              {lang.dispatch.call_desc}
            </label>
            <textarea
              ref={ref}
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

            {["/dispatch", "/dispatch/map"].includes(router.pathname) ? (
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

export const Create911Modal = connect(mapToProps, { createCall, getValuesByPath })(Create911ModalC);
