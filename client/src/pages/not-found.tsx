import * as React from "react";
import Layout from "../components/Layout";
import useDocTitle from "../hooks/useDocTitle";

const NotFoundPage: React.FC = () => {
  useDocTitle("404 - Page not found");

  return (
    <Layout classes="mt-5">
      <h3 className="text-center">{window.lang.global.page_not_found}</h3>
    </Layout>
  );
};

export default NotFoundPage;
