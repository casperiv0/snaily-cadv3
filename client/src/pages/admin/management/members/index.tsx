import * as React from "react";
import { connect } from "react-redux";
import { getMembers } from "../../../../lib/actions/admin";
import lang from "../../../../language.json";
import AdminLayout from "../../../../components/admin/AdminLayout";
import AlertMessage from "../../../../components/alert-message";
import State from "../../../../interfaces/State";
import User from "../../../../interfaces/User";
import AllMembersTab from "../../../../components/admin/all-members";
import PendingMembersTab from "../../../../components/admin/pending-members";

interface Props {
  message: string;
  members: User[];
  getMembers: () => void;
}

const ManageMembersPage: React.FC<Props> = ({ message, members, getMembers }) => {
  const [filtered, setFiltered] = React.useState<any[]>([]);
  const [filter, setFilter] = React.useState<string>("");

  React.useEffect(() => {
    getMembers();
  }, [getMembers]);

  React.useEffect(() => {
    if (members[0]) {
      setFiltered(members);
    }
  }, [members]);

  function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
    setFilter(e.target.value);

    const filteredItems = members.filter((member: User) =>
      member.username.toLowerCase().includes(e.target.value.toLowerCase()),
    );
    setFiltered(filteredItems);
  }

  return (
    <AdminLayout>
      {message ? <AlertMessage type="success" message={message} dismissible /> : null}

      <ul className="list-group">
        <input
          type="text"
          value={filter}
          onChange={handleFilter}
          className="form-control bg-dark border-dark mb-2 text-light"
          placeholder={`${lang.global.search}..`}
        />

        {!members[0] ? (
          <AlertMessage type="warning" message={lang.admin.no_members_cad} />
        ) : !filtered[0] ? (
          <AlertMessage type="warning" message={lang.admin.no_member_found_by_name} />
        ) : (
          <div>
            <div className="nav nav-tabs">
              <a
                className="nav-item nav-link active bg-dark text-light border-secondary"
                id="nav-home-tab"
                data-toggle="tab"
                href="#members"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
              >
                {lang.admin.all_members}
              </a>
              <a
                className="nav-item nav-link bg-dark text-light border-secondary"
                id="nav-contact-tab"
                data-toggle="tab"
                href="#pending"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
              >
                {lang.admin.pending_members}
                <div className="badge badge-primary ml-2">
                  {members.filter((m) => m.whitelist_status === "pending").length}
                </div>
              </a>
            </div>

            <div className="tab-content">
              <div
                className="tab-pane fade show active"
                id="members"
                role="tabpanel"
                aria-labelledby="members-tab"
              >
                <AllMembersTab members={filtered} />
              </div>

              <div
                className="tab-pane fade active"
                id="pending"
                role="tabpanel"
                aria-labelledby="pending-tab"
              >
                <PendingMembersTab members={filtered} />
              </div>
            </div>
          </div>
        )}
      </ul>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  members: state.admin.members,
  message: state.global.message,
});

export default connect(mapToProps, { getMembers })(ManageMembersPage);
