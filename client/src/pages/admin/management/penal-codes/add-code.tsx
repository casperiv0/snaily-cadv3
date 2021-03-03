import * as React from "react";
import { connect } from "react-redux";
import { addPenalCode } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import { Link } from "react-router-dom";
import Message from "../../../../interfaces/Message";
import AlertMessage from "../../../../components/alert-message";
import PenalCode from "../../../../interfaces/PenalCode";

interface Props {
  message: Message | null;
  addPenalCode: (data: Partial<PenalCode>) => void;
}

const AddPenalCode: React.FC<Props> = ({ addPenalCode, message }) => {
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    addPenalCode({
      title,
      des,
    });
  }

  return (
    <AdminLayout>
      <AlertMessage message={message} dismissible />
      <h1 className="h3">Add penal code</h1>

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
            rows={7}
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
            Add
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  message: state.global.message,
});

export default connect(mapToProps, { addPenalCode })(AddPenalCode);
