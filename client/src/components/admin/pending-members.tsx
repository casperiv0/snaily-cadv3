import * as React from "react";
import { connect } from "react-redux";
import User from "../../interfaces/User";
import lang from "../../language.json";
import { acceptUser, declineUser } from "../../lib/actions/admin";
import AlertMessage from "../alert-message";

interface Props {
  members: User[];
  acceptUser: (id: string) => void;
  declineUser: (id: string) => void;
}

const PendingMembersTab: React.FC<Props> = ({ members, acceptUser, declineUser }) => {
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
                        acceptUser(member.id);
                      }}
                    >
                      {lang.global.accept}
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      type="button"
                      onClick={() => {
                        declineUser(member.id);
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

export default connect(null, { acceptUser, declineUser })(PendingMembersTab);
