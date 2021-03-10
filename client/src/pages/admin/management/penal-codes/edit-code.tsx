import * as React from "react";
import { connect } from "react-redux";
import { updatePenalCode, getPenalCodes } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import { Link, useParams } from "react-router-dom";
import Message from "../../../../interfaces/Message";
import AlertMessage from "../../../../components/alert-message";
import PenalCode from "../../../../interfaces/PenalCode";
import useDocTitle from "../../../../hooks/useDocTitle";

interface Props {
  message: Message | null;
  updatePenalCode: (id: string, data: Partial<PenalCode>) => void;
  getPenalCodes: () => void;
  codes: PenalCode[];
}

const EditPenalCode: React.FC<Props> = ({ updatePenalCode, message, codes, getPenalCodes }) => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState<string>("");
  useDocTitle("Edit Penal Code");

  React.useEffect(() => {
    getPenalCodes();
  }, [getPenalCodes]);

  React.useEffect(() => {
    const code = codes?.find((code) => code.id === id);
    if (!code) return;

    setTitle(code?.title);
    setDes(code?.des);
  }, [codes, id]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updatePenalCode(id, {
      title,
      des,
    });
  }

  return (
    <AdminLayout>
      <AlertMessage message={message} dismissible />

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="code">
            Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="code">
            Description
          </label>
          <textarea
            rows={15}
            id="des"
            value={des}
            onChange={(e) => setDes(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          ></textarea>
        </div>

        <div className="mb-3 float-end">
          <Link className="btn btn-danger mx-2" to="/admin/manage/penal-codes">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
  codes: state.admin.penalCodes,
});

export default connect(mapToProps, { updatePenalCode, getPenalCodes })(EditPenalCode);
