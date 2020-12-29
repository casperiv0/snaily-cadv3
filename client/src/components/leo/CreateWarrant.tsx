import * as React from "react";
import lang from "../../language.json";
import { createWarrant } from "../../lib/actions/records";
import { connect } from "react-redux";

interface Props {
  createWarrant: (data: { fullName: string; status: string; details: string }) => void;
}

const CreateWarrant: React.FC<Props> = ({ createWarrant }) => {
  const [name, setName] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>("active");
  const [details, setDetails] = React.useState<string>("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    createWarrant({
      fullName: name,
      status: status,
      details: details,
    });

    setStatus("");
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

          <select
            className="form-control bg-secondary border-secondary text-light"
            id="status"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="active">{lang.record.active}</option>
            <option value="inactive">{lang.record.inactive}</option>
          </select>
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
          <button className="btn btn-secondary col">{lang.global.create_warrant}</button>
        </div>
      </form>
    </div>
  );
};

export default connect(null, { createWarrant })(CreateWarrant);
