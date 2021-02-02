import * as React from "react";
import { connect } from "react-redux";
import { ExpungementRequest, getExpungementRequests } from "../lib/actions/court";
import Layout from "../components/Layout";
import RequestExpungementModal from "../components/modals/court/RequestExpungementModal";
import State from "../interfaces/State";

interface Props {
  requests: ExpungementRequest[];
  getExpungementRequests: () => void;
}

const CourthousePage: React.FC<Props> = ({ requests, getExpungementRequests }) => {
  React.useEffect(() => {
    getExpungementRequests();
  }, [getExpungementRequests]);

  return (
    <Layout>
      <div className="d-flex justify-content-between">
        <h1 className="h2">San Andreas Courthouse</h1>

        <div>
          <button
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#requestExpungementModal"
            className="btn btn-primary"
          >
            Request Expungement
          </button>
        </div>
      </div>

      {requests.length <= 0 ? (
        <p>You don&apos;t have any requests. FYI: declined request get deleted</p>
      ) : (
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Warrants</th>
              <th scope="col">Arrest reports</th>
              <th scope="col">Tickets</th>
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

const mapToProps = (state: State) => ({
  requests: state.citizen.expungementRequests,
});

export default connect(mapToProps, { getExpungementRequests })(CourthousePage);
