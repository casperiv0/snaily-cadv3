import * as React from "react";
import { connect } from "react-redux";
import { get10Codes, delete10Code } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Code10 from "../../../../interfaces/Code10";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { Item, Span } from "../../../citizen/citizen-info";
import {
  colorOptions,
  shouldDoOptions,
} from "../../../../components/modals/admin/10-codes/Create10CodeModal";
import useDocTitle from "../../../../hooks/useDocTitle";
import Loader from "../../../../components/loader";
import Create10CodeModal from "../../../../components/modals/admin/10-codes/Create10CodeModal";
import { ModalIds } from "../../../../lib/types";
import Edit10CodeModal from "../../../../components/modals/admin/10-codes/Edit10CodeModal";

interface Props {
  codes: Code10[];
  loading: boolean;
  get10Codes: () => void;
  delete10Code: (id: string) => void;
}

const Codes10Management: React.FC<Props> = ({ codes, loading, get10Codes, delete10Code }) => {
  const [tempCode, setTempCode] = React.useState<Code10 | null>(null);
  useDocTitle("10 Codes Management");

  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  return (
    <AdminLayout>
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
        {codes?.length <= 0 ? (
          <AlertMessage message={{ msg: "This CAD doesn't have any 10 codes", type: "warning" }} />
        ) : (
          <>
            {loading ? (
              <Loader />
            ) : (
              codes?.map((code: Code10, idx: number) => {
                return (
                  <li
                    key={code.id}
                    className="list-group-item bg-dark border-secondary d-flex justify-content-between"
                  >
                    <div>
                      <div className="mb-0">
                        <p className="h5">
                          {++idx} | {code.code}
                        </p>
                      </div>
                      <Item id="pages">
                        <Span>{window.lang.codes.pages}: </Span>
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
                        <Span>{window.lang.codes.color}: </Span>
                        {colorOptions.find((clr) => clr.value === code.color)?.label}
                      </Item>
                      <Item id="should_do">
                        <Span>{window.lang.codes.should_do}: </Span>
                        {shouldDoOptions.find((option) => option.value === code.should_do)?.label}
                      </Item>
                      <Item id="position">
                        <Span>{window.lang.codes.position}: </Span>
                        {code.position + 1}
                      </Item>
                    </div>

                    <div>
                      <button onClick={() => delete10Code(code.id)} className="btn btn-danger mx-2">
                        {window.lang.global.delete}
                      </button>
                      <button
                        onClick={() => setTempCode(code)}
                        data-bs-toggle="modal"
                        data-bs-target={`#${ModalIds.Edit10Code}`}
                        className="btn btn-success"
                      >
                        {window.lang.global.edit}
                      </button>
                    </div>
                  </li>
                );
              })
            )}
          </>
        )}
      </ul>

      <Create10CodeModal />
      <Edit10CodeModal code={tempCode} />
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  codes: state.admin.codes,
  loading: state.admin.loading,
});

export default connect(mapToProps, { get10Codes, delete10Code })(Codes10Management);
