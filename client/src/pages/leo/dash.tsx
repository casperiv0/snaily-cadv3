import * as React from "react";
import { connect } from "react-redux";
import Active911Calls from "../../components/active-911-calls";
import Layout from "../../components/Layout";
import State from "../../interfaces/State";
import lang from "../../language.json";
import ModalButtons from "../../components/leo/ModalButtons";
import Statuses from "../../components/leo/Statuses";

interface Props {
  aop: string;
}

const LeoDash: React.FC<Props> = ({ aop }) => {
  const [time, setTime] = React.useState<Date>(new Date());

  React.useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    });
  }, [time]);

  React.useEffect(() => {
    document.title = "LEO Dashboard";
  });

  return (
    <Layout fluid classes="mt-5">
      <div className="card bg-dark border-dark">
        <div className="card-header d-flex justify-content-between">
          <h4>
            {lang.global.utility_panel} - AOP: {aop}
          </h4>
          <span>{new Date(time).toLocaleString()}</span>
        </div>
        <div className="card-body">
          <ModalButtons />
        </div>
        <div className="card-footer">
          <Statuses />
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-md-9">
          <Active911Calls />
          active bolos
          {/* <ActiveBolos /> */}
        </div>
        create warrant
        {/* <CreateWarrant /> */}
      </div>
    </Layout>
  );
};

const mapToProps = (state: State) => ({
  aop: state.global.aop,
});

export default connect(mapToProps, {})(LeoDash);
