import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import Officer from "../../../interfaces/Officer";
import State from "../../../interfaces/State";
import { connect } from "react-redux";
import { getMyOfficers, setStatus } from "../../../lib/actions/officer";

interface Props {
  officers: Officer[];
  getMyOfficers: () => void;
  setStatus: (id: string, status: "on-duty" | "off-duty", status2: string) => void;
}

const SelectOfficerModal: React.FC<Props> = ({ officers, getMyOfficers, setStatus }) => {
  const [selected, setSelected] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    getMyOfficers();
  }, [getMyOfficers]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setStatus(selected, "on-duty", "10-8");

    btnRef.current?.click();
  }

  return (
    <Modal id="selectOfficerModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.officers.select_officer_msg}</h5>
        <XButton ref={btnRef} />
      </div>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="officer">
              {lang.officers.select_officer}
            </label>

            {!officers[0] ? (
              <p className="font-weight-bold">{lang.officers.no_officers}</p>
            ) : (
              <select
                className="form-control bg-secondary border-secondary text-light"
                id="officer"
                onChange={(e) => setSelected(e.target.value)}
                value={selected}
              >
                <option value="">{lang.officers.select_officer2}</option>
                {officers.map((officer: Officer, idx: number) => {
                  return (
                    <option key={idx} value={officer.id}>
                      {officer.officer_name}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button disabled={!officers[0]} type="submit" className="btn btn-primary">
            {lang.global.go_on_duty}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  officers: state.officers.officers,
});

export default connect(mapToProps, { getMyOfficers, setStatus })(SelectOfficerModal);
