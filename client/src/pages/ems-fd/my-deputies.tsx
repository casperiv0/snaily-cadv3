import * as React from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import AlertMessage from "../../components/alert-message";
import Deputy from "../../interfaces/Deputy";
import State from "../../interfaces/State";
import lang from "../../language.json";
import { getMyDeputies, deleteEmsFdDeputy } from "../../lib/actions/ems-fd";
import { connect } from "react-redux";
import Message from "../../interfaces/Message";

interface Props {
  message: Message;
  deputies: Deputy[];
  getMyDeputies: () => void;
  deleteEmsFdDeputy: (id: string) => void;
}

const MyDeputiesPage: React.FC<Props> = ({
  message,
  deputies,
  getMyDeputies,
  deleteEmsFdDeputy,
}) => {
  React.useEffect(() => {
    getMyDeputies();
  }, [getMyDeputies]);

  return (
    <Layout classes="mt-5">
      {message ? <AlertMessage message={message} dismissible /> : null}

      <h4 className="card-title mt-3">{lang.ems_fd.my_deputies}</h4>

      <Link className="btn btn-primary container my-1" to="/ems-fd/dash">
        {lang.ems_fd.ems_dash}
      </Link>
      <Link className="btn btn-primary container" to="/ems-fd/deputies/create">
        {lang.ems_fd.create_a_dept}
      </Link>
      <ul className="list-group mt-1">
        {deputies.map((deputy: Deputy, idx: number) => {
          return (
            <li
              key={idx}
              id={`${idx}`}
              className="list-group-item bg-dark border-secondary d-flex justify-content-between"
            >
              <p>
                {++idx} | {deputy.name}
              </p>
              <div>
                <button onClick={() => deleteEmsFdDeputy(deputy.id)} className="btn btn-danger">
                  {lang.global.delete}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  deputies: state.ems_fd.deputies,
  message: state.global.message,
});

export default connect(mapToProps, { getMyDeputies, deleteEmsFdDeputy })(MyDeputiesPage);
