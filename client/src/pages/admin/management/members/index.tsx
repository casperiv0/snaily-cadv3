import * as React from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import { connect } from "react-redux";

const ManageMembersPage: React.FC = () => {
  return <AdminLayout></AdminLayout>;
};

export default connect(null, {})(ManageMembersPage);
