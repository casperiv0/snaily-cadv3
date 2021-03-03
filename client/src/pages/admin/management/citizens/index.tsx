import * as React from "react";
import AdminLayout from "../../../../components/admin/AdminLayout";
import Citizen from "../../../../interfaces/Citizen";
import AlertMessage from "../../../../components/alert-message";
import lang from "../../../../language.json";
import State from "../../../../interfaces/State";
import { connect } from "react-redux";
import { getAllCitizens, getAllExpungementRequests } from "../../../../lib/actions/admin";
import Message from "../../../../interfaces/Message";
import AllCitizensTab from "../../../../components/admin/all-citizens";
import ExpungementRequestsTab from "../../../../components/admin/expungement-requests";
import { ExpungementRequest } from "../../../../lib/actions/court";

interface Props {
  message: Message | null;
  requests: ExpungementRequest[];
  citizens: Citizen[];
  getAllCitizens: () => void;
  getAllExpungementRequests: () => void;
}

const ManageCitizensPage: React.FC<Props> = ({
  message,
  citizens,
  requests,
  getAllCitizens,
  getAllExpungementRequests,
}) => {
  const [filter, setFilter] = React.useState<string>("");
  const [filtered, setFiltered] = React.useState<any>([]);

  React.useEffect(() => {
    getAllCitizens();
    getAllExpungementRequests();
  }, [getAllCitizens, getAllExpungementRequests]);

  React.useEffect(() => {
    if (citizens[0]) {
      setFiltered(citizens);
    }
  }, [citizens]);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = citizens.filter((citizen: Citizen) =>
      citizen.full_name.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredItems);
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage message={message} dismissible /> : null}

      <div className="list-group">
        <input
          className="form-control bg-dark border-secondary text-light mb-2"
          type="search"
          value={filter}
          onChange={handleSearch}
          placeholder={`${lang.global.search}..`}
        />

        <ul className="nav nav-tabs">
          <li className="nav-item">
            <a
              id="all-citizens-tab"
              className="nav-link active bg-dark text-light border-dark"
              data-bs-toggle="tab"
              href="#citizens_tab"
              role="tab"
              aria-controls="citizens_tab"
              aria-selected="true"
            >
              {lang.admin.all_citizens}
            </a>
          </li>
          <li className="nav-item">
            <a
              id="expungement-requests-tab"
              className="nav-link bg-dark text-light border-dark mx-1"
              data-bs-toggle="tab"
              href="#expungement-requests"
              role="tab"
              aria-controls="expungement-requests"
              aria-selected="false"
            >
              Expungement Requests
              <span className="badge bg-primary ms-2">{requests.length}</span>
            </a>
          </li>
        </ul>

        <div className="tab-content mt-1" id="citizen-tabs">
          <div
            className="tab-pane fade show active"
            id="citizens_tab"
            role="tabpanel"
            aria-labelledby="all-citizens-tab"
          >
            <AllCitizensTab citizens={filtered} />
          </div>

          <div
            className="tab-pane fade"
            id="expungement-requests"
            role="tabpanel"
            aria-labelledby="expungement-requests-tab"
          >
            <ExpungementRequestsTab requests={requests} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  citizens: state.admin.citizens,
  message: state.global.message,
  requests: state.admin.expungementRequests,
});

export default connect(mapToProps, { getAllCitizens, getAllExpungementRequests })(
  ManageCitizensPage,
);
