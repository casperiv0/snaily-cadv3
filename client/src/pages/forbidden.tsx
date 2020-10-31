import * as React from "react";
import Layout from "../components/Layout";

const ForbiddenPage: React.FC = () => {
  return (
    <Layout classes="mt-5">
      <h3 className="text-center">You are not allowed to view the requested page</h3>
    </Layout>
  );
};

export default ForbiddenPage;
