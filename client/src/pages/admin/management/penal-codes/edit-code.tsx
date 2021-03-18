import * as React from "react";
import { connect } from "react-redux";
import { updatePenalCode, getPenalCodes } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import { Link, useHistory, useParams } from "react-router-dom";
import PenalCode from "../../../../interfaces/PenalCode";
import useDocTitle from "../../../../hooks/useDocTitle";

interface Props {
  updatePenalCode: (id: string, data: Partial<PenalCode>) => Promise<boolean>;
  getPenalCodes: () => void;
  codes: PenalCode[];
}

const EditPenalCode: React.FC<Props> = ({ updatePenalCode, codes, getPenalCodes }) => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = React.useState("");
  const [des, setDes] = React.useState<string>("");
  const history = useHistory();
  useDocTitle(window.lang.codes.edit_penal_code);

  React.useEffect(() => {
    getPenalCodes();
  }, [getPenalCodes]);

  React.useEffect(() => {
    const code = codes?.find((code) => code.id === id);
    if (!code) return;

    setTitle(code?.title);
    setDes(code?.des);
  }, [codes, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const updated = await updatePenalCode(id, {
      title,
      des,
    });

    if (updated === true) {
      history.push("/admin/manage/penal-codes");
    }
  }

  return (
    <AdminLayout>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="code">
            {window.lang.global.title}
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
            {window.lang.global.description}
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
            {window.lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary">
            {window.lang.global.update}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  codes: state.admin.penalCodes,
});

export default connect(mapToProps, { updatePenalCode, getPenalCodes })(EditPenalCode);
