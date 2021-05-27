import React from "react";
import { connect } from "react-redux";
import { Modal } from "@components/Modal/Modal";
import { searchCitizen, requestExpungement } from "@actions/court/CourtActions";
import { CourtResult } from "@actions/court/CourtTypes";
import { Nullable, State } from "types/State";
import { Select, SelectValue } from "@components/Select/Select";
import { ModalIds } from "types/ModalIds";
import lang from "src/language.json";
import { RequestData } from "@lib/utils";

interface Props {
  searchCitizen: (name: string) => Promise<boolean>;
  requestExpungement: (citizenId: string, data: RequestData) => Promise<boolean>;
  courtResult: Nullable<CourtResult>;
}

const RequestExpungementModalC: React.FC<Props> = ({
  courtResult,
  searchCitizen,
  requestExpungement,
}) => {
  const [name, setName] = React.useState("");
  const [tickets, setTickets] = React.useState<SelectValue | null>(null);
  const [arrReports, setArrReports] = React.useState<SelectValue | null>(null);
  const [warrants, setWarrants] = React.useState<SelectValue | null>(null);
  const [reason, setReason] = React.useState("");
  const [disabled, setDisabled] = React.useState(true);
  const [searching, setSearching] = React.useState(false);

  React.useEffect(() => {
    if (courtResult !== null) {
      const isZeroWarrants = courtResult.warrants.length <= 0;
      const isZeroAp = courtResult.arrestReports.length <= 0;
      const isZeroTickets = courtResult.tickets.length <= 0;
      setDisabled(isZeroAp && isZeroWarrants && isZeroTickets);
    }
  }, [courtResult]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);

    await searchCitizen(name);
    setSearching(false);
  }

  async function onRequestSubmit(e: React.FormEvent) {
    e.preventDefault();

    const success = await requestExpungement(courtResult?.citizenId!, {
      tickets,
      arrest_reports: arrReports,
      warrants,
      reason,
    });

    if (success) {
      setTickets(null);
      setArrReports(null);
      setWarrants(null);
      setName("");
      setReason("");
    }
  }

  return (
    <Modal title={lang.court.request_expungement} size="xl" id={ModalIds.RequestExpungement}>
      <div className="modal-body">
        <form id="name-form" onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {lang.court.citizen_name}
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
                <button
                  disabled={searching}
                  form="name-form"
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  {searching ? `${lang.global.loading}..` : lang.global.search}
                </button>
              </div>
            </div>
          </div>
        </form>

        <form id="request-form" className="mt-5" onSubmit={onRequestSubmit}>
          {courtResult !== null && (
            <>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <h5>{lang.record.warrants}</h5>

                  {courtResult.warrants.length <= 0 ? (
                    <p>{lang.court.no_warrants}</p>
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
                  <h5>{lang.record.arr_rep}</h5>

                  {courtResult.arrestReports.length <= 0 ? (
                    <p>{lang.court.no_arr_reports}</p>
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
                  <h5>{lang.record.tickets}</h5>

                  {courtResult.tickets.length <= 0 ? (
                    <p>{lang.court.no_tickets}</p>
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

              <div>
                <label htmlFor="reason" className="form-label">
                  {lang.admin.reason}
                </label>
                <textarea
                  id="reason"
                  className="form-control mt-2 bg-secondary border-secondary text-light"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </>
          )}
        </form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
          {lang.global.cancel}
        </button>
        <button disabled={disabled} form="request-form" type="submit" className="btn btn-primary">
          {lang.global.request}
        </button>
      </div>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  courtResult: state.court.courtResult,
});

export const RequestExpungementModal = connect(mapToProps, { searchCitizen, requestExpungement })(
  RequestExpungementModalC,
);
