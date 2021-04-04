import React from "react";
import { connect } from "react-redux";
import Modal from "..";
import { CourtResults, searchCitizen, requestExpungement } from "../../../lib/actions/court";
import State from "../../../interfaces/State";
import Select from "../../select";
import { ModalIds } from "../../../lib/types";

interface Props {
  searchCitizen: (name: string) => void;
  requestExpungement: (citizenId: string, data: object) => void;
  courtResult: CourtResults;
}

const RequestExpungementModal: React.FC<Props> = ({
  courtResult,
  searchCitizen,
  requestExpungement,
}) => {
  const [name, setName] = React.useState("");
  const [tickets, setTickets] = React.useState([]);
  const [arrReports, setArrReports] = React.useState([]);
  const [warrants, setWarrants] = React.useState([]);
  const [disabled, setDisabled] = React.useState(true);

  React.useEffect(() => {
    if (courtResult !== null) {
      const isZeroWarrants = courtResult.warrants.length <= 0;
      const isZeroAp = courtResult.arrestReports.length <= 0;
      const isZeroTickets = courtResult.tickets.length <= 0;
      setDisabled(isZeroAp && isZeroWarrants && isZeroTickets);
    }
  }, [courtResult]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    searchCitizen(name);
  }

  function onRequestSubmit(e: React.FormEvent) {
    e.preventDefault();

    requestExpungement(courtResult.citizenId, {
      tickets,
      arrest_reports: arrReports,
      warrants,
    });

    setTickets([]);
    setArrReports([]);
    setWarrants([]);
    setName("");
  }

  return (
    <Modal title={window.lang.court.request_expungement} size="xl" id={ModalIds.RequestExpungement}>
      <div className="modal-body">
        <form id="name-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {window.lang.court.citizen_name}
            </label>

            <div className="row">
              <div className="col-md-10">
                <input
                  className="form-control bg-secondary border-secondary text-light"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button form="name-form" type="submit" className="btn btn-primary w-100">
                  {window.lang.global.search}
                </button>
              </div>
            </div>
          </div>
        </form>

        <form id="request-form" className="mt-5" onSubmit={onRequestSubmit}>
          {courtResult !== null && (
            <div className="row">
              <div className="col-md-4 mb-3">
                <h5>{window.lang.record.warrants}</h5>

                {courtResult.warrants.length <= 0 ? (
                  <p>{window.lang.court.no_warrants}</p>
                ) : (
                  <Select
                    onChange={(v: any) => setWarrants(v)}
                    options={courtResult.warrants.map((warrant) => {
                      return {
                        value: warrant.id,
                        label: warrant.reason,
                      };
                    })}
                  />
                )}
              </div>
              <div className="col-md-4 mb-3">
                <h5>{window.lang.record.arr_rep}</h5>

                {courtResult.arrestReports.length <= 0 ? (
                  <p>{window.lang.court.no_arr_reports}</p>
                ) : (
                  <Select
                    onChange={(v: any) => setArrReports(v)}
                    options={courtResult.arrestReports.map((arr) => {
                      return {
                        value: arr.id,
                        label: `${arr.charges} (${new Date(
                          Number(arr.date),
                        ).toLocaleDateString()})`,
                      };
                    })}
                  />
                )}
              </div>
              <div className="col-md-4 mb-3">
                <h5>{window.lang.record.tickets}</h5>

                {courtResult.tickets.length <= 0 ? (
                  <p>{window.lang.court.no_tickets}</p>
                ) : (
                  <Select
                    onChange={(v: any) => setTickets(v)}
                    options={courtResult.tickets.map((ticket) => {
                      return {
                        value: ticket.id,
                        label: `${ticket.violations} (${new Date(
                          Number(ticket.date),
                        ).toLocaleDateString()})`,
                      };
                    })}
                  />
                )}
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
          {window.lang.global.cancel}
        </button>
        <button disabled={disabled} form="request-form" type="submit" className="btn btn-primary">
          {window.lang.global.request}
        </button>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  courtResult: state.citizen.courtResult,
});

export default connect(mapToProps, { searchCitizen, requestExpungement })(RequestExpungementModal);
