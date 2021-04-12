import * as React from "react";
import { connect } from "react-redux";
import { getExpungementRequests } from "@actions/court/CourtActions";
import { Layout } from "@components/Layout";
import { RequestExpungementModal } from "../components/modals/court/RequestExpungementModal";
import { State } from "types/State";
import { ModalIds } from "types/ModalIds";
import lang from "src/language.json";
import { Seo } from "@components/Seo";
import { ExpungementRequest } from "types/ExpungementRequest";
import { initializeStore } from "@state/useStore";
import { GetServerSideProps } from "next";
import { getCadInfo } from "@actions/global/GlobalActions";
import { verifyAuth } from "@actions/auth/AuthActions";

interface Props {
  requests: ExpungementRequest[];
}

const CourthousePage: React.FC<Props> = ({ requests }) => {
  return (
    <Layout>
      <Seo title={lang.court.house} />

      <div className="d-flex justify-content-between">
        <h1 className="h2">{lang.court.house}</h1>

        <div>
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target={`#${ModalIds.RequestExpungement}`}
            className="btn btn-primary"
          >
            {lang.court.request_expungement}
          </button>
        </div>
      </div>

      {requests.length <= 0 ? (
        <p>{lang.court.no_requests}</p>
      ) : (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{lang.record.warrants}</th>
              <th scope="col">{lang.record.arr_rep}</th>
              <th scope="col">{lang.record.tickets}</th>
            </tr>
          </thead>
          <tbody>
            {requests?.map((req, idx) => {
              return (
                <tr key={idx}>
                  <th scope="row">{++idx}</th>
                  <td>
                    {req.warrants.length > 0
                      ? req.warrants.map((war) => war.label).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {req.arrestReports.length > 0
                      ? req.arrestReports.map((war) => war.label).join(", ")
                      : "N/A"}
                  </td>
                  <td>
                    {req.tickets.length > 0
                      ? req.tickets.map((war) => war.label).join(", ")
                      : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <RequestExpungementModal />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const store = initializeStore();
  await getCadInfo(req.headers)(store.dispatch);
  await verifyAuth(req.headers)(store.dispatch);
  await getExpungementRequests(req.headers)(store.dispatch);

  return { props: { initialReduxState: store.getState() } };
};

const mapToProps = (state: State) => ({
  requests: state.court.expungementRequests,
});

export default connect(mapToProps, { getExpungementRequests })(CourthousePage);
