import * as React from "react";
import format from "date-fns/format";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { Modal } from "@components/Modal/Modal";
import lang from "../../../language.json";
import { State } from "types/State";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Citizen } from "types/Citizen";
import { Weapon } from "types/Weapon";
import { Vehicle } from "types/Vehicle";
import { nameSearch, saveNote, searchNames, suspendLicense } from "@actions/officer/OfficerActions";
import { deleteRecordById } from "@actions/record/RecordActions";
import { Warrant, Ticket, ArrestReport, WrittenWarning } from "types/Record";
import { Select, SelectValue } from "@components/Select/Select";
import { ModalIds } from "types/ModalIds";
import { Item, Span } from "@components/Item";
import { Name } from "@actions/officer/OfficerTypes";

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
  names: Name[];
  nameSearch: (name: string) => Promise<boolean>;
  saveNote: (citizenId: string, note: string) => void;
  searchNames: () => void;
  suspendLicense: (type: string, citizenId: string) => void;
  deleteRecordById: (id: string, type: string, citizenId: string) => void;
}

const NameSearchModalC: React.FC<Props> = ({
  search,
  names,
  nameSearch,
  saveNote,
  searchNames,
  suspendLicense,
  deleteRecordById,
}) => {
  const [name, setName] = React.useState<SelectValue | null>(null);
  const [note, setNote] = React.useState((search && search?.citizen?.note) || "");
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();
  const isSuspended = React.useCallback(
    (type: string) => {
      return search?.citizen?.[type] === "1";
    },
    [search?.citizen],
  );

  const showResults = React.useMemo(() => {
    return !name || search?.citizen?.full_name.toLowerCase() !== name.value.toLowerCase()
      ? false
      : search !== null && search?.type === "name";
  }, [name, search]);

  React.useEffect(() => {
    setNote(search?.citizen?.note || "");
    searchNames();
  }, [search?.citizen, name, searchNames]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name?.value) return;
    setLoading(true);

    await nameSearch(name?.value);

    setLoading(false);
  }

  function addNote() {
    search.citizen?.id && saveNote(search.citizen.id, note);
  }

  const handleSuspend = (type: string) => () => {
    suspendLicense(type, search?.citizen?.id);
  };

  const deleteRecord = (id: string, type: string, citizenId: string) => () => {
    deleteRecordById(id, type, citizenId);
  };

  return (
    <Modal title={lang.global.name_search} size="lg" id={ModalIds.NameSearch}>
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          {showResults && search?.warrants[0] ? (
            <AlertMessage message={{ msg: lang.record.has_warrant, type: "warning" }} />
          ) : null}
          {showResults && search.citizen.dead === "1" ? (
            <AlertMessage
              message={{
                msg: `${lang.officers.citizen_dead} ${format(
                  Number(search.citizen.dead_on),
                  /* EG: 1st Jan 2020  */
                  "MMMM do yyyy",
                )}`,
                type: "warning",
              }}
            />
          ) : null}
          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              {lang.global.name}
            </label>
            <Select
              closeMenuOnSelect={true}
              isMulti={false}
              value={name}
              onChange={(v: any) => setName(v)}
              options={names.map(({ full_name }) => ({
                value: full_name,
                label: full_name,
              }))}
            />
          </div>

          {showResults ? (
            search?.citizen ? (
              <div className="mt-3 row">
                <div className="col-md-6">
                  <h5>{lang.admin.cad_settings.general_info}</h5>

                  <div className="list-group" id="general_info">
                    <div id="image_id">
                      <Image
                        layout="fixed"
                        width="100px"
                        height="100px"
                        src={`/citizen-images/${search.citizen.image_id}`}
                        className="object-fit-center rounded-circle mb-1"
                      />
                    </div>

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
                      {isSuspended("dmv") ? (
                        lang.officers.suspended
                      ) : (
                        <>
                          {search.citizen.dmv}{" "}
                          <button
                            onClick={handleSuspend("dmv")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                        </>
                      )}
                    </Item>

                    <Item id="fire_license">
                      <Span>{lang.citizen.license.firearms}: </Span>
                      {isSuspended("fire_license") ? (
                        lang.officers.suspended
                      ) : (
                        <>
                          {search.citizen.fire_license}{" "}
                          <button
                            onClick={handleSuspend("fire_license")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                        </>
                      )}
                    </Item>

                    <Item id="pilot_license">
                      <Span>{lang.citizen.license.pilot}: </Span>
                      {isSuspended("pilot_license") ? (
                        lang.officers.suspended
                      ) : (
                        <>
                          {search.citizen.pilot_license}{" "}
                          <button
                            onClick={handleSuspend("pilot_license")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                        </>
                      )}
                    </Item>

                    <Item id="ccw">
                      <Span>{lang.citizen.license.ccw}: </Span>
                      {isSuspended("ccw") ? (
                        lang.officers.suspended
                      ) : (
                        <>
                          {search.citizen.ccw}{" "}
                          <button
                            onClick={handleSuspend("ccw")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                        </>
                      )}
                    </Item>

                    <div className="mt-3" id="note">
                      <label style={{ fontSize: "1.2rem" }} htmlFor="note">
                        {lang.officers.add_note}
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
                        {lang.officers.save_note}
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
                              className="list-group-item border-dark text-dark position-relative"
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

                              <button
                                type="button"
                                onClick={deleteRecord(
                                  warning.id,
                                  "written_warning",
                                  warning.citizen_id,
                                )}
                                className="btn btn-danger"
                                style={{ position: "absolute", bottom: "0.2rem", right: "0.2rem" }}
                              >
                                {lang.global.delete}
                              </button>
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
                              className="list-group-item border-dark text-dark position-relative"
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

                              <button
                                type="button"
                                onClick={deleteRecord(ticket.id, "ticket", ticket.citizen_id)}
                                className="btn btn-danger"
                                style={{ position: "absolute", bottom: "0.2rem", right: "0.2rem" }}
                              >
                                {lang.global.delete}
                              </button>
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
                              className="list-group-item border-dark text-dark position-relative"
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

                              <button
                                type="button"
                                onClick={deleteRecord(
                                  report.id,
                                  "arrest_report",
                                  report.citizen_id,
                                )}
                                className="btn btn-danger"
                                style={{ position: "absolute", bottom: "0.2rem", right: "0.2rem" }}
                              >
                                {lang.global.delete}
                              </button>
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
                              className="list-group-item border-dark text-dark position-relative"
                              key={idx}
                              id={`${idx}`}
                            >
                              <Item id="warrants">
                                <Span>{lang.record.warrant}: </Span>
                                {warrant.reason}
                              </Item>

                              <Item id="status">
                                <Span>{lang.dispatch.status}: </Span>
                                {warrant.status}
                              </Item>

                              <button
                                type="button"
                                onClick={deleteRecord(warrant.id, "warrant", warrant.name)}
                                className="btn btn-danger"
                                style={{ position: "absolute", bottom: "0.2rem", right: "0.2rem" }}
                              >
                                {lang.global.delete}
                              </button>
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
                      {lang.citizen.weapon.reged_weapons} ({search.weapons.length})
                    </h5>

                    <ul style={{ maxHeight: "20rem" }} className="list-group overflow-auto">
                      {!search.weapons[0] ? (
                        <li className="list-group-item border-dark text-dark">
                          {lang.record.no_weapons}
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
          {router.pathname === "/leo/dash" ? (
            <>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-target={`#${ModalIds.CreateTicket}`}
                data-bs-toggle="modal"
              >
                {lang.global.create_ticket}
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-bs-target={`#${ModalIds.CreateArrestReport}`}
                data-bs-toggle="modal"
              >
                {lang.global.create_arrest_report}
              </button>
            </>
          ) : null}

          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
            {lang.global.close}
          </button>
          <button type="submit" disabled={!name?.value || loading} className="btn btn-primary">
            {loading ? `${lang.global.loading}..` : lang.global.search}
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

export const NameSearchModal = connect(mapToProps, {
  nameSearch,
  saveNote,
  searchNames,
  suspendLicense,
  deleteRecordById,
})(NameSearchModalC);