import * as React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import useDocTitle from "../../hooks/useDocTitle";
import lang from "../../language.json";

const AdminPage: React.FC = () => {
  useDocTitle("Admin");

  return (
    <AdminLayout>
      <h1>{lang.nav.admin}</h1>
    </AdminLayout>
  );
};

export default AdminPage;
