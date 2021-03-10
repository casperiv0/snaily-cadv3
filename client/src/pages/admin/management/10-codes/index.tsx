import * as React from "react";
import { connect } from "react-redux";
import { get10Codes, delete10Code } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Code10 from "../../../../interfaces/Code10";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";
import { Link } from "react-router-dom";
import { Item, Span } from "../../../citizen/citizen-info";
import { colorOptions, shouldDoOptions } from "./add-code";
import useDocTitle from "../../../../hooks/useDocTitle";

interface Props {
  codes: Code10[];
  get10Codes: () => void;
  delete10Code: (id: string) => void;
}

const Codes10Management: React.FC<Props> = ({ codes, get10Codes, delete10Code }) => {
  useDocTitle("10 Codes Management");

  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between mb-3">
        <h1 className="h3">10 codes</h1>
        <div>
          <Link to="/admin/manage/10-codes/add" className="btn btn-primary">
            Add code
          </Link>
        </div>
      </div>

      <ul className="list-group pb-5">
        {codes.length <= 0 ? (
          <AlertMessage message={{ msg: "This CAD doesn't have any 10 codes", type: "warning" }} />
        ) : (
          codes.map((code: Code10, idx: number) => {
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
                    <Span>Pages: </Span>
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
                    <Span>Color: </Span>
                    {colorOptions.find((clr) => clr.value === code.color)?.label}
                  </Item>
                  <Item id="should_do">
                    <Span>Should do: </Span>
                    {shouldDoOptions.find((option) => option.value === code.should_do)?.label}
                  </Item>
                </div>

                <div>
                  <button onClick={() => delete10Code(code.id)} className="btn btn-danger mx-2">
                    Delete
                  </button>
                  <Link to={`/admin/manage/10-codes/edit/${code.id}`} className="btn btn-success">
                    Edit
                  </Link>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  codes: state.admin.codes,
});

export default connect(mapToProps, { get10Codes, delete10Code })(Codes10Management);
