import * as React from "react";
import { connect } from "react-redux";
import { getPenalCodes, deletePenalCode } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { Link } from "react-router-dom";
import { Span } from "../../../citizen/citizen-info";
import PenalCode from "../../../../interfaces/PenalCode";
import useDocTitle from "../../../../hooks/useDocTitle";

interface Props {
  codes: PenalCode[];
  getPenalCodes: () => void;
  deletePenalCode: (id: string) => void;
}

const PenalCodesManagement: React.FC<Props> = ({ codes, getPenalCodes, deletePenalCode }) => {
  const [filtered, setFiltered] = React.useState(codes);
  const [filter, setFilter] = React.useState("");
  useDocTitle("Penal Code Management");

  React.useEffect(() => {
    getPenalCodes();
  }, [getPenalCodes]);

  React.useEffect(() => {
    setFiltered(codes);
  }, [codes]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = codes.filter((code: PenalCode) =>
      code.title.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredItems);
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between mb-3">
        <h1 className="h3">Penal codes</h1>
        <div>
          <Link to="/admin/manage/penal-codes/add" className="btn btn-primary">
            Add code
          </Link>
        </div>
      </div>

      <div className="pb-5">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-dark mb-2 text-light"
          placeholder="Search.."
        />
        {codes.length <= 0 ? (
          <AlertMessage
            message={{ msg: "This CAD doesn't have any penal codes", type: "warning" }}
          />
        ) : (
          <ul className="list-group">
            {filtered.map((code: PenalCode, idx: number) => {
              return (
                <li
                  key={code.id}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between"
                >
                  <div>
                    <div className="mb-0">
                      <p className="h5">
                        {++idx} | {code.title}
                      </p>
                    </div>
                    <div style={{ marginTop: "0" }}>
                      <Span>Description: </Span>
                      <p style={{ maxWidth: "600px" }}>{code.des}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => deletePenalCode(code.id)}
                      className="btn btn-danger mx-2"
                    >
                      Delete
                    </button>
                    <Link
                      to={`/admin/manage/penal-codes/edit/${code.id}`}
                      className="btn btn-success"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  codes: state.admin.penalCodes,
});

export default connect(mapToProps, { getPenalCodes, deletePenalCode })(PenalCodesManagement);
