import { GetServerSideProps } from "next";
import * as React from "react";
import { connect } from "react-redux";
import { useSearch } from "@casper124578/useful/hooks/useSearch";
import { getPenalCodes, deletePenalCode } from "actions/admin/AdminActions";
import { AdminLayout } from "components/admin/AdminLayout";
import { State } from "types/State";
import { AlertMessage } from "components/AlertMessage/AlertMessage";
import { PenalCode } from "types/PenalCode";
import { useObserver } from "hooks/useObserver";
import { CreatePenalCodeModal } from "components/modals/admin/penal-codes/CreatePenalCodeModal";
import { EditPenalCodeModal } from "components/modals/admin/penal-codes/EditPenalCodeModal";
import { ModalIds } from "types/ModalIds";
import { initializeStore } from "state/useStore";
import { verifyAuth } from "actions/auth/AuthActions";
import { getCadInfo } from "actions/global/GlobalActions";
import lang from "src/language.json";
import { Seo } from "components/Seo";
import { Item, Span } from "components/Item";
import { useClientPerms } from "hooks/useClientPerms";

interface Props {
  codes: PenalCode[];
  deletePenalCode: (id: string) => void;
}

const PenalCodesManagement: React.FC<Props> = ({ codes, deletePenalCode }) => {
  const [tempCode, setTempCode] = React.useState<PenalCode | null>(null);
  const { onChange, search, filtered } = useSearch<PenalCode>("title", codes);
  const { ref, length } = useObserver<PenalCode>(codes);
  useClientPerms("supervisor");

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
          value={search}
          onChange={onChange}
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
                    {code?.jail_time ? (
                      <Item>
                        <Span>{lang.codes.jail_time2}: </Span>
                        <>
                          {code.jail_time} {lang.codes.seconds}
                        </>
                      </Item>
                    ) : null}
                    {code?.fine_amount ? (
                      <Item>
                        <Span>{lang.codes.fine_amount2}: </Span>
                        <>{code.fine_amount}</>
                      </Item>
                    ) : null}
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
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await getPenalCodes(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  codes: state.admin.penalCodes,
});

export default connect(mapToProps, { deletePenalCode })(PenalCodesManagement);
