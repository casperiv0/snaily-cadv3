import * as React from "react";
import { connect } from "react-redux";
import { get10Codes, delete10Code } from "@actions/admin/AdminActions";
import { AdminLayout } from "@components/admin/AdminLayout";
import { Code10 } from "types/Code10";
import { State } from "types/State";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import {
  Create10CodeModal,
  colorOptions,
  shouldDoOptions,
} from "@components/modals/admin/10-codes/Create10CodeModal";
import { ModalIds } from "types/ModalIds";
import { Edit10CodeModal } from "@components/modals/admin/10-codes/Edit10CodeModal";
import lang from "src/language.json";
import { Item, Span } from "@components/Item";
import { Seo } from "@components/Seo";
import { GetServerSideProps } from "next";
import { initializeStore } from "@state/useStore";
import { verifyAuth } from "@actions/auth/AuthActions";
import { getCadInfo } from "@actions/global/GlobalActions";
import { useClientPerms } from "@hooks/useClientPerms";
import { useSearch } from "@hooks/useSearch";

interface Props {
  codes: Code10[];
  delete10Code: (id: string) => void;
}

const Codes10Management: React.FC<Props> = ({ codes, delete10Code }) => {
  const [tempCode, setTempCode] = React.useState<Code10 | null>(null);
  const { search, filtered, onChange } = useSearch<Code10>("code", codes);
  useClientPerms("supervisor");

  return (
    <AdminLayout>
      <Seo title="10 Codes Management" />
      <div className="d-flex justify-content-between mb-3">
        <h1 className="h3">10 codes</h1>
        <div>
          <button
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.Create10Code}`}
            className="btn btn-primary"
          >
            Add code
          </button>
        </div>
      </div>

      <ul className="list-group pb-5">
        <input
          type="text"
          value={search}
          onChange={onChange}
          className="form-control bg-dark border-dark mb-2 text-light"
          placeholder={`${lang.global.search}...`}
        />

        {codes?.length <= 0 ? (
          <AlertMessage message={{ msg: "This CAD doesn't have any 10 codes", type: "warning" }} />
        ) : (
          filtered?.map((code: Code10, idx: number) => {
            return (
              <li
                key={code.id}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              >
                <div>
                  <div className="mb-0">
                    <p className="h5">
                      {++idx} | {code.code}
                    </p>
                  </div>
                  <Item id="pages">
                    <Span>{lang.codes.pages}: </Span>
                    {code.what_pages?.map((p, i: number) => {
                      const comma = i !== code?.what_pages?.length - 1 ? ", " : " ";

                      return (
                        <span key={p.label}>
                          {p.label}
                          {comma}
                        </span>
                      );
                    })}
                  </Item>
                  <Item id="color">
                    <Span>{lang.codes.color}: </Span>
                    {colorOptions.find((clr) => clr.value === code.color)?.label}
                  </Item>
                  <Item id="should_do">
                    <Span>{lang.codes.should_do}: </Span>
                    {shouldDoOptions.find((option) => option.value === code.should_do)?.label}
                  </Item>
                  <Item id="position">
                    <Span>{lang.codes.position}: </Span>
                    {code.position + 1}
                  </Item>
                </div>

                <div>
                  <button onClick={() => delete10Code(code.id)} className="btn btn-danger mx-2">
                    {lang.global.delete}
                  </button>
                  <button
                    onClick={() => setTempCode(code)}
                    data-bs-toggle="modal"
                    data-bs-target={`#${ModalIds.Edit10Code}`}
                    className="btn btn-success"
                  >
                    {lang.global.edit}
                  </button>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <Create10CodeModal />
      <Edit10CodeModal code={tempCode} />
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await verifyAuth(req.headers)(store.dispatch);
  await getCadInfo(req.headers)(store.dispatch);
  await get10Codes(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  codes: state.admin.codes,
});

export default connect(mapToProps, { get10Codes, delete10Code })(Codes10Management);
