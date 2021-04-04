import * as React from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Value from "../../../../interfaces/Value";
import AlertMessage from "../../../../components/alert-message";
import { updateValueById } from "../../../../lib/actions/values";
import { connect } from "react-redux";
import Modal from "../..";
import { ModalIds } from "../../../../lib/types";
import { modal } from "../../../../lib/functions";
import { useModalOpen } from "../../../../hooks/useModalOpen";

interface Props {
  value: Value | null;
  path: string;
  updateValueById: (path: string, id: string, data: { name: string }) => Promise<boolean>;
}

const EditValueModal: React.FC<Props> = (props) => {
  const { path, updateValueById } = props;
  const [value, setValue] = React.useState<string>("");
  const ref = useModalOpen<HTMLInputElement>(ModalIds.EditValue);

  React.useEffect(() => {
    if (props.value) {
      setValue(props.value?.name);
    }
  }, [props.value]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!props.value) return;

    const updated = await updateValueById(path, props.value?.id, { name: value });

    if (updated === true) {
      modal(ModalIds.EditValue).hide();
    }
  }

  if (props.value !== null && !props.value) {
    return (
      <AdminLayout>
        <AlertMessage message={{ msg: window.lang.admin.values.not_found_id, type: "danger" }} />
      </AdminLayout>
    );
  }

  return (
    <Modal title={window.lang.admin.values[path].manage} id={ModalIds.EditValue}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {window.lang.admin.values[path].name}
            </label>
            <input
              ref={ref}
              id="name"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="form-control bg-secondary border-secondary text-light"
              placeholder={`${window.lang.admin.values[path].name}..`}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {window.lang.global.close}
          </button>
          <button className="btn btn-primary ms-2" type="submit">
            {window.lang.global.update}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default connect(null, { updateValueById })(EditValueModal);
