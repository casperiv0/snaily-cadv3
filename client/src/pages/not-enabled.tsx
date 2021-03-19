import * as React from "react";
import Layout from "../components/Layout";
import useDocTitle from "../hooks/useDocTitle";

const NotEnabled: React.FC = () => {
  useDocTitle("Feature Not enabled");

  return (
    <Layout classes="mt-5">
      <h3 className="text-center">{window.lang.global.not_enabled}</h3>
    </Layout>
  );
};

export default NotEnabled;
