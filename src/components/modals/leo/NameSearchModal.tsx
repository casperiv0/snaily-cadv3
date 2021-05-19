import * as React from "react";
import format from "date-fns/format";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import { Modal } from "@components/Modal/Modal";
import lang from "../../../language.json";
import { Nullable, State } from "types/State";
import { AlertMessage } from "@components/AlertMessage/AlertMessage";
import { Citizen } from "types/Citizen";
import { Weapon } from "types/Weapon";
import { Vehicle } from "types/Vehicle";
import {
  nameSearch,
  saveNote,
  searchNames,
  suspendLicense,
  setCitizenDanger,
} from "@actions/officer/OfficerActions";
import { deleteRecordById } from "@actions/record/RecordActions";
import { Warrant, Ticket, ArrestReport, WrittenWarning } from "types/Record";
import { Select, SelectValue } from "@components/Select/Select";
import { ModalIds } from "types/ModalIds";
import { Item, Span } from "@components/Item";
import { Name } from "@actions/officer/OfficerTypes";
import { Perm } from "types/Perm";
import { PenalCode } from "types/PenalCode";
import {
  getPenalCodesFromSelectValues,
  getTotalJailTimeAndFineAmount,
  isCadFeatureEnabled,
} from "@lib/utils";
import { Cad } from "types/Cad";

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
  penalCodes: PenalCode[];
  cadInfo: Nullable<Cad>;
  nameSearch: (name: string) => Promise<boolean>;
  saveNote: (citizenId: string, note: string) => void;
  searchNames: () => void;
  suspendLicense: (licenseType: string, type: "revoke" | "suspend", citizenId: string) => void;
  deleteRecordById: (id: string, type: string, citizenId: string) => void;
  setCitizenDanger: (type: Perm, citizenId: string) => void;
}

const NameSearchModalC: React.FC<Props> = ({
  search,
  names,
  penalCodes,
  cadInfo,
  nameSearch,
  saveNote,
  searchNames,
  suspendLicense,
  deleteRecordById,
  setCitizenDanger,
}) => {
  const [name, setName] = React.useState<Nullable<SelectValue>>(null);
  const [note, setNote] = React.useState((search && search?.citizen?.note) || "");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setNote(search?.citizen?.note || "");
    searchNames();
  }, [search?.citizen, name, searchNames]);

  const router = useRouter();
  const isSuspendedOrRevoked = React.useCallback(
    (type: string) => {
      if (search.citizen?.[type] === "1") {
        return lang.officers.suspended;
      } else if (search.citizen?.[type] === "2") {
        return lang.officers.revoked;
      } else {
        return null;
      }
    },
    [search?.citizen],
  );

  const showResults = React.useMemo(() => {
    return !name || search?.citizen?.full_name.toLowerCase() !== name.value.toLowerCase()
      ? false
      : search !== null && search?.type === "name";
  }, [name, search]);

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

  const handleSuspend = (licenseType: string, type: "revoke" | "suspend") => () => {
    suspendLicense(licenseType, type, search?.citizen?.id);
  };

  const deleteRecord = (id: string, type: string, citizenId: string) => () => {
    deleteRecordById(id, type, citizenId);
  };

  function handleDangerous() {
    const type = search.citizen.is_dangerous === "1" ? "0" : "1";
    setCitizenDanger(type, search.citizen.id);
  }

  return (
    <Modal
      title={lang.global.name_search}
      size={showResults ? "xl" : "lg"}
      id={ModalIds.NameSearch}
    >
      <form onSubmit={onSubmit}>
        <div className="modal-body">
          {showResults && search?.warrants[0] ? (
            <AlertMessage message={{ msg: lang.record.has_warrant, type: "warning" }} />
          ) : null}
          {showResults && search?.citizen.is_dangerous === "1" ? (
            <AlertMessage message={{ msg: lang.citizen.dangerous_subject, type: "danger" }} />
          ) : null}
          {showResults && search.citizen.dead === "1" ? (
            <AlertMessage
              message={{
                msg: `${lang.officers.citizen_dead} ${format(
                  Number(search.citizen.dead_on),
                  /* eG: 1st Jan 2020  */
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
                  <h1 className="h3">{lang.admin.cad_settings.general_info}</h1>

                  <div style={{ display: "flex" }} className="mt-3">
                    <img
                      alt={search.citizen.image_id}
                      className="object-fit-center"
                      src={`/static/citizen-images/${search.citizen.image_id}`}
                      style={{ width: "120px", height: "120px" }}
                    />

                    <div className="ms-2">
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
                      <Item id="phone_nr">
                        <Span>{lang.citizen.phone_number}: </Span>
                        {search.citizen.phone_nr || "None"}
                      </Item>
                    </div>

                    <div className="ms-4">
                      <Item id="eye_color">
                        <Span>{lang.citizen.eye_color}: </Span>
                        {search.citizen.eye_color}
                      </Item>
                      <Item id="address">
                        <Span>{lang.citizen.address}: </Span>
                        {search.citizen.address}
                      </Item>
                      <Item id="height">
                        <Span>{lang.citizen.height}: </Span>
                        {search.citizen.height}
                      </Item>
                      <Item id="weight">
                        <Span>{lang.citizen.weight}: </Span>
                        {search.citizen.weight}
                      </Item>

                      {isCadFeatureEnabled(cadInfo?.features, "company") ? (
                        <Item id="height">
                          <Span>{lang.citizen.employer}: </Span>
                          {search.citizen.business !== "none"
                            ? search.citizen.business
                            : lang.citizen.not_working}
                        </Item>
                      ) : null}

                      {search.citizen.officer?.officer_name ? (
                        <Item id="officer">
                          <Span>{lang.global.officer}: </Span>
                          {`${search.citizen.officer.callsign} ${search.citizen.officer.officer_name}`}
                        </Item>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h1 className="h3">{lang.citizen.licenses}</h1>

                    <Item id="dmv">
                      <Span>{lang.citizen.license.dmv}: </Span>
                      {isSuspendedOrRevoked("dmv") ?? (
                        <>
                          {search.citizen.dmv}{" "}
                          <button
                            onClick={handleSuspend("dmv", "suspend")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                          <button
                            onClick={handleSuspend("dmv", "revoke")}
                            type="button"
                            className="suspend-btn link-primary ms-2"
                          >
                            {lang.officers.revoke_license}
                          </button>
                        </>
                      )}
                    </Item>

                    <Item id="fire_license">
                      <Span>{lang.citizen.license.firearms}: </Span>
                      {isSuspendedOrRevoked("fire_license") ?? (
                        <>
                          {search.citizen.fire_license}{" "}
                          <button
                            onClick={handleSuspend("fire_license", "suspend")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                          <button
                            onClick={handleSuspend("fire_license", "revoke")}
                            type="button"
                            className="suspend-btn link-primary ms-2"
                          >
                            {lang.officers.revoke_license}
                          </button>
                        </>
                      )}
                    </Item>

                    <Item id="pilot_license">
                      <Span>{lang.citizen.license.pilot}: </Span>
                      {isSuspendedOrRevoked("pilot_license") ?? (
                        <>
                          {search.citizen.pilot_license}{" "}
                          <button
                            onClick={handleSuspend("pilot_license", "suspend")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                          <button
                            onClick={handleSuspend("pilot_license", "revoke")}
                            type="button"
                            className="suspend-btn link-primary ms-2"
                          >
                            {lang.officers.revoke_license}
                          </button>
                        </>
                      )}
                    </Item>

                    <Item id="ccw">
                      <Span>{lang.citizen.license.ccw}: </Span>
                      {isSuspendedOrRevoked("ccw") ?? (
                        <>
                          {search.citizen.ccw}{" "}
                          <button
                            onClick={handleSuspend("ccw", "suspend")}
                            type="button"
                            className="suspend-btn link-primary"
                          >
                            {lang.officers.suspend_license}
                          </button>
                          <button
                            onClick={handleSuspend("ccw", "revoke")}
                            type="button"
                            className="suspend-btn link-primary ms-2"
                          >
                            {lang.officers.revoke_license}
                          </button>
                        </>
                      )}
                    </Item>
                  </div>

                  <div className="d-flex gap-2 mt-2 mb-2">
                    <button
                      type="button"
                      className="btn btn-primary col-md-5 mt-3"
                      data-bs-toggle="modal"
                      data-bs-target={`#${ModalIds.Mugshots}`}
                    >
                      {lang.officers.manage_mugshots}
                    </button>
                    <button
                      onClick={handleDangerous}
                      type="button"
                      className={`btn  col-md-5 mt-3 ${
                        search.citizen?.is_dangerous === "1" ? "btn-success" : "btn-danger"
                      } `}
                    >
                      {search.citizen?.is_dangerous === "1"
                        ? lang.officers.safe_citizen
                        : lang.officers.citizen_danger}
                    </button>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="list-group" id="note">
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

                <div className="collapse mt-3 show" id="records">
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
                          const { fineAmount } = getTotalJailTimeAndFineAmount(
                            getPenalCodesFromSelectValues(
                              ticket.violations.split(", "),
                              penalCodes,
                            ),
                          );

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

                              <Item id="amount">
                                <Span>{lang.codes.fine_amount2}: </Span>
                                {fineAmount}
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
                          const { fineAmount, jailTime } = getTotalJailTimeAndFineAmount(
                            getPenalCodesFromSelectValues(report.charges.split(", "), penalCodes),
                          );

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

                              <Item id="amount">
                                <Span>{lang.codes.fine_amount2}: </Span>
                                {fineAmount}
                              </Item>

                              <Item id="jailTime">
                                <Span>{lang.codes.jail_time2}: </Span>
                                {jailTime} {lang.codes.seconds}
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

                              {"officer_name" in warrant ? (
                                <Item id="officer_name">
                                  <Span>{lang.dispatch.officer_name}: </Span>
                                  {warrant.officer_name}
                                </Item>
                              ) : null}

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
                  {/* vehicles */}
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
  penalCodes: state.admin.penalCodes,
  cadInfo: state.global.cadInfo,
});

export const NameSearchModal = connect(mapToProps, {
  nameSearch,
  saveNote,
  searchNames,
  suspendLicense,
  deleteRecordById,
  setCitizenDanger,
})(NameSearchModalC);
