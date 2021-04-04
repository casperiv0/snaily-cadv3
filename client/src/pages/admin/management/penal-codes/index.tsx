import * as React from "react";
import { connect } from "react-redux";
import { getPenalCodes, deletePenalCode } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { Span } from "../../../citizen/citizen-info";
import PenalCode from "../../../../interfaces/PenalCode";
import useDocTitle from "../../../../hooks/useDocTitle";
import Loader from "../../../../components/loader";
import { useObserver } from "../../../../hooks/useObserver";
import CreatePenalCodeModal from "../../../../components/modals/admin/penal-codes/CreatePenalCodeModal";
import { ModalIds } from "../../../../lib/types";
import EditPenalCodeModal from "../../../../components/modals/admin/penal-codes/EditPenalCodeModal";

interface Props {
  codes: PenalCode[];
  loading: boolean;
  getPenalCodes: () => void;
  deletePenalCode: (id: string) => void;
}

const PenalCodesManagement: React.FC<Props> = ({
  codes,
  loading,
  getPenalCodes,
  deletePenalCode,
}) => {
  const [tempCode, setTempCode] = React.useState<PenalCode | null>(null);
  const [filtered, setFiltered] = React.useState(codes);
  const [filter, setFilter] = React.useState("");
  const { ref, length } = useObserver<PenalCode>(codes);
  useDocTitle(window.lang.codes.penal_code_management);

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
        <h1 className="h3">{window.lang.global.penal_codes}</h1>
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.CreatePenalCode}`}
            className="btn btn-primary"
          >
            {window.lang.codes.add_penal_code}
          </button>
        </div>
      </div>

      <div className="pb-5">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-dark mb-2 text-light"
          placeholder={`${window.lang.global.search}...`}
        />
        {codes?.length <= 0 ? (
          <AlertMessage message={{ msg: window.lang.codes.no_penal_codes, type: "warning" }} />
        ) : loading ? (
          <Loader />
        ) : (
          <ul className="list-group">
            {filtered?.slice(0, length)?.map((code: PenalCode, idx: number) => {
              return (
                <li
                  ref={ref}
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
                      <Span>{window.lang.global.description}: </Span>
                      <p style={{ maxWidth: "600px" }}>{code.des}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => deletePenalCode(code.id)}
                      className="btn btn-danger mx-2"
                    >
                      {window.lang.global.delete}
                    </button>
                    <button
                      onClick={() => setTempCode(code)}
                      data-bs-toggle="modal"
                      data-bs-target={`#${ModalIds.EditPenalCode}`}
                      className="btn btn-success"
                    >
                      {window.lang.global.edit}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <EditPenalCodeModal code={tempCode} />
      <CreatePenalCodeModal />
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  codes: state.admin.penalCodes,
  loading: state.admin.loading,
});

export default connect(mapToProps, { getPenalCodes, deletePenalCode })(PenalCodesManagement);
