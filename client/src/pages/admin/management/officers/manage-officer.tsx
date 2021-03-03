import React from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { connect } from "react-redux";
import {
  getOfficerById,
  updateOfficerById,
  UpdateOfficerData,
} from "../../../../lib/actions/admin";
import Message from "../../../../interfaces/Message";
import Officer from "../../../../interfaces/Officer";
import { Link, useParams } from "react-router-dom";

interface Props {
  message: Message | null;
  officer: Officer | null;
  getOfficerById: (officerId: string) => void;
  updateOfficerById: (officerId: string, data: UpdateOfficerData) => void;
}

const ManageOfficerPage: React.FC<Props> = ({
  officer,
  message,
  getOfficerById,
  updateOfficerById,
}) => {
  const { id } = useParams<{ id: string }>();
  const [callSign, setCallSign] = React.useState(officer?.callsign || "");
  const [rank, setRank] = React.useState(officer?.rank || "");

  React.useEffect(() => {
    getOfficerById(id);
  }, [id, getOfficerById]);

  React.useEffect(() => {
    setCallSign(officer?.callsign || "");
    setRank(officer?.rank || "");
  }, [officer]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateOfficerById(id, {
      callsign: callSign,
      rank,
    });
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage message={message} dismissible /> : null}

      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="tow">
            Callsign
          </label>

          <input
            placeholder="callsign"
            value={callSign}
            onChange={(e) => setCallSign(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="tow">
            Rank
          </label>

          <input
            placeholder="rank"
            value={rank}
            onChange={(e) => setRank(e.currentTarget.value)}
            className="form-control bg-dark border-dark text-light"
          />
        </div>

        <div className="float-end">
          <Link to="/admin/manage/officers" className="btn btn-danger mx-2">
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
  officer: state.admin.officer,
  message: state.global.message,
});

export default connect(mapToProps, { getOfficerById, updateOfficerById })(ManageOfficerPage);
