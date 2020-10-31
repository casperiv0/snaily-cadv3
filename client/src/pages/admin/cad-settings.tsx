import * as React from "react";
import { connect } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import CadInfo from "../../interfaces/CadInfo";
import State from "../../interfaces/State";

interface Props {
  cad: CadInfo;
}

const CadSettingsPage: React.FC<Props> = ({ cad }) => {
  return <AdminLayout></AdminLayout>;
};

const mapToProps = (state: State) => ({
  cad: state.global.cadInfo,
});

export default connect(mapToProps, {})(CadSettingsPage);
