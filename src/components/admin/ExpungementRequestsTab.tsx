import * as React from "react";
import { connect } from "react-redux";
import { AlertMessage } from "../AlertMessage/AlertMessage";
import lang from "../../language.json";
import { ExpungementRequest } from "types/ExpungementRequest";
import { acceptOrDeclineRequest } from "@actions/admin/AdminActions";
import { Item, Span } from "@components/Item";

interface Props {
  requests: ExpungementRequest[];
  acceptOrDeclineRequest: (type: "accept" | "decline", request: ExpungementRequest) => void;
}

const ExpungementRequestsTabC: React.FC<Props> = ({ requests, acceptOrDeclineRequest }) => {
  return (
    <>
      {!requests[0] ? (
        <AlertMessage message={{ msg: lang.admin.no_expungement_requests, type: "warning" }} />
      ) : (
        <ul className="list-group">
          {requests?.map((request: ExpungementRequest, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
              >
                <div>
                  <p>
                    {lang.record.warrants}:{" "}
                    {request.warrants?.map((war) => war.label).join(", ") || "N/A"}
                  </p>
                  <p>
                    {lang.record.arr_rep}:{" "}
                    {request.arrestReports?.map((arr) => arr.label).join(", ") || "N/A"}
                  </p>
                  <p>
                    {lang.record.tickets}:{" "}
                    {request.tickets?.map((ticket) => ticket.label).join(", ") || "N/A"}
                  </p>

                  <Item id="username">
                    <Span>{lang.auth.username}: </Span>
                    {request?.user?.username ?? lang.auth.error_username}
                  </Item>

                  <Item id="full_name">
                    <Span>{lang.auth.citizen_name}: </Span>
                    {request?.citizen?.full_name ?? lang.auth.error_citizen}
                  </Item>

                  {request.reason ? (
                    <Item id="reason">
                      <Span>{lang.admin.reason}: </Span>
                      {request?.reason}
                    </Item>
                  ) : null}
                </div>

                <div>
                  <button
                    onClick={() => acceptOrDeclineRequest("decline", request)}
                    type="button"
                    className="btn btn-danger"
                  >
                    {lang.global.decline}
                  </button>
                  <button
                    onClick={() => acceptOrDeclineRequest("accept", request)}
                    className="btn btn-success mx-2"
                    type="button"
                  >
                    {lang.global.accept}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export const ExpungementRequestsTab = connect(null, { acceptOrDeclineRequest })(
  ExpungementRequestsTabC,
);
