import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import { setEmsStatus } from "../../../lib/actions/ems-fd";
import { statuses } from "../../leo/Statuses";
import { setStatus } from "../../../lib/actions/officer";
import { connect } from "react-redux";

interface Props {
  id: string;
  status: string;
  status2: string;
  type: "ems-fd" | "officers";
  setStatus: (id: string, status: string, status2: string) => void;
  setEmsStatus: (id: string, status: string, status2: string) => void;
}

const UpdateStatusModal: React.FC<Props> = (props) => {
  const [status, setStatus] = React.useState<string>(props.status);
  const [status2, setStatus2] = React.useState<string>(props.status2);
  const btnRef = React.createRef<HTMLButtonElement>();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const conf = {
      id: props.id,
      status: status.toLowerCase(),
      status2: status === "off-duty" ? "--------" : status2,
    };

    if (props.type === "ems-fd") {
      props.setEmsStatus(conf.id, conf.status, conf.status2);
    } else if (props.type === "officers") {
      props.setStatus(conf.id, conf.status, conf.status2);
    }

    btnRef.current?.click();
  }

  return (
    <Modal id={`updateStatus${props.id}`}>
      <div className="modal-header">
        <h5 className="modal-title">{lang.dispatch.update_status}</h5>
        <XButton ref={btnRef} />
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="status">{lang.dispatch.set_on_off_duty}</label>
            <select
              value={status}
              id="status"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value={status}>{status}</option>
              <option disabled>--------</option>
              <option value="on-duty">{lang.global.on_duty}</option>
              <option value="off-duty">{lang.global.off_duty}</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="status2">{lang.dispatch.global_status}</label>
            <select
              value={status2}
              id="status2"
              className="form-control bg-secondary border-secondary text-light"
              onChange={(e) => setStatus2(e.target.value)}
            >
              <option value={status2}>{status2}</option>
              <option disabled>--------</option>
              {statuses.map((stat: string, idx: number) => {
                return (
                  <option value={stat} key={idx} id={`${idx}`}>
                    {stat}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <div className="mb-3">
            <button type="button" className="btn btn-secondary mr-2" data-dismiss="modal">
              {lang.global.cancel}
            </button>
            <button type="submit" className="btn btn-primary">
              {lang.dispatch.update_status}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { setStatus, setEmsStatus })(UpdateStatusModal);
