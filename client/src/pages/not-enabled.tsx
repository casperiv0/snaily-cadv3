import * as React from "react";
import Layout from "../components/Layout";

const NotEnabled: React.FC = () => {
  return (
    <Layout classes="mt-5">
      <h3 className="text-center">
        That feature was disabled by the CAD owner, if you would like to use this feature, let your
        owner know!
      </h3>
    </Layout>
  );
};

export default NotEnabled;
