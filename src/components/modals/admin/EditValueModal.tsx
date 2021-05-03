import * as React from "react";
import { AdminLayout } from "@components/admin/AdminLayout";
import { connect } from "react-redux";
import { Value } from "types/Value";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { updateValueById } from "@actions/values/ValuesActions";
import { Modal } from "@components/Modal/Modal";
import { ModalIds } from "types/ModalIds";
import { modal } from "@lib/utils";
import { useModalOpen } from "@hooks/useModalOpen";
import lang from "src/language.json";

interface Props {
  value: Value | null;
  path: string;
  updateValueById: (path: string, id: string, data: Partial<Value>) => Promise<boolean>;
}

const EditValueModalC: React.FC<Props> = (props) => {
  const path = props.path;
  const { updateValueById } = props;
  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const ref = useModalOpen<HTMLInputElement>(ModalIds.EditValue);

  React.useEffect(() => {
    if (props.value) {
      setValue(props.value?.name);
    }
  }, [props.value]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!props.value) return;
    setLoading(true);

    const updated = await updateValueById(path, props.value?.id, { name: value });

    if (updated === true) {
      modal(ModalIds.EditValue)?.hide();
    }

    setLoading(false);
  }

  if (props.value !== null && !props.value) {
    return (
      <AdminLayout>
        <AlertMessage message={{ msg: lang.admin.values.not_found_id, type: "danger" }} />
      </AdminLayout>
    );
  }

  return (
    <Modal title={lang.admin.values[path].manage} id={ModalIds.EditValue}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="edit_value_name">
              {lang.admin.values[path].name}
            </label>
            <input
              ref={ref}
              id="edit_value_name"
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
          <button disabled={loading} className="btn btn-primary ms-2" type="submit">
            {loading ? `${lang.global.loading}..` : lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const EditValueModal = connect(null, { updateValueById })(EditValueModalC);
