import * as React from "react";
import format from "date-fns/format";
import { Citizen } from "types/Citizen";
import { AlertMessage } from "../AlertMessage/AlertMessage";
import { DeleteCitizenModal } from "../modals/admin/DeleteCitizenModal";
import lang from "src/language.json";
import { Item, Span } from "@components/Item";

interface Props {
  citizens: Citizen[];
}

export const AllCitizensTab: React.FC<Props> = ({ citizens }) => {
  const [tempCitizen, setTempCitizen] = React.useState<Partial<Citizen> | null>(null);

  return (
    <>
      {!citizens[0] ? (
        <AlertMessage message={{ msg: lang.citizen.no_citizens_cad, type: "warning" }} />
      ) : !citizens[0] ? (
        <AlertMessage message={{ msg: lang.citizen.citizen_not_found_by_name, type: "warning" }} />
      ) : (
        <ul className="list-group">
          {citizens.map((citizen: Citizen, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              >
                <div>
                  <div>
                    {++idx} | {citizen.full_name}
                    <Item id="username">
                      <Span>Account&apos;s username: </Span>
                      {citizen.user?.username}
                    </Item>
                  </div>

                  <div className="collapse mt-2" id={`citizen_info_${citizen.id}`}>
                    <Item id="full_name">
                      <Span>{lang.citizen.full_name}: </Span>
                      {citizen.full_name}
                    </Item>
                    <Item id="gender">
                      <Span>{lang.citizen.gender}: </Span>
                      {citizen.gender}
                    </Item>
                    <Item id="ethnicity">
                      <Span>{lang.citizen.ethnicity}: </Span>
                      {citizen.ethnicity}
                    </Item>
                    <Item id="hair_color">
                      <Span>{lang.citizen.hair_color}: </Span>
                      {citizen.hair_color}
                    </Item>
                    <Item id="eye_color">
                      <Span>{lang.citizen.eye_color}: </Span>
                      {citizen.eye_color}
                    </Item>
                    <Item id="address">
                      <Span>{lang.citizen.address}: </Span>
                      {citizen.address}
                    </Item>
                    <Item id="height">
                      <Span>{lang.citizen.height}: </Span>
                      {citizen.height}
                    </Item>
                    <Item id="weight">
                      <Span>{lang.citizen.weight}: </Span>
                      {citizen.weight}
                    </Item>
                    <Item id="business">
                      <Span>{lang.citizen.employer}: </Span>
                      {citizen.business}
                    </Item>
                    <Item id="dead">
                      <Span>Dead: </Span>
                      {citizen.dead === "1"}
                    </Item>
                    {citizen.dead === "1" ? (
                      <Item id="dead_on">
                        <Span>Declared dead on: </Span>
                        {format(Number(citizen.dead_on), "MMMM do yyyy")}
                      </Item>
                    ) : null}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target={"#deleteCitizenModal"}
                    onClick={() => setTempCitizen(citizen)}
                  >
                    {lang.citizen.delete_citizen}
                  </button>
                  <button
                    className="btn btn-primary mx-2"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#citizen_info_${citizen.id}`}
                    aria-expanded="false"
                    aria-controls={`citizen_info_${citizen.id}`}
                  >
                    {lang.admin.toggle_info}
                  </button>
                </div>
              </li>
            );
          })}

          <DeleteCitizenModal name={tempCitizen?.full_name} id={tempCitizen?.id} />
        </ul>
      )}
    </>
  );
};
