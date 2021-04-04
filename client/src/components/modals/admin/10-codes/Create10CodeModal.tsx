import * as React from "react";
import { connect } from "react-redux";
import { add10Code } from "../../../../lib/actions/admin";
import Select, { Value } from "../../../select";
import Code10 from "../../../../interfaces/Code10";
import State from "../../../../interfaces/State";
import Modal from "../..";
import { ModalIds } from "../../../../lib/types";
import { modal } from "../../../../lib/functions";
import { useModalOpen } from "../../../../hooks/useModalOpen";

export const options = [
  {
    value: "leo",
    label: "LEO",
  },
  {
    value: "dispatch",
    label: "Dispatch",
  },
  {
    value: "ems_fd",
    label: "EMS-FD",
  },
];

export const shouldDoOptions = [
  {
    value: "set_status",
    label: window.lang.admin.set_status,
  },
  {
    value: "set_off_duty",
    label: window.lang.admin.set_off_duty,
  },
];

export const colorOptions = [
  {
    value: "btn-danger",
    label: "Red",
  },
  {
    value: "btn-secondary",
    label: "Normal",
  },
];

interface Props {
  codesLength: number;
  add10Code: (data: Partial<Code10>) => Promise<boolean>;
}

const Create10CodeModal: React.FC<Props> = ({ codesLength, add10Code }) => {
  const [code, setCode] = React.useState<string>("");
  const [whatPages, setWhatPages] = React.useState([]);
  const [color, setColor] = React.useState<Value | null>(null);
  const [shouldDo, setShouldDo] = React.useState<Value | null>(null);
  const [position, setPosition] = React.useState<Value | null>(null);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.Create10Code);

  const length = React.useCallback(() => {
    const arr = [];

    for (let i = 0; i <= codesLength + 1; i++) {
      arr.push(i);
    }

    return arr.map((v) => ({ value: v, label: `${window.lang.codes.position}: ${++v}` }));
  }, [codesLength]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!position) return;

    const added = await add10Code({
      code,
      color: color?.value,
      what_pages: whatPages,
      should_do: shouldDo?.value,
      position: +position?.value,
    });

    if (added === true) {
      setCode("");
      setWhatPages([]);
      setColor(null);
      setShouldDo(null);
      setPosition(null);
      modal(ModalIds.Create10Code).hide();
    }
  }

  return (
    <Modal size="lg" title={window.lang.codes.add_10_code} id={ModalIds.Create10Code}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="code">
              {window.lang.codes.code}
            </label>
            <input
              ref={ref}
              id="code"
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="what_pages">
              {window.lang.codes.code_where}
            </label>
            <Select
              closeMenuOnSelect={false}
              isMulti
              options={options}
              onChange={(v: any) => setWhatPages(v)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="what_pages">
              {window.lang.codes.select_color}
            </label>
            <Select
              closeMenuOnSelect
              isMulti={false}
              options={colorOptions}
              onChange={(v) => setColor(v)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="should_do">
              {window.lang.codes.what_it_do}
            </label>
            <Select
              closeMenuOnSelect
              isMulti={false}
              options={shouldDoOptions}
              onChange={(v) => setShouldDo(v)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="position">
              {window.lang.codes.position}
            </label>
            <Select
              closeMenuOnSelect
              isMulti={false}
              options={length() as any}
              onChange={(v) => setPosition(v)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {window.lang.codes.add_code}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  codesLength: state.admin?.codes?.length,
});

export default connect(mapToProps, { add10Code })(Create10CodeModal);
