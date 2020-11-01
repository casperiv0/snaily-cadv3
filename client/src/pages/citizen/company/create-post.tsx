import * as React from "react";
import { connect } from "react-redux";
import AlertMessage from "../../../components/alert-message";
import Layout from "../../../components/Layout";
import State from "../../../interfaces/State";

interface Props {
  error: string;
}

const CreatePost: React.FC<Props> = ({ error }) => {
  return <Layout>{error ? <AlertMessage type="warning" message={error} /> : null}</Layout>;
};

const mapToProps = (state: State) => ({
  error: state.company.error,
});

export default connect(mapToProps, {})(CreatePost);
