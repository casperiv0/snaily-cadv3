import * as React from "react";
import { connect } from "react-redux";
import { User } from "types/User";
import lang from "src/language.json";
import { acceptOrDeclineUser } from "@actions/admin/AdminActions";
import { AlertMessage } from "../AlertMessage/AlertMessage";

interface Props {
  members: User[];
  acceptOrDeclineUser: (type: "accept" | "decline", id: string) => Promise<boolean>;
}

const PendingMembersTabC: React.FC<Props> = ({ members, acceptOrDeclineUser }) => {
  return (
    <>
      <h3 className="mb-2 mt-4">{lang.admin.pending_members}</h3>
      <ul className="list-group">
        {!members.filter((m) => m.whitelist_status === "pending")[0] ? (
          <AlertMessage message={{ type: "warning", msg: "No pending members" }} />
        ) : (
          members
            .filter((m) => m.whitelist_status === "pending")
            .map((member: User, idx: number) => {
              return (
                <li
                  key={idx}
                  className="list-group-item bg-dark border-secondary d-flex justify-content-between text-white"
                >
                  <div>
                    {++idx} | {member.username}
                  </div>

                  <div>
                    <button
                      className="btn btn-success"
                      type="button"
                      onClick={() => {
                        acceptOrDeclineUser("accept", member.id);
                      }}
                    >
                      {lang.global.accept}
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      type="button"
                      onClick={() => {
                        acceptOrDeclineUser("decline", member.id);
                      }}
                    >
                      {lang.global.decline}
                    </button>
                  </div>
                </li>
              );
            })
        )}
      </ul>
    </>
  );
};

export const PendingMembersTab = connect(null, { acceptOrDeclineUser })(PendingMembersTabC);
