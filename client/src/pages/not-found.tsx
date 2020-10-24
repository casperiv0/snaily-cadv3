import * as React from "react";
import Layout from "../components/Layout";

const NotFoundPage: React.FC = () => {
  return (
    <Layout classes="mt-5">
      <h3 className="text-center">Whoops! I could not find that page!</h3>
    </Layout>
  );
};

export default NotFoundPage;
