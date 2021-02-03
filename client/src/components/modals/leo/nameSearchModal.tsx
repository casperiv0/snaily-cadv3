import * as React from "react";
import Modal, { XButton } from "../index";
import lang from "../../../language.json";
import State from "../../../interfaces/State";
import AlertMessage from "../../alert-message";
import Citizen from "../../../interfaces/Citizen";
import Weapon from "../../../interfaces/Weapon";
import Vehicle from "../../../interfaces/Vehicle";
import SERVER_URL from "../../../config";
import { searchName, saveNote, searchNames } from "../../../lib/actions/officer";
import { Warrant, Ticket, ArrestReport, WrittenWarning } from "../../../interfaces/Record";
import { connect } from "react-redux";
import { Item, Span } from "../../../pages/citizen/citizen-info";
import Select from "../../select";

interface NameSearch {
  type: "name";
  citizen: Citizen;
  warrants: Warrant[];
  tickets: Ticket[];
  arrestReports: ArrestReport[];
  writtenWarnings: WrittenWarning[];
  weapons: Weapon[];
  vehicles: Vehicle[];
}

interface Props {
  search: NameSearch;
  names: string[];
  searchName: (name: string) => void;
  saveNote: (citizenId: string, note: string) => void;
  searchNames: () => void;
}

const NameSearchModal: React.FC<Props> = ({ search, names, searchName, saveNote, searchNames }) => {
  const [name, setName] = React.useState<any>({});
  const [note, setNote] = React.useState((search && search.citizen.note) || "");
  const btnRef = React.createRef<HTMLButtonElement>();

  React.useEffect(() => {
    name !== "" && searchNames();
    setNote(search?.citizen?.note || "");
  }, [search?.citizen, name, searchNames]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    searchName(name.value);
  }

  function addNote() {
    search.citizen?.id && saveNote(search.citizen.id, note);
  }

  return (
    <Modal size="lg" id="nameSearchModal">
      <div className="modal-header">
        <h5 className="modal-title">{lang.global.name_search}</h5>
        <XButton ref={btnRef}></XButton>
      </div>

      <form onSubmit={onSubmit}>
        <div className="modal-body">
          {search !== null && search?.type === "name" && search?.warrants[0] ? (
            <AlertMessage message={{ msg: lang.record.has_warrant, type: "warning" }} />
          ) : null}
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {lang.global.name}
            </label>
            <Select
              isMulti={false}
              onFocus={() => searchNames()}
              value={name.value && name}
              onChange={(v: any) => setName(v)}
              options={names.map(({ full_name }: any) => ({
                value: full_name,
                label: full_name,
              }))}
            />
          </div>

          {search !== null && search?.type === "name" ? (
            search?.citizen ? (
              <div className="mt-3 row">
                <div className="col-md-6">
                  <h5>{lang.admin.cad_settings.general_info}</h5>

                  <div className="list-group" id="general_info">
                    <Item id="image_id">
                      <img
                        className="object-fit-center rounded-circle mb-1"
                        style={{ width: "100px", height: "100px" }}
                        src={`${SERVER_URL}/static/citizen-images/${search.citizen.image_id}`}
                        alt={search.citizen.full_name}
                      />
                    </Item>

                    <Item id="full_name">
                      <Span>{lang.citizen.full_name}: </Span>
                      {search.citizen.full_name}
                    </Item>

                    <Item id="birth">
                      <Span>{lang.citizen.date_of_birth}: </Span>
                      {search.citizen.birth}
                    </Item>

                    <Item id="gender">
                      <Span>{lang.citizen.gender}: </Span>
                      {search.citizen.gender}
                    </Item>

                    <Item id="ethnicity">
                      <Span>{lang.citizen.ethnicity}: </Span>
                      {search.citizen.ethnicity}
                    </Item>

                    <Item id="hair_color">
                      <Span>{lang.citizen.hair_color}: </Span>
                      {search.citizen.hair_color}
                    </Item>

                    <Item id="eye_color">
                      <Span>{lang.citizen.eye_color}: </Span>
                      {search.citizen.eye_color}
                    </Item>

                    <Item id="address">
                      <Span>{lang.citizen.address}: </Span>
                      {search.citizen.address}
                    </Item>

                    <Item id="height_weight">
                      <Span>{lang.citizen.hei_wei}: </Span>
                      {search.citizen.height} / {search.citizen.weight}
                    </Item>

                    <Item id="employer">
                      <Span>{lang.citizen.employer}: </Span>
                      {search.citizen.business}
                    </Item>
                  </div>
                </div>

                <div className="col-md-6">
                  <h5>{lang.citizen.licenses}</h5>

                  <div className="list-group" id="licenses">
                    <Item id="dmv">
                      <Span>{lang.citizen.license.dmv}: </Span>
                      {search.citizen.dmv}
                    </Item>

                    <Item id="fire_license">
                      <Span>{lang.citizen.license.firearms}: </Span>
                      {search.citizen.fire_license}
                    </Item>

                    <Item id="pilot_license">
                      <Span>{lang.citizen.license.pilot}: </Span>
                      {search.citizen.pilot_license}
                    </Item>

                    <Item id="ccw">
                      <Span>{lang.citizen.license.ccw}: </Span>
                      {search.citizen.ccw}
                    </Item>

                    <div className="mt-3" id="note">
                      <label style={{ fontSize: "1.2rem" }} htmlFor="note">
                        Add Note
                      </label>
                      <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.currentTarget.value)}
                        className="form-control bg-secondary border-secondary text-light"
                        rows={5}
                      ></textarea>
                      <button
                        form="none"
                        type="button"
                        onClick={addNote}
                        className="btn btn-primary mt-2"
                      >
                        Save note
                      </button>
                    </div>
                  </div>
                </div>

                {/* records & vehicles */}
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary col-sm-6 mt-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#records"
                    aria-expanded="false"
                    aria-controls="records"
                  >
                    {lang.citizen.toggle_record}
                  </button>
                  <button
                    className="btn btn-primary col-sm-6 mt-3 ms-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#registered"
                    aria-expanded="false"
                    aria-controls="registered"
                  >
                    {lang.citizen.toggle_veh_wea}
                  </button>
                </div>

                <div className="collapse mt-3" id="records">
                  <div id="written_warnings">
                    <h5>
                      {lang.record.warnings} ({search.writtenWarnings.length})
                    </h5>

                    <ul style={{ maxHeight: "20rem" }} className="list-group overflow-auto">
                      {!search.writtenWarnings[0] ? (
                        <li className="list-group-item border-dark text-dark">
                          {lang.record.no_war}
                        </li>
                      ) : (
                        search.writtenWarnings.map((warning: WrittenWarning, idx: number) => {
                          return (
                            <li
                              key={idx}
                              id={`${idx}`}
                              className="list-group-item border-dark text-dark"
                            >
                              <Item id="infractions">
                                <Span>{lang.record.infractions}: </Span>
                                {warning.infractions}
                              </Item>

                              <Item id="date">
                                <Span>{lang.record.given_on}: </Span>
                                {new Date(Number(warning.date)).toLocaleDateString()}
                              </Item>

                              <Item id="officer_name">
                                <Span>{lang.record.given_by}: </Span>
                                {warning.officer_name}
                              </Item>

                              <Item id="postal">
                                <Span>{lang.record.postal}: </Span>
                                {warning.postal}
                              </Item>

                              <Item id="notes">
                                <Span>{lang.global.notes}: </Span>
                                {warning.notes}
                              </Item>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>

                  {/* tickets */}
                  <div className="mt-3" id="tickets">
                    <h5>
                      {lang.record.tickets} ({search.tickets.length})
                    </h5>

                    <ul style={{ maxHeight: "20rem" }} className="list-group overflow-auto">
                      {!search.tickets[0] ? (
                        <li className="list-group-item border-dark text-dark">
                          {lang.record.no_tick}
                        </li>
                      ) : (
                        search.tickets.map((ticket: Ticket, idx: number) => {
                          return (
                            <li
                              className="list-group-item border-dark text-dark"
                              key={idx}
                              id={`${idx}`}
                            >
                              <Item id="violations">
                                <Span>{lang.record.violations}: </Span>
                                {ticket.violations}
                              </Item>

                              <Item id="date">
                                <Span>{lang.record.given_on}: </Span>
                                {new Date(Number(ticket.date)).toLocaleDateString()}
                              </Item>

                              <Item id="officer_name">
                                <Span>{lang.record.given_by}: </Span>
                                {ticket.officer_name}
                              </Item>

                              <Item id="postal">
                                <Span>{lang.record.postal}: </Span>
                                {ticket.postal}
                              </Item>

                              <Item id="notes">
                                <Span>{lang.global.notes}: </Span>
                                {ticket.notes}
                              </Item>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>

                  {/* arrest Reports */}
                  <div className="mt-3" id="arrest_reports">
                    <h5>
                      {lang.record.arr_rep} ({search.arrestReports.length})
                    </h5>

                    <ul style={{ maxHeight: "20rem" }} className="list-group overflow-auto">
                      {!search.arrestReports[0] ? (
                        <li className="list-group-item border-dark text-dark">
                          {lang.record.no_arr_rep}
                        </li>
                      ) : (
                        search.arrestReports.map((report: ArrestReport, idx: number) => {
                          return (
                            <li
                              className="list-group-item border-dark text-dark"
                              key={idx}
                              id={`${idx}`}
                            >
                              <Item id="charges">
                                <Span>{lang.record.charges}: </Span>
                                {report.charges}
                              </Item>

                              <Item id="date">
                                <Span>{lang.record.given_on}: </Span>
                                {new Date(Number(report.date)).toLocaleDateString()}
                              </Item>

                              <Item id="officer_name">
                                <Span>{lang.record.given_by}: </Span>
                                {report.officer_name}
                              </Item>

                              <Item id="postal">
                                <Span>{lang.record.postal}: </Span>
                                {report.postal}
                              </Item>

                              <Item id="notes">
                                <Span>{lang.global.notes}: </Span>
                                {report.notes}
                              </Item>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>

                  {/* warrants */}
                  <div className="mt-3" id="arrest_reports">
                    <h5>
                      {lang.record.warrants} ({search.warrants.length})
                    </h5>

                    <ul style={{ maxHeight: "20rem" }} className="list-group overflow-auto">
                      {!search.warrants[0] ? (
                        <li className="list-group-item border-dark text-dark">
                          {lang.record.no_warrants}
                        </li>
                      ) : (
                        search.warrants.map((warrant: Warrant, idx: number) => {
                          return (
                            <li
                              className="list-group-item border-dark text-dark"
                              key={idx}
                              id={`${idx}`}
                            >
                              <Item id="charges">
                                <Span>{lang.record.warrant}: </Span>
                                {warrant.reason}
                              </Item>

                              <Item id="status">
                                <Span>{lang.dispatch.status}: </Span>
                                {warrant.status}
                              </Item>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </div>

                <div className="collapse mt-3" id="registered">
                  {/* Vehicles */}
                  <div id="vehicles">
                    <h5>
                      {lang.citizen.vehicle.reged_vehicle} ({search.vehicles.length})
                    </h5>

                    <ul style={{ maxHeight: "20rem" }} className="list-group overflow-auto">
                      {!search.vehicles[0] ? (
                        <li className="list-group-item border-dark text-dark">
                          {lang.record.no_vehicles}
                        </li>
                      ) : (
                        search.vehicles.map((vehicle: Vehicle, idx: number) => {
                          return (
                            <li className="list-group-item border-dark text-dark" key={idx}>
                              <Item id="vehicle">
                                <Span>{lang.record.vehicle}: </Span>
                                {vehicle.vehicle}
                              </Item>

                              <Item id="owner">
                                <Span>{lang.record.owner}: </Span>
                                {vehicle.owner}
                              </Item>

                              <Item id="vin_number">
                                <Span>{lang.record.vin_number}: </Span>
                                {vehicle.vin_number}
                              </Item>

                              <Item id="in_status">
                                <Span>{lang.dispatch.status}: </Span>
                                {vehicle.in_status}
                              </Item>

                              <Item id="plate">
                                <Span>{lang.global.plate}: </Span>
                                {vehicle.plate.toUpperCase()}
                              </Item>

                              <Item id="color">
                                <Span>{lang.global.color}: </Span>
                                {vehicle.color}
                              </Item>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>

                  {/* weapons */}
                  <div className="mt-3" id="weapons">
                    <h5>
                      {lang.citizen.vehicle.reged_vehicle} ({search.weapons.length})
                    </h5>

                    <ul style={{ maxHeight: "20rem" }} className="list-group overflow-auto">
                      {!search.weapons[0] ? (
                        <li className="list-group-item border-dark text-dark">
                          {lang.record.no_vehicles}
                        </li>
                      ) : (
                        search.weapons.map((weapon: Weapon, idx: number) => {
                          return (
                            <li className="list-group-item border-dark text-dark" key={idx}>
                              <Item id="weapon">
                                <Span>{lang.record.weapon}: </Span>
                                {weapon.weapon}
                              </Item>

                              <Item id="owner">
                                <Span>{lang.record.owner}: </Span>
                                {weapon.owner}
                              </Item>

                              <Item id="serial_number">
                                <Span>{lang.citizen.weapon.serial_number}: </Span>
                                {weapon.serial_number}
                              </Item>

                              <Item id="status">
                                <Span>{lang.dispatch.status}: </Span>
                                {weapon.status}
                              </Item>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <AlertMessage message={{ msg: lang.record.no_citizen, type: "warning" }} />
            )
          ) : null}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-danger"
            data-bs-target="#createTicketModal"
            data-bs-toggle="modal"
          >
            {lang.global.create_ticket}
          </button>
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" disabled={name === ""} className="btn btn-primary">
            {lang.global.search}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const mapToProps = (state: State) => ({
  search: state.officers.search,
  names: state.officers.names,
});

export default connect(mapToProps, { searchName, saveNote, searchNames })(NameSearchModal);
