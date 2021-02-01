import * as React from "react";
import Select from "react-select";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import Call, { Unit } from "../../../interfaces/Call";
import { connect } from "react-redux";
import { end911Call, update911Call } from "../../../lib/actions/911-calls";
import Officer from "../../../interfaces/Officer";
import State from "../../../interfaces/State";
import Deputy from "../../../interfaces/Deputy";
import SelectStyles from "../../SelectStyles";

interface Props {
  id: string;
  call: Call;
  officers: Officer[];
  ems_fd: Deputy[];
  end911Call: (id: string) => void;
  update911Call: (
    id: string,
    data: { location: string; description: string; assigned_unit: Unit[] },
  ) => void;
}

const Update911Call: React.FC<Props> = ({
  id,
  call,
  officers: activeOfficers,
  ems_fd: activeEmsFdDeputies,
  end911Call,
  update911Call,
}) => {
  const [location, setLocation] = React.useState(call.location);
  const [description, setDescription] = React.useState(call.description);
  const [assignedUnits, setAssignedUnits] = React.useState(call.assigned_unit);
  const [activeUnits, setActiveUnits] = React.useState<(Officer | Deputy)[]>([]);
  const [menuOpen, setMenuOpen] = React.useState<boolean>(false);
  const btnRef = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    setActiveUnits([...activeEmsFdDeputies, ...activeOfficers]);
  }, [activeOfficers, activeEmsFdDeputies]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    btnRef.current?.click();

    update911Call(call.id, {
      location,
      description,
      assigned_unit: assignedUnits,
    });
  }

  function handleCancelCall() {
    btnRef.current?.click();

    end911Call(call.id);
  }

  function handleClick(e: any) {
    setAssignedUnits(e);
  }

  return (
    <Modal id={`update911Call${id}`}>
      <div className="modal-header">
        <h5 className="modal-title">{lang.dispatch.update_911_call}</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="call_location">
              {lang.global.location}
            </label>
            <input
              id="call_location"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="call_description">
              {lang.global.description}
            </label>
            <input
              id="call_description"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="call_assigned_unit">
              {lang.dispatch.assigned_unit}
            </label>
            {!activeUnits[0] ? (
              <p>{lang.dispatch.no_units}</p>
            ) : (
              <Select
                defaultValue={assignedUnits}
                onChange={handleClick}
                isMulti
                closeMenuOnSelect={false}
                menuIsOpen={menuOpen}
                onMenuClose={() => setMenuOpen(false)}
                onMenuOpen={() => setMenuOpen(true)}
                onBlur={() => setMenuOpen(false)}
                styles={SelectStyles}
                options={activeUnits.map((unit) => ({
                  value: "officer_name" in unit ? unit.officer_name : unit.name,
                  label: "officer_name" in unit ? unit.officer_name : unit.name,
                }))}
                components={{
                  Option: ({ children, innerProps }) => (
                    <div
                      className="bg-secondary border-secondary text-light px-2 py-2"
                      style={{ cursor: "pointer" }}
                      {...innerProps}
                    >
                      {children}
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.cancel}
          </button>
          <button onClick={handleCancelCall} type="button" className="btn btn-danger">
            {lang.tow.end_call}
          </button>
          <button type="submit" className="btn btn-success">
            {lang.dispatch.update_call}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  officers: state.dispatch.officers,
  ems_fd: state.dispatch.ems_fd,
});

export default connect(mapToProps, { end911Call, update911Call })(Update911Call);
