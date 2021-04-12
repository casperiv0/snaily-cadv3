import { GetServerSideProps } from "next";
import * as React from "react";
import { connect } from "react-redux";
import { getPenalCodes, deletePenalCode } from "@actions/admin/AdminActions";
import { AdminLayout } from "@components/admin/AdminLayout";
import { State } from "types/State";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { PenalCode } from "types/PenalCode";
import { useObserver } from "@hooks/useObserver";
import { CreatePenalCodeModal } from "@components/modals/admin/penal-codes/CreatePenalCodeModal";
import { EditPenalCodeModal } from "@components/modals/admin/penal-codes/EditPenalCodeModal";
import { ModalIds } from "types/ModalIds";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import lang from "src/language.json";
import { Seo } from "@components/Seo";
import { Span } from "@components/Item";
import { useClientPerms } from "@hooks/useClientPerms";

interface Props {
  codes: PenalCode[];
  deletePenalCode: (id: string) => void;
}

const PenalCodesManagement: React.FC<Props> = ({ codes, deletePenalCode }) => {
  const [tempCode, setTempCode] = React.useState<PenalCode | null>(null);
  const [filtered, setFiltered] = React.useState(codes);
  const [filter, setFilter] = React.useState("");
  const { ref, length } = useObserver<PenalCode>(codes);
  useClientPerms("supervisor");

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
      <Seo title={lang.codes.penal_code_management} />

      <div className="d-flex justify-content-between mb-3">
        <h1 className="h3">{lang.global.penal_codes}</h1>
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.CreatePenalCode}`}
            className="btn btn-primary"
          >
            {lang.codes.add_penal_code}
          </button>
        </div>
      </div>

      <div className="pb-5">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-dark mb-2 text-light"
          placeholder={`${lang.global.search}...`}
        />
        {codes?.length <= 0 ? (
          <AlertMessage message={{ msg: lang.codes.no_penal_codes, type: "warning" }} />
        ) : (
          <ul className="list-group">
            {filtered?.slice(0, length)?.map((code: PenalCode, idx: number) => {
              return (
                <li
                  ref={ref}
                  key={code.id}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
                >
                  <div>
                    <div className="mb-0">
                      <p className="h5">
                        {++idx} | {code.title}
                      </p>
                    </div>
                    <div style={{ marginTop: "0" }}>
                      <Span>{lang.global.description}: </Span>
                      <p style={{ maxWidth: "600px" }}>{code.des}</p>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => deletePenalCode(code.id)}
                      className="btn btn-danger mx-2"
                    >
                      {lang.global.delete}
                    </button>
                    <button
                      onClick={() => setTempCode(code)}
                      data-bs-toggle="modal"
                      data-bs-target={`#${ModalIds.EditPenalCode}`}
                      className="btn btn-success"
                    >
                      {lang.global.edit}
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers.cookie)(store.dispatch);
  await getCadInfo(req.headers.cookie)(store.dispatch);
  await getPenalCodes(req.headers.cookie)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  codes: state.admin.penalCodes,
});

export default connect(mapToProps, { deletePenalCode })(PenalCodesManagement);
