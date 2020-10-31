import * as React from "react";
import { connect } from "react-redux";
import { getMembers } from "../../../../lib/actions/admin";
import lang from "../../../../language.json";
import AdminLayout from "../../../../components/admin/AdminLayout";
import AlertMessage from "../../../../components/alert-message";
import State from "../../../../interfaces/State";
import User from "../../../../interfaces/User";
import { Item, Span } from "../../../citizen/citizen-info";

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
      {message ? <AlertMessage type="success" message={message} /> : null}

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
        ) : !filtered ? (
          <AlertMessage type="warning" message={lang.admin.no_member_found_by_name} />
        ) : (
          filtered.map((member: User, idx: number) => {
            return (
              <li
                key={idx}
                className="list-group-item bg-dark border-secondary d-flex justify-content-between"
              >
                <div>
                  {++idx} | {member.username}
                  <div className="collapse mt-2" id={`member_info_${member.id}`}>
                    <Item id="rank">
                      <Span>{lang.global.rank}: </Span>
                      {member.rank}
                    </Item>
                    <Item id="leo">
                      <Span>{lang.auth.account.police_access}: </Span>
                      {member.leo}
                    </Item>
                    <Item id="dispatch">
                      <Span>{lang.auth.account.dispatch_access}: </Span>
                      {member.dispatch}
                    </Item>
                    <Item id="ems_fd">
                      <Span>{lang.auth.account.ems_fd_access}: </Span>
                      {member.ems_fd}
                    </Item>
                    <Item id="tow">
                      <Span>{lang.auth.account.tow_access}: </Span>
                      {member.tow}
                    </Item>
                    <Item id="rank">
                      <Span>{lang.auth.account.ems_fd_access}: </Span>
                      {member.ems_fd}
                    </Item>
                    <Item id="rank">
                      <Span>{lang.auth.account.banned}: </Span>
                      {member.banned} <br />
                      {member.banned === "1" && (
                        <>
                          <Span>{lang.auth.account.ban_reason}: </Span>
                          {member.ban_reason}
                        </>
                      )}
                    </Item>
                  </div>
                </div>

                <div>
                  <button
                    className="btn btn-primary"
                    type="button"
                    data-toggle="collapse"
                    data-target={`#member_info_${member.id}`}
                    aria-expanded="false"
                    aria-controls={`member_info_${member.id}`}
                  >
                    {lang.admin.toggle_info}
                  </button>
                  <a className="btn btn-success ml-2" href={`/admin/manage/members/${member.id}`}>
                    {lang.admin.manage_perms}
                  </a>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  members: state.admin.members,
});

export default connect(mapToProps, { getMembers })(ManageMembersPage);
