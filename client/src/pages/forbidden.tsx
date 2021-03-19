import * as React from "react";
import Layout from "../components/Layout";
import useDocTitle from "../hooks/useDocTitle";

const ForbiddenPage: React.FC = () => {
  useDocTitle("Forbidden");

  return (
    <Layout classes="mt-5">
      <h3 className="text-center">{window.lang.global.forbidden}</h3>
    </Layout>
  );
};

export default ForbiddenPage;
