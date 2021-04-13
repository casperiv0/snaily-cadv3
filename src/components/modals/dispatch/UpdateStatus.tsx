import * as React from "react";
import { Modal } from "@components/Modal/Modal";
import lang from "../../../language.json";
// import { setEmsStatus } from "@actions/ems-fd/EmsFdActions";
import { setStatus } from "@actions/officer/OfficerActions";
import { connect } from "react-redux";
import { Code10 } from "types/Code10";
import { Nullable, State } from "types/State";
import { get10Codes } from "@actions/admin/AdminActions";
import { Select, SelectValue } from "@components/Select/Select";
import { filterCodes, modal } from "@lib/utils";
import { ModalIds } from "types/ModalIds";

interface Props {
  type: "ems-fd" | "officers";
  data: { id: string; status: string; status2: string } | null;
  statuses: Code10[];
  setStatus: (id: string, status: string, status2: string) => void;
  setEmsStatus: (id: string, status: string, status2: string) => void;
  get10Codes: () => void;
}

const UpdateStatusModalC: React.FC<Props> = (props) => {
  const { get10Codes } = props;
  const [status, setStatus] = React.useState<Nullable<SelectValue>>(null);
  const [status2, setStatus2] = React.useState<Nullable<SelectValue>>(null);

  React.useEffect(() => {
    setStatus({ label: props.data?.status ?? "", value: props.data?.status ?? "" });
    setStatus2({ label: props.data?.status2 ?? "", value: props.data?.status2 ?? "" });
  }, [props.data]);

  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!status || !status2 || !props.data) return;

    const conf = {
      id: props.data?.id,
      status: status.value.toLowerCase(),
      status2: status.value === "off-duty" ? "--------" : status2.value,
    };

    if (props.type === "ems-fd") {
      props.setEmsStatus(conf.id, conf.status, conf.status2);
    } else if (props.type === "officers") {
      props.setStatus(conf.id, conf.status, conf.status2);
    }

    modal(ModalIds.UpdateStatus)?.hide();
  }

  return (
    <Modal title={lang.dispatch.update_status} id={ModalIds.UpdateStatus}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="status">
              {lang.dispatch.set_on_off_duty}
            </label>

            <Select
              isClearable={false}
              value={status}
              isMulti={false}
              onChange={setStatus}
              options={[
                {
                  value: "on-duty",
                  label: lang.global.on_duty,
                },
                {
                  value: "off-duty",
                  label: lang.global.off_duty,
                },
              ]}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="status2">
              {lang.dispatch.global_status}
            </label>

            <Select
              isClearable={false}
              value={status2}
              isMulti={false}
              onChange={setStatus2}
              options={filterCodes([{ code: "10-8" } as any, ...props.statuses]).map((stat) => {
                return {
                  label: stat.code,
                  value: stat.code,
                };
              })}
            />
          </div>
        </div>
        <div className="modal-footer">
          <div className="mb-3">
            <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
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

const mapToProps = (state: State) => ({
  statuses: state.admin.codes,
});

// setEmsStatus
export const UpdateStatusModal = connect(mapToProps, { setStatus, get10Codes })(UpdateStatusModalC);
