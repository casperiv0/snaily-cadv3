import * as React from "react";
import { connect } from "react-redux";
import { get10Codes } from "../../../../lib/actions/admin";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Code10 from "../../../../interfaces/Code10";
import State from "../../../../interfaces/State";
import AlertMessage from "../../../../components/alert-message";

interface Props {
  codes: Code10[];
  get10Codes: () => void;
}

const Codes10Management: React.FC<Props> = ({ codes, get10Codes }) => {
  React.useEffect(() => {
    get10Codes();
  }, [get10Codes]);

  return (
    <AdminLayout>
      <h1 className="h3">10 codes</h1>
      <ul className="list-group">
        {codes.length <= 0 ? (
          <AlertMessage message={{ msg: "This CAD doesn't have any 10 codes", type: "warning" }} />
        ) : (
          codes.map((code: Code10, idx: number) => {
            return (
              <li
                key={code.id}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between"
              >
                <p>
                  {++idx} {code.code}
                </p>

                <div>
                  <button className="btn btn-danger">Delete</button>
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

export default connect(mapToProps, { get10Codes })(Codes10Management);
