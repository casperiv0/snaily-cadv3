import * as React from "react";
import { connect } from "react-redux";
import { update10Code } from "../../../../lib/actions/admin";
import Select from "../../../../components/select";
import State from "../../../../interfaces/State";
import Code10 from "../../../../interfaces/Code10";
import {
  colorOptions,
  shouldDoOptions,
  options,
} from "../../../../components/modals/admin/10-codes/Create10CodeModal";
import useDocTitle from "../../../../hooks/useDocTitle";
import { modal } from "../../../../lib/functions";
import Modal from "../..";
import { ModalIds } from "../../../../lib/types";

interface Props {
  update10Code: (id: string, data: Partial<Code10>) => Promise<boolean>;
  code: Code10 | null;
  codes: Code10[];
}

const Edit10CodeModal: React.FC<Props> = ({ update10Code, code: data, codes }) => {
  const [code, setCode] = React.useState("");
  const [whatPages, setWhatPages] = React.useState<Code10["what_pages"]>([]);
  const [color, setColor] = React.useState("");
  const [shouldDo, setShouldDo] = React.useState("");
  const [position, setPosition] = React.useState(0);
  useDocTitle(window.lang.codes.edit_10_code);

  const value = {
    value: colorOptions.find((clr) => clr.value === color)?.value,
    label: colorOptions.find((clr) => clr.value === color)?.label,
  };
  const shouldDoValue = {
    value: shouldDoOptions.find((option) => option.value === shouldDo)?.value,
    label: shouldDoOptions.find((option) => option.value === shouldDo)?.label,
  };

  React.useEffect(() => {
    if (!data) return;

    setCode(data.code);
    setWhatPages(data.what_pages);
    setColor(data.color);
    setShouldDo(data.should_do);
    setPosition(data.position);
  }, [data]);

  const length = React.useCallback(() => {
    const arr = [];

    for (let i = 0; i <= codes?.length + 1; i++) {
      arr.push(i);
    }

    return arr.map((v) => ({ value: v, label: `${window.lang.codes.position}: ${++v}` }));
  }, [codes?.length]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data?.id) return;

    const updated = await update10Code(data?.id, {
      code,
      what_pages: whatPages,
      color: color,
      should_do: shouldDo,
      position,
    });

    if (updated === true) {
      modal(ModalIds.Edit10Code).hide();
    }
  }

  return (
    <Modal size="lg" id={ModalIds.Edit10Code} title={window.lang.codes.edit_10_code}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="code">
              {window.lang.codes.code}
            </label>
            <input
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
              isClearable={false}
              closeMenuOnSelect={false}
              isMulti
              options={options}
              onChange={(v: any) => setWhatPages(v)}
              value={whatPages}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="what_pages">
              {window.lang.codes.select_color}
            </label>
            <Select
              isClearable={false}
              closeMenuOnSelect
              isMulti={false}
              options={colorOptions}
              onChange={(v: any) => setColor(v.value)}
              value={value as any}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="should_do">
              {window.lang.codes.what_it_do}
            </label>
            <Select
              isClearable={false}
              closeMenuOnSelect
              isMulti={false}
              options={shouldDoOptions}
              onChange={(v: any) => setShouldDo(v.value)}
              value={shouldDoValue as any}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="position">
              {window.lang.codes.position}
            </label>
            <Select
              isClearable={false}
              value={{
                label: `${window.lang.codes.position}: ${position}`,
                value: `${position}`,
              }}
              closeMenuOnSelect
              isMulti={false}
              options={length() as any}
              onChange={(v) => setPosition(+v.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.close}
          </button>
          <button type="submit" className="btn btn-primary">
            {window.lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  codes: state.admin.codes,
});

export default connect(mapToProps, { update10Code })(Edit10CodeModal);
