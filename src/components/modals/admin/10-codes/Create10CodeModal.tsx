import * as React from "react";
import { connect } from "react-redux";
import { add10Code } from "@actions/admin/AdminActions";
import { Select, SelectValue } from "@components/Select/Select";
import { Code10 } from "types/Code10";
import { Nullable, State } from "types/State";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";
import { useModalOpen } from "@hooks/useModalOpen";
import lang from "src/language.json";

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
    label: lang.admin.set_status,
  },
  {
    value: "set_off_duty",
    label: lang.admin.set_off_duty,
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

const Create10CodeModalC: React.FC<Props> = ({ codesLength, add10Code }) => {
  const [code, setCode] = React.useState<string>("");
  const [whatPages, setWhatPages] = React.useState([]);
  const [color, setColor] = React.useState<Nullable<SelectValue>>(null);
  const [shouldDo, setShouldDo] = React.useState<Nullable<SelectValue>>(null);
  const [position, setPosition] = React.useState<Nullable<SelectValue>>(null);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.Create10Code);

  const length = React.useCallback(() => {
    const arr: number[] = [];

    for (let i = 0; i <= codesLength + 1; i++) {
      arr.push(i);
    }

    return arr.map((v) => ({ value: v, label: `${lang.codes.position}: ${++v}` }));
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
      modal(ModalIds.Create10Code)?.hide();
    }
  }

  return (
    <Modal size="lg" title={lang.codes.add_10_code} id={ModalIds.Create10Code}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="create_10_code">
              {lang.codes.code}
            </label>
            <input
              ref={ref}
              id="create_10_code"
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
              className="form-control bg-secondary border-secondary text-light"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="what_pages">
              {lang.codes.code_where}
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
              {lang.codes.select_color}
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
              {lang.codes.what_it_do}
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
              {lang.codes.position}
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
            {lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {lang.codes.add_code}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  codesLength: state.admin?.codes?.length ?? null,
});

export const Create10CodeModal = connect(mapToProps, { add10Code })(Create10CodeModalC);
