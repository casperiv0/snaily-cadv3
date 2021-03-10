import * as React from "react";
import AlertMessage from "../alert-message";
import lang from "../../language.json";
import { ExpungementRequest } from "../../lib/actions/court";
import { acceptOrDeclineRequest } from "../../lib/actions/admin";
import { connect } from "react-redux";
import { Item, Span } from "../../pages/citizen/citizen-info";

interface Props {
  requests: ExpungementRequest[];
  acceptOrDeclineRequest: (type: "accept" | "decline", request: ExpungementRequest) => void;
}

const ExpungementRequestsTab: React.FC<Props> = ({ requests, acceptOrDeclineRequest }) => {
  return (
    <>
      {!requests[0] ? (
        <AlertMessage message={{ msg: "There are no active requests", type: "warning" }} />
      ) : (
        <ul className="list-group">
          {requests.map((request: ExpungementRequest, idx: number) => {
            return (
              <li
                key={idx}
                id={`${idx}`}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between"
              >
                <div>
                  <p>Warrants: {request.warrants.map((war) => war.label).join(", ") || "N/A"}</p>
                  <p>
                    Arrest Reports:{" "}
                    {request.arrestReports.map((arr) => arr.label).join(", ") || "N/A"}
                  </p>
                  <p>
                    Tickets: {request.tickets.map((ticket) => ticket.label).join(", ") || "N/A"}
                  </p>

                  <Item id="username">
                    <Span>Username: </Span>
                    {request?.user?.username ?? "Could not get username"}
                  </Item>

                  <Item id="full_name">
                    <Span>Citizen Name: </Span>
                    {request?.citizen?.full_name ?? "Could not get citizen name"}
                  </Item>
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

export default connect(null, { acceptOrDeclineRequest })(ExpungementRequestsTab);
