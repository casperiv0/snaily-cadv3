import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import { connect } from "react-redux";
import { getMyDeputies, setEmsStatus } from "../../../lib/actions/ems-fd";
import Deputy from "../../../interfaces/Deputy";

interface Props {
  deputies: Deputy[];
  getMyDeputies: () => void;
  setEmsStatus: (
    id: string,
    status: "on-duty" | "off-duty",
    status2: string
  ) => void;
}

const SelectOfficerModal: React.FC<Props> = ({
  deputies,
  getMyDeputies,
  setEmsStatus,
}) => {
  const [selected, setSelected] = React.useState("");
  const btnRef = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    getMyDeputies();
  }, [getMyDeputies]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    setEmsStatus(selected, "on-duty", "10-8");

    btnRef.current?.click();
  }

  return (
    <Modal id="selectEmsFdModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.ems_fd.select_dept}</h5>
        <XButton ref={btnRef} />
      </div>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="deputy">{lang.ems_fd.select_dept_2}</label>
            <select
              className="form-control bg-secondary border-secondary text-light"
              id="deputy"
              onChange={(e) => setSelected(e.target.value)}
              value={selected}
            >
              <option value="">{lang.ems_fd.select_dept_2}...</option>
              {!deputies[0] ? (
                <option>{lang.ems_fd.no_dept}</option>
              ) : (
                deputies.map((deputy: Deputy, idx: number) => {
                  return (
                    <option key={idx} value={deputy.id}>
                      {deputy.name}
                    </option>
                  );
                })
              )}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
          >
            {lang.global.cancel}
          </button>
          <button
            disabled={!deputies.length}
            type="submit"
            className="btn btn-primary"
          >
            {lang.global.go_on_duty}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  deputies: state.ems_fd.deputies,
});

export default connect(mapToProps, { getMyDeputies, setEmsStatus })(
  SelectOfficerModal
);
