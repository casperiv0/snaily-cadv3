import * as React from "react";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { addValue } from "@actions/values/ValuesActions";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";
import { useModalOpen } from "@hooks/useModalOpen";
import lang from "src/language.json";
import { Value } from "types/Value";

interface Props {
  addValue: (path: string, data: Partial<Value>) => Promise<boolean>;
}

const AddValueModal: React.FC<Props> = ({ addValue }) => {
  const path = useRouter().query.path as string;
  const [value, setValue] = React.useState<string>("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.AddValue);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const added = await addValue(path, {
      name: value,
    });

    if (added === true) {
      setValue("");
      modal(ModalIds.AddValue)?.hide();
    }
  }

  return (
    <Modal id={ModalIds.AddValue} title={lang.admin.values[path].add}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {lang.admin.values[path].name}
            </label>
            <input
              ref={ref}
              id="name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              placeholder={`${lang.admin.values[path].name}..`}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button className="btn btn-primary ms-2" type="submit">
            {lang.admin.values[path].add}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { addValue })(AddValueModal);
