import * as React from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import AdminLayout from "../../../../components/admin/AdminLayout";
import AlertMessage from "../../../../components/alert-message";
import Select from "../../../../components/select";
import useDocTitle from "../../../../hooks/useDocTitle";
import Match from "../../../../interfaces/Match";
import State from "../../../../interfaces/State";
import User from "../../../../interfaces/User";
import lang from "../../../../language.json";
import {
  getMemberById,
  updateMemberPerms,
  banMember,
  unBanMember,
  removeUser,
} from "../../../../lib/actions/admin";
import { Item, Span } from "../../../citizen/citizen-info";

interface Props {
  member: User | null;
  user: User | null;
  match: Match;
  cad: any;
  getMemberById: (id: string) => void;
  updateMemberPerms: (id: string, data: object) => void;
  unBanMember: (id: string) => void;
  banMember: (id: string, banReason: string) => void;
  removeUser: (id: string) => Promise<boolean>;
}

const ManageMember: React.FC<Props> = ({
  member,
  user: authenticatedUser,
  match,
  cad,
  getMemberById,
  updateMemberPerms,
  banMember,
  unBanMember,
  removeUser,
}) => {
  const id = match.params.id;
  const [rank, setRank] = React.useState("");
  const [leo, setLeo] = React.useState("");
  const [supervisor, setSupervisor] = React.useState("");
  const [dispatch, setDispatch] = React.useState("");
  const [emsFd, setEmsFd] = React.useState("");
  const [tow, setTow] = React.useState("");
  const [banReason, setBanReason] = React.useState("");
  useDocTitle(`Managing ${member?.username}`);
  const history = useHistory();

  React.useEffect(() => {
    getMemberById(id);
  }, [getMemberById, id]);

  React.useEffect(() => {
    if (member?.id) {
      setRank(member?.rank);
      setLeo(member?.leo);
      setDispatch(member?.dispatch);
      setEmsFd(member?.ems_fd);
      setTow(member?.tow);
      setSupervisor(member.supervisor);
    }
  }, [member]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    updateMemberPerms(id, {
      rank,
      leo,
      dispatch,
      emsFd,
      tow,
      supervisor,
    });
  }

  function handleBan(e: React.FormEvent) {
    e.preventDefault();

    banMember(member?.id!, banReason);
  }

  function handleUnban() {
    unBanMember(member?.id!);
  }

  async function handleRemove() {
    const deleted = await removeUser(member?.id!);

    if (deleted === true) {
      history.push("/admin/manage/members");
    }
  }

  if (member !== null && !member) {
    return (
      <AdminLayout>
        <AlertMessage message={{ msg: "Not found", type: "danger" }} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="rank">
            {lang.global.rank}
          </label>
          {authenticatedUser?.username === member?.username ? (
            <AlertMessage message={{ type: "warning", msg: lang.admin.member.own_rank }} />
          ) : member?.rank === "owner" ? (
            <AlertMessage message={{ msg: lang.admin.member.owner, type: "warning" }} />
          ) : (
            <Select
              theme="dark"
              isMulti={false}
              value={{
                label: rank,
                value: rank,
              }}
              isClearable={false}
              onChange={(v) => setRank(v.value)}
              options={[
                { label: lang.admin.member.remove_rank, value: "user" },
                { label: lang.admin.member.moderator, value: "moderator" },
                { label: lang.admin.member.admin, value: "admin" },
              ]}
            />
          )}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="leo">
            {lang.auth.account.police_access}
          </label>

          <Select
            theme="dark"
            isMulti={false}
            value={{
              label: leo === "1" ? lang.global.yes : lang.global.no,
              value: leo,
            }}
            isClearable={false}
            onChange={(v) => setLeo(v.value)}
            options={[
              { label: lang.global.yes, value: "1" },
              { label: lang.global.no, value: "0" },
            ]}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="leo">
            LEO Supervisor
          </label>

          <Select
            theme="dark"
            isMulti={false}
            value={{
              label: supervisor === "1" ? lang.global.yes : lang.global.no,
              value: supervisor,
            }}
            isClearable={false}
            onChange={(v) => setSupervisor(v.value)}
            options={[
              { label: lang.global.yes, value: "1" },
              { label: lang.global.no, value: "0" },
            ]}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="dispatch">
            {lang.auth.account.dispatch_access}
          </label>

          <Select
            theme="dark"
            isMulti={false}
            value={{
              label: dispatch === "1" ? lang.global.yes : lang.global.no,
              value: dispatch,
            }}
            isClearable={false}
            onChange={(v) => setDispatch(v.value)}
            options={[
              { label: lang.global.yes, value: "1" },
              { label: lang.global.no, value: "0" },
            ]}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="ems_fd">
            {lang.auth.account.ems_fd_access}
          </label>

          <Select
            theme="dark"
            isMulti={false}
            value={{
              label: emsFd === "1" ? lang.global.yes : lang.global.no,
              value: emsFd,
            }}
            isClearable={false}
            onChange={(v) => setEmsFd(v.value)}
            options={[
              { label: lang.global.yes, value: "1" },
              { label: lang.global.no, value: "0" },
            ]}
          />
        </div>
        {cad.tow_whitelisted === "1" ? (
          <div className="mb-3">
            <label className="form-label" htmlFor="tow">
              {lang.auth.account.tow_access}
            </label>

            <Select
              theme="dark"
              isMulti={false}
              value={{
                label: tow === "1" ? lang.global.yes : lang.global.no,
                value: tow,
              }}
              isClearable={false}
              onChange={(v) => setTow(v.value)}
              options={[
                { label: lang.global.yes, value: "1" },
                { label: lang.global.no, value: "0" },
              ]}
            />
          </div>
        ) : null}

        <div className="mb-3 float-end">
          <Link className="btn btn-danger me-2" to="/admin/manage/members">
            {lang.global.cancel}
          </Link>
          <button type="submit" className="btn btn-primary">
            {lang.admin.update_perms}
          </button>
        </div>
      </form>

      <div style={{ marginTop: "5rem", width: "100%" }}>
        <div className="card bg-dark border-dark">
          <div className="card-header">
            <h5 className="card-title">Use the ban hammer</h5>
          </div>

          <form onSubmit={handleBan} className="card-body">
            {authenticatedUser?.id === member?.id ? (
              <AlertMessage message={{ msg: lang.admin.ban_yourself, type: "warning" }} />
            ) : member?.rank === "owner" ? (
              <AlertMessage message={{ msg: lang.admin.ban_owner, type: "warning" }} />
            ) : member?.banned === "1" ? (
              <>
                <Item id="ban_reason">
                  <Span>{lang.admin.banned_for}: </Span> {member?.ban_reason}
                </Item>
                <button type="button" onClick={handleUnban} className="btn btn-success mt-2 col">
                  {lang.admin.un_ban_user}
                </button>
              </>
            ) : (
              <>
                <input
                  id="ban_reason"
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  onChange={(e) => setBanReason(e.target.value)}
                  value={banReason}
                  placeholder={lang.admin.enter_ban_reason}
                  required
                />
                <button type="submit" className="btn btn-danger mt-2 col">
                  {lang.admin.ban_user}
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      <div style={{ marginTop: "2rem", width: "100%" }}>
        <div className="card bg-dark border-dark">
          <div className="card-header">
            <h5 className="card-title">Remove user</h5>
          </div>

          <div className="card-body">
            {authenticatedUser?.id === member?.id ? (
              <AlertMessage
                message={{ msg: "You cannot remove your own account", type: "warning" }}
              />
            ) : member?.rank === "owner" ? (
              <AlertMessage
                message={{ msg: "You cannot remove the owner's account", type: "warning" }}
              />
            ) : (
              <button onClick={handleRemove} className="btn btn-danger mt-2 col">
                Remove User
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const mapToProps = (state: State) => ({
  member: state.admin.member,
  user: state.auth.user,
  cad: state.global.cadInfo,
});

export default connect(mapToProps, {
  getMemberById,
  updateMemberPerms,
  banMember,
  unBanMember,
  removeUser,
})(ManageMember);
