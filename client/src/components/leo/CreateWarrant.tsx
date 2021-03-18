import * as React from "react";
import lang from "../../language.json";
import { createWarrant } from "../../lib/actions/records";
import { connect } from "react-redux";
import Officer from "../../interfaces/Officer";
import State from "../../interfaces/State";
import Select, { Value } from "../select";

interface Props {
  activeOfficer: Officer | null;
  createWarrant: (data: { fullName: string; status: string; details: string }) => void;
}

const CreateWarrant: React.FC<Props> = ({ createWarrant, activeOfficer }) => {
  const [name, setName] = React.useState<string>("");
  const [status, setStatus] = React.useState<Value | null>({
    label: lang.record.active,
    value: "active",
  });
  const [details, setDetails] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    if (!activeOfficer) return;
    e.preventDefault();
    if (!status) return;

    createWarrant({
      fullName: name,
      status: status.value,
      details: details,
    });

    setStatus({
      label: lang.record.active,
      value: "active",
    });
    setName("");
    setDetails("");
  }

  return (
    <div className="list-group">
      <div className="list-group-item bg-secondary border-secondary">
        {lang.global.create_warrant}
      </div>
      <form onSubmit={onSubmit} className="list-group-item bg-dark border-dark">
        <div className="mb-3">
          <label className="form-label" htmlFor="warrant_name">
            {lang.record.enter_full_name}
          </label>
          <input
            className="form-control bg-secondary border-secondary text-light"
            type="text"
            id="warrant_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="status">
            {lang.record.select_status}
          </label>

          <Select
            isClearable={false}
            value={status}
            isMulti={false}
            onChange={(v) => setStatus(v)}
            options={[
              {
                label: lang.record.active,
                value: "active",
              },
              {
                value: "inactive",
                label: lang.record.inactive,
              },
            ]}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="details">
            {lang.record.enter_details}
          </label>
          <input
            className="form-control bg-secondary border-secondary text-light"
            type="text"
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <button
            title={!activeOfficer ? "Go on-duty first!" : ""}
            disabled={!activeOfficer}
            className="btn btn-secondary col"
          >
            {lang.global.create_warrant}
          </button>
        </div>
      </form>
    </div>
  );
};
const mapToProps = (state: State) => ({
  activeOfficer: state.officers.activeOfficer,
});

export default connect(mapToProps, { createWarrant })(CreateWarrant);
